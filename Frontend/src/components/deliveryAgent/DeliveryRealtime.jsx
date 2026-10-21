import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { socket, connectSocket } from "../../socket/socket";
import { STORAGE_KEYS } from "../../constants/storageKeys";

import { getDeliveryProfile } from "../../redux/thunks/deliveryAgent/deliveryProfile.thunk";
import { getActiveDelivery } from "../../redux/thunks/deliveryAgent/deliveryActiveOrders.thunk";
import { updateDeliveryLocation } from "../../redux/thunks/deliveryAgent/deliveryLocation.thunk";

const ACTIVE = [
  "DELIVERY_ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
];

export default function DeliveryRealtime() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const busy = useRef(false);

  const profile = useSelector(
    (state) => state.deliveryProfile?.profile,
  );

  const delivery = useSelector(
    (state) => state.deliveryActiveOrder?.delivery,
  );

  const shouldTrack =
    Boolean(profile?.isOnline) || ACTIVE.includes(delivery?.status);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.DELIVERY_TOKEN);
    if (!token) return;

    const refresh = () => {
      dispatch(getDeliveryProfile());
      dispatch(getActiveDelivery());
    };

    const handleOffer = () => {
      toast(
        (t) => (
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/delivery/offers");
            }}
          >
            New delivery offer! Tap to open.
          </button>
        ),
        { id: "delivery-new-offer", duration: 10000 },
      );
    };

    socket.on("connect", refresh);
    socket.on("delivery:new-offer", handleOffer);
    socket.on("delivery:offer-response", refresh);

    connectSocket(token);
    refresh();

    return () => {
      socket.off("connect", refresh);
      socket.off("delivery:new-offer", handleOffer);
      socket.off("delivery:offer-response", refresh);
      toast.dismiss("delivery-new-offer");
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!shouldTrack) return;

    if (!navigator.geolocation) {
      dispatch({
        type: "deliveryLocation/setLocationError",
        payload: "This device does not support GPS.",
      });
      return;
    }

    let stopped = false;
    let latest = null;

    const send = async () => {
      if (stopped || !latest || busy.current) return;

      busy.current = true;
      try {
        await dispatch(updateDeliveryLocation(latest)).unwrap();
      } catch {
        // Existing thunk stores the error in Redux.
      } finally {
        busy.current = false;
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (stopped) return;

        const first = !latest;

        latest = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        if (first) void send();
      },
      (error) => {
        if (stopped) return;
        latest = null;

        dispatch({
          type: "deliveryLocation/setLocationError",
          payload: error.message || "Enable location permission.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      },
    );

    const timer = setInterval(send, 5000);

    return () => {
      stopped = true;
      clearInterval(timer);
      navigator.geolocation.clearWatch(watchId);
      dispatch({ type: "deliveryLocation/stopTracking" });
    };
  }, [dispatch, shouldTrack]);

  return null;
}