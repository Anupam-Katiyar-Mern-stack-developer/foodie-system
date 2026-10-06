import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CheckCircle2,
  ChefHat,
  Clock3,
  IndianRupee,
  PackageCheck,
  PackageOpen,
  Plus,
  ShoppingBag,
  Store,
  Utensils,
} from "lucide-react";


import PageHeader
  from "../../../components/common/PageHeader/PageHeader";

import Button
  from "../../../components/common/Button/Button";

import StatCard
  from "../../../components/common/StatCard/StatCard";

import StatusBadge
  from "../../../components/common/StatusBadge/StatusBadge";

import CommonTable
  from "../../../components/common/CommonTable/CommonTable";

import Skeleton
  from "../../../components/common/Skeleton/Skeleton";

import EmptyState
  from "../../../components/common/EmptyState/EmptyState";

import ErrorState
  from "../../../components/common/ErrorState/ErrorState";



const RestaurantDashboard = () => {
  const navigate =
    useNavigate();


  // =========================
  // TEMP UI STATE
  // Later Redux/API se aayega
  // =========================

  const [
    restaurantOpen,
    setRestaurantOpen,
  ] = useState(true);


  const dashboardLoading =
    false;

  const dashboardError =
    null;


  // =========================
  // STATS
  // =========================

  const stats = [
    {
      key:
        "orders",

      title:
        "Today's Orders",

      value:
        "24",

      description:
        "4 new orders today",

      icon:
        ShoppingBag,

      variant:
        "orange",
    },

    {
      key:
        "revenue",

      title:
        "Today's Revenue",

      value:
        "₹8,420",

      description:
        "Total earning today",

      icon:
        IndianRupee,

      variant:
        "success",
    },

    {
      key:
        "activeOrders",

      title:
        "Active Orders",

      value:
        "7",

      description:
        "Currently processing",

      icon:
        Clock3,

      variant:
        "warning",
    },

    {
      key:
        "foods",

      title:
        "Active Foods",

      value:
        "38",

      description:
        "42 total menu items",

      icon:
        Utensils,

      variant:
        "purple",
    },
  ];


  // =========================
  // ORDER PIPELINE
  // =========================

  const pipeline = [
    {
      label:
        "Placed",

      status:
        "PLACED",

      count:
        3,

      icon:
        PackageOpen,
    },

    {
      label:
        "Confirmed",

      status:
        "CONFIRMED",

      count:
        2,

      icon:
        CheckCircle2,
    },

    {
      label:
        "Preparing",

      status:
        "PREPARING",

      count:
        4,

      icon:
        ChefHat,
    },

    {
      label:
        "Ready",

      status:
        "READY_FOR_PICKUP",

      count:
        2,

      icon:
        PackageCheck,
    },
  ];


  // =========================
  // RECENT ORDERS
  // =========================

  const recentOrders = [
    {
      orderNumber:
        "ORD-31FA3A64",

      customer:
        "Rahul",

      total:
        "₹349",

      status:
        "PLACED",

      time:
        "2 min ago",
    },

    {
      orderNumber:
        "ORD-82KL9B21",

      customer:
        "Aman",

      total:
        "₹599",

      status:
        "CONFIRMED",

      time:
        "7 min ago",
    },

    {
      orderNumber:
        "ORD-52PT7C94",

      customer:
        "Mohit",

      total:
        "₹429",

      status:
        "PREPARING",

      time:
        "12 min ago",
    },

    {
      orderNumber:
        "ORD-93MN6A43",

      customer:
        "Rohit",

      total:
        "₹799",

      status:
        "READY_FOR_PICKUP",

      time:
        "18 min ago",
    },
  ];


  // =========================
  // STATUS CONFIG
  // =========================

  const statusConfig = {
    PLACED: {
      label:
        "Placed",

      variant:
        "warning",
    },

    CONFIRMED: {
      label:
        "Confirmed",

      variant:
        "info",
    },

    PREPARING: {
      label:
        "Preparing",

      variant:
        "purple",
    },

    READY_FOR_PICKUP: {
      label:
        "Ready",

      variant:
        "success",
    },
  };


  // =========================
  // TABLE COLUMNS
  // =========================

  const orderColumns = [
    {
      key:
        "orderNumber",

      label:
        "Order",

      render:
        (row) => (
          <button
            type="button"

            onClick={() =>
              navigate(
                `/restaurant/orders/${row.orderNumber}`
              )
            }

            className="
              font-black
              text-slate-900

              transition

              hover:text-orange-600
            "
          >
            {
              row.orderNumber
            }
          </button>
        ),
    },

    {
      key:
        "customer",

      label:
        "Customer",
    },

    {
      key:
        "total",

      label:
        "Amount",

      render:
        (row) => (
          <span
            className="
              font-black
              text-slate-900
            "
          >
            {row.total}
          </span>
        ),
    },

    {
      key:
        "status",

      label:
        "Status",

      render:
        (row) => {
          const config =
            statusConfig[
              row.status
            ] || {
              label:
                row.status,

              variant:
                "neutral",
            };


          return (
            <StatusBadge
              variant={
                config.variant
              }

              size="sm"

              dot
            >
              {
                config.label
              }
            </StatusBadge>
          );
        },
    },

    {
      key:
        "time",

      label:
        "Time",
    },

    {
      key:
        "action",

      label:
        "Action",

      align:
        "right",

      render:
        (row) => (
          <Button
            type="button"

            variant="ghost"

            onClick={() =>
              navigate(
                `/restaurant/orders/${row.orderNumber}`
              )
            }
          >
            View
          </Button>
        ),
    },
  ];


  // =========================
  // ERROR
  // =========================

  if (
    dashboardError
  ) {
    return (
      <ErrorState
        title="Unable to load dashboard"

        description={
          typeof dashboardError ===
          "string"
            ? dashboardError
            : "Something went wrong while loading dashboard."
        }
      />
    );
  }


  return (
    <div
      className="
        space-y-7
      "
    >
      {/* =========================
          PAGE HEADER
      ========================== */}

      <div
        className="
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >
        <PageHeader
          title="Restaurant Dashboard"

          description="
            Track your orders,
            revenue, menu and
            restaurant performance
            from one place.
          "
        />


        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >
          <Button
            type="button"

            variant="outline"

            onClick={() =>
              navigate(
                "/restaurant/orders"
              )
            }
          >
            View Orders
          </Button>


          <Button
            type="button"

            onClick={() =>
              navigate(
                "/restaurant/foods/add"
              )
            }
          >
            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >
              <Plus
                className="
                  h-4
                  w-4
                "
              />

              Add Food
            </span>
          </Button>
        </div>
      </div>


      {/* =========================
          RESTAURANT STATUS
      ========================== */}

      {dashboardLoading ? (
        <Skeleton
          width="w-full"

          height="h-[120px]"

          rounded="rounded-[1.5rem]"
        />
      ) : (
        <section
          className="
            rounded-[1.5rem]

            border
            border-orange-100

            bg-gradient-to-r
            from-orange-50
            via-white
            to-rose-50

            p-5

            shadow-sm

            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-white

                  text-orange-600

                  shadow-sm
                "
              >
                <Store
                  className="
                    h-5
                    w-5
                  "
                />
              </div>


              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h2
                    className="
                      text-lg
                      font-black
                      text-slate-950
                    "
                  >
                    Foodie Kitchen
                  </h2>


                  <StatusBadge
                    variant={
                      restaurantOpen
                        ? "success"
                        : "danger"
                    }

                    size="sm"

                    dot
                  >
                    {restaurantOpen
                      ? "Open"
                      : "Closed"}
                  </StatusBadge>
                </div>


                <p
                  className="
                    mt-1

                    text-sm
                    text-slate-500
                  "
                >
                  {restaurantOpen
                    ? "Your restaurant is accepting customer orders."
                    : "Your restaurant is currently not accepting orders."}
                </p>
              </div>
            </div>


            {/* OPEN / CLOSE */}

            <button
              type="button"

              onClick={() =>
                setRestaurantOpen(
                  (previous) =>
                    !previous
                )
              }

              aria-label="Change restaurant status"

              className={`
                relative

                h-8
                w-16

                rounded-full

                transition-colors

                ${
                  restaurantOpen
                    ? "bg-emerald-500"
                    : "bg-slate-300"
                }
              `}
            >
              <span
                className={`
                  absolute
                  top-1

                  h-6
                  w-6

                  rounded-full

                  bg-white

                  shadow-sm

                  transition-all

                  ${
                    restaurantOpen
                      ? "left-9"
                      : "left-1"
                  }
                `}
              />
            </button>
          </div>
        </section>
      )}


      {/* =========================
          STATS
      ========================== */}

      <section
        className="
          grid
          gap-4

          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
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

              loading={
                dashboardLoading
              }

              onClick={
                stat.key ===
                "orders"
                  ? () =>
                      navigate(
                        "/restaurant/orders"
                      )
                  : stat.key ===
                    "foods"
                  ? () =>
                      navigate(
                        "/restaurant/foods"
                      )
                  : undefined
              }

              actionLabel={
                stat.key ===
                "orders"
                  ? "View orders"
                  : stat.key ===
                    "foods"
                  ? "Manage foods"
                  : undefined
              }
            />
          )
        )}
      </section>


      {/* =========================
          ACTIVE ORDER PIPELINE
      ========================== */}

      <section
        className="
          rounded-[1.5rem]

          border
          border-slate-200

          bg-white

          p-5

          shadow-sm

          sm:p-6
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-black
                text-slate-950
              "
            >
              Active Orders
            </h2>

            <p
              className="
                mt-1

                text-sm
                text-slate-500
              "
            >
              Current restaurant
              order pipeline.
            </p>
          </div>


          <Button
            type="button"

            variant="ghost"

            onClick={() =>
              navigate(
                "/restaurant/orders"
              )
            }
          >
            View All
          </Button>
        </div>


        {dashboardLoading ? (
          <div
            className="
              mt-5

              grid
              gap-3

              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {Array.from({
              length: 4,
            }).map(
              (
                _,
                index
              ) => (
                <Skeleton
                  key={
                    index
                  }

                  width="w-full"

                  height="h-[90px]"

                  rounded="rounded-2xl"
                />
              )
            )}
          </div>
        ) : (
          <div
            className="
              mt-5

              grid
              gap-3

              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {pipeline.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <button
                    key={
                      item.status
                    }

                    type="button"

                    onClick={() =>
                      navigate(
                        `/restaurant/orders?status=${item.status}`
                      )
                    }

                    className="
                      flex
                      items-center
                      gap-4

                      rounded-2xl

                      border
                      border-slate-200

                      bg-slate-50/70

                      p-4

                      text-left

                      transition

                      hover:border-orange-200
                      hover:bg-orange-50
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        bg-white

                        text-orange-600

                        shadow-sm
                      "
                    >
                      <Icon
                        className="
                          h-5
                          w-5
                        "
                      />
                    </div>


                    <div>
                      <p
                        className="
                          text-2xl
                          font-black
                          text-slate-950
                        "
                      >
                        {
                          item.count
                        }
                      </p>

                      <p
                        className="
                          text-xs
                          font-bold
                          text-slate-500
                        "
                      >
                        {
                          item.label
                        }
                      </p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        )}
      </section>


      {/* =========================
          RECENT ORDERS
      ========================== */}

      <section
        className="
          rounded-[1.5rem]

          border
          border-slate-200

          bg-white

          p-5

          shadow-sm

          sm:p-6
        "
      >
        <div
          className="
            mb-5

            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-black
                text-slate-950
              "
            >
              Recent Orders
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Latest customer
              orders received.
            </p>
          </div>


          <Button
            type="button"

            variant="ghost"

            onClick={() =>
              navigate(
                "/restaurant/orders"
              )
            }
          >
            View All
          </Button>
        </div>


        {!dashboardLoading &&
        recentOrders.length ===
          0 ? (
          <EmptyState
            icon={
              ShoppingBag
            }

            title="No orders yet"

            description="New customer orders will appear here."
          />
        ) : (
          <CommonTable
            columns={
              orderColumns
            }

            data={
              recentOrders
            }

            loading={
              dashboardLoading
            }
          />
        )}
      </section>
    </div>
  );
};


export default RestaurantDashboard;