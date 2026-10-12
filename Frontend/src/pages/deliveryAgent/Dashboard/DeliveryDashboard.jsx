import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  Banknote,
  Bike,
  CheckCircle2,
  Navigation,
} from "lucide-react";

import PageHeader from "../../../components/common/PageHeader/PageHeader";

import StatCard from "../../../components/common/StatCard/StatCard";

import DeliveryStatusCard from "../../../components/deliveryAgent/dashboard/DeliveryStatusCard";

import CurrentDeliveryCard from "../../../components/deliveryAgent/dashboard/CurrentDeliveryCard";

import RecentDeliveries from "../../../components/deliveryAgent/dashboard/RecentDeliveries";

import {
  getDeliveryDashboard,
} from "../../../redux/thunks/deliveryAgent/deliveryDashboard.thunk";

import {
  getDeliveryProfile,
  updateDeliveryOnlineStatus,
} from "../../../redux/thunks/deliveryAgent/deliveryProfile.thunk";

import {
  startDeliveryLocationTracking,
  stopDeliveryLocationTracking,
} from "../../../redux/thunks/deliveryAgent/deliveryLocation.thunk";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [
    statusUpdating,
    setStatusUpdating,
  ] = useState(false);

  // =========================================
  // PROFILE
  // =========================================

  const {
    profile,
  } =
    useSelector(
      (state) => state.deliveryProfile,
    ) || {};

  const isOnline = Boolean(
    profile?.isOnline,
  );

  // =========================================
  // DASHBOARD
  // =========================================

  const {
    stats: dashboardStats,
    currentDelivery,
    recentDeliveries = [],
    fetchLoading,
  } = useSelector(
    (state) => state.deliveryDashboard,
  );

  // =========================================
  // INITIAL DATA
  // =========================================

  useEffect(() => {
    dispatch(getDeliveryProfile());

    dispatch(getDeliveryDashboard());
  }, [dispatch]);

  // =========================================
  // LIVE LOCATION TRACKING
  // =========================================

  useEffect(() => {
    if (isOnline) {
      dispatch(
        startDeliveryLocationTracking(),
      );
    } else {
      dispatch(
        stopDeliveryLocationTracking(),
      );
    }

    return () => {
      dispatch(
        stopDeliveryLocationTracking(),
      );
    };
  }, [
    dispatch,
    isOnline,
  ]);

  // =========================================
  // ONLINE / OFFLINE TOGGLE
  // =========================================

  const handleOnlineStatusToggle =
    async () => {
      if (statusUpdating) {
        return;
      }

      const nextStatus =
        !isOnline;

      try {
        setStatusUpdating(true);

        await dispatch(
          updateDeliveryOnlineStatus(
            nextStatus,
          ),
        ).unwrap();

        // Latest profile
        await dispatch(
          getDeliveryProfile(),
        ).unwrap();

        // Dashboard refresh
        await dispatch(
          getDeliveryDashboard(),
        ).unwrap();
      } catch (error) {
        console.error(
          "Delivery status update failed:",
          error,
        );
      } finally {
        setStatusUpdating(false);
      }
    };

  // =========================================
  // STATS
  // =========================================

  const stats = useMemo(
    () => [
      {
        key: "today",

        title:
          "Today's Deliveries",

        value:
          dashboardStats
            ?.todayDeliveries ??
          0,

        description:
          "Assigned today",

        icon: Bike,

        variant: "orange",
      },

      {
        key: "active",

        title:
          "Active Delivery",

        value:
          dashboardStats
            ?.activeDelivery ??
          0,

        description:
          "Currently delivering",

        icon: Navigation,

        variant: "warning",
      },

      {
        key: "completed",

        title:
          "Completed Today",

        value:
          dashboardStats
            ?.completedToday ??
          0,

        description:
          "Successfully delivered",

        icon: CheckCircle2,

        variant: "success",
      },

      {
        key: "earnings",

        title:
          "Today's Earnings",

        value: `₹${Number(
          dashboardStats
            ?.todayEarnings ??
            0,
        ).toFixed(2)}`,

        description:
          "Today's delivery earnings",

        icon: Banknote,

        variant: "purple",
      },
    ],

    [
      dashboardStats,
    ],
  );

  // =========================================
  // STAT NAVIGATION
  // =========================================

  const handleStatClick = (
    key,
  ) => {
    const routes = {
      today:
        "/delivery/history",

      active:
        "/delivery/active",

      completed:
        "/delivery/history",

      earnings:
        "/delivery/earnings",
    };

    if (routes[key]) {
      navigate(
        routes[key],
      );
    }
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title="Delivery Dashboard"
        description="Manage assigned deliveries and track your daily delivery activity."
      />

      <DeliveryStatusCard
        isOnline={isOnline}
        loading={
          statusUpdating
        }
        onToggle={
          handleOnlineStatusToggle
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          (stat) => (
            <StatCard
              key={
                stat.key
              }
              title={
                stat.title
              }
              value={
                stat.value
              }
              description={
                stat.description
              }
              icon={
                stat.icon
              }
              variant={
                stat.variant
              }
              onClick={() =>
                handleStatClick(
                  stat.key,
                )
              }
            />
          ),
        )}
      </section>

      <CurrentDeliveryCard
        delivery={
          currentDelivery
        }
        loading={
          fetchLoading
        }
      />

      <RecentDeliveries
        deliveries={
          recentDeliveries
        }
        loading={
          fetchLoading
        }
      />
    </div>
  );
};

export default DeliveryDashboard;