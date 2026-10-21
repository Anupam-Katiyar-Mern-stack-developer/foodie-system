import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateDeliveryLocationService } from "../../../services/deliveryAgent/deliveryLocation.service";

let locationWatchId = null;

export const updateDeliveryLocation = createAsyncThunk(
  "deliveryLocation/updateDeliveryLocation",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const response = await updateDeliveryLocationService({
        latitude,
        longitude,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update delivery location",
      );
    }
  },
);

export const startDeliveryLocationTracking = () => (dispatch) => {
  if (!navigator.geolocation) {
    dispatch({
      type: "deliveryLocation/setLocationError",
      payload: "Geolocation is not supported by this browser",
    });

    return;
  }

  if (locationWatchId !== null) {
    return;
  }

  locationWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      dispatch(
        updateDeliveryLocation({
          latitude,
          longitude,
        }),
      );
    },

    (error) => {
      dispatch({
        type: "deliveryLocation/setLocationError",
        payload: error.message || "Unable to access live location",
      });
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    },
  );
};

export const stopDeliveryLocationTracking = () => (dispatch) => {
  if (locationWatchId !== null) {
    navigator.geolocation.clearWatch(locationWatchId);
    locationWatchId = null;
  }

  dispatch({
    type: "deliveryLocation/stopTracking",
  });
};
