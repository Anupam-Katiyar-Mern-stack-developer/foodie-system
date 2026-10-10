import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

const DeliveryDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isOnline,
        stats: dashboardStats,
        currentDelivery,
        recentDeliveries,
        fetchLoading,
    } = useSelector(
        (state) => state.deliveryDashboard
    );

    useEffect(() => {
        dispatch(getDeliveryDashboard());
    }, [dispatch]);

    const stats = useMemo(
        () => [
            {
                key: "today",
                title: "Today's Deliveries",
                value:
                    dashboardStats?.todayDeliveries ?? 0,
                description:
                    "Assigned today",
                icon: Bike,
                variant: "orange",
            },
            {
                key: "active",
                title: "Active Delivery",
                value:
                    dashboardStats?.activeDelivery ?? 0,
                description:
                    "Currently delivering",
                icon: Navigation,
                variant: "warning",
            },
            {
                key: "completed",
                title: "Completed Today",
                value:
                    dashboardStats?.completedToday ?? 0,
                description:
                    "Successfully delivered",
                icon: CheckCircle2,
                variant: "success",
            },
            {
                key: "earnings",
                title: "Today's Earnings",
                value: `₹${Number(
                    dashboardStats?.todayEarnings ?? 0
                ).toFixed(2)}`,
                description:
                    "Today's delivery earnings",
                icon: Banknote,
                variant: "purple",
            },
        ],
        [dashboardStats]
    );

    const handleStatClick = (key) => {
        const routes = {
            today: "/delivery/history",
            active: "/delivery/active",
            completed: "/delivery/history",
            earnings: "/delivery/earnings",
        };

        if (routes[key]) {
            navigate(routes[key]);
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
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.key}
                        title={stat.title}
                        value={stat.value}
                        description={
                            stat.description
                        }
                        icon={stat.icon}
                        variant={stat.variant}
                        onClick={() =>
                            handleStatClick(
                                stat.key
                            )
                        }
                    />
                ))}
            </section>

            <CurrentDeliveryCard
                delivery={currentDelivery}
                loading={fetchLoading}
            />

            <RecentDeliveries
                deliveries={
                    recentDeliveries
                }
                loading={fetchLoading}
            />
        </div>
    );
};

export default DeliveryDashboard;