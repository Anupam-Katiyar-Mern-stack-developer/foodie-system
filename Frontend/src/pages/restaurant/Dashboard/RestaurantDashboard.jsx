import {
  ArrowRight,
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

import {
  useNavigate,
} from "react-router-dom";

import Button from "../../../components/common/Button/Button";


const RestaurantDashboard = () => {
  const navigate =
    useNavigate();


  // =========================
  // TEMP UI DATA
  // Later API se aayega
  // =========================

  const stats = [
    {
      title: "Today's Orders",
      value: "24",
      subtitle: "4 new orders",
      icon: ShoppingBag,
    },

    {
      title: "Today's Revenue",
      value: "₹8,420",
      subtitle: "Today's earning",
      icon: IndianRupee,
    },

    {
      title: "Active Orders",
      value: "7",
      subtitle: "Currently processing",
      icon: Clock3,
    },

    {
      title: "Active Foods",
      value: "38",
      subtitle: "42 total foods",
      icon: Utensils,
    },
  ];


  const pipeline = [
    {
      label: "Placed",
      status: "PLACED",
      count: 3,
      icon: PackageOpen,
    },

    {
      label: "Confirmed",
      status: "CONFIRMED",
      count: 2,
      icon: CheckCircle2,
    },

    {
      label: "Preparing",
      status: "PREPARING",
      count: 4,
      icon: ChefHat,
    },

    {
      label: "Ready",
      status: "READY_FOR_PICKUP",
      count: 2,
      icon: PackageCheck,
    },
  ];


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
  // STATUS STYLE
  // =========================

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "PLACED":
        return `
          border-amber-200
          bg-amber-50
          text-amber-700
        `;

      case "CONFIRMED":
        return `
          border-blue-200
          bg-blue-50
          text-blue-700
        `;

      case "PREPARING":
        return `
          border-orange-200
          bg-orange-50
          text-orange-700
        `;

      case "READY_FOR_PICKUP":
        return `
          border-emerald-200
          bg-emerald-50
          text-emerald-700
        `;

      default:
        return `
          border-slate-200
          bg-slate-50
          text-slate-600
        `;
    }
  };


  return (
    <div
      className="
        space-y-7
      "
    >
      {/* =========================
          HEADER
      ========================== */}

      <section
        className="
          flex
          flex-col
          gap-5

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.16em]
              text-orange-500
            "
          >
            Restaurant Dashboard
          </p>


          <h1
            className="
              mt-2

              text-2xl
              font-black
              tracking-tight
              text-slate-950

              sm:text-3xl
            "
          >
            Welcome back,
            Foodie Kitchen
          </h1>


          <p
            className="
              mt-2

              max-w-2xl

              text-sm
              leading-6
              text-slate-500
            "
          >
            Track orders,
            restaurant performance
            and manage your menu
            from one place.
          </p>
        </div>


        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <Button
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
            onClick={() =>
              navigate(
                "/restaurant/foods/add"
              )
            }
          >
            <span
              className="
                flex
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
      </section>


      {/* =========================
          RESTAURANT STATUS
      ========================== */}

      <section
        className="
          rounded-[1.75rem]

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
                h-14
                w-14
                shrink-0
                items-center
                justify-center

                rounded-2xl

                bg-white

                text-orange-600

                shadow-sm
              "
            >
              <Store
                className="
                  h-6
                  w-6
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


                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5

                    rounded-full

                    bg-emerald-100

                    px-2.5
                    py-1

                    text-[11px]
                    font-black
                    text-emerald-700
                  "
                >
                  <span
                    className="
                      h-2
                      w-2

                      rounded-full

                      bg-emerald-500
                    "
                  />

                  OPEN
                </span>
              </div>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Your restaurant is
                accepting customer
                orders.
              </p>
            </div>
          </div>


          <button
            type="button"
            className="
              relative

              h-8
              w-16

              rounded-full

              bg-emerald-500

              transition
            "
          >
            <span
              className="
                absolute
                left-9
                top-1

                h-6
                w-6

                rounded-full

                bg-white

                shadow
              "
            />
          </button>
        </div>
      </section>


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
          (item) => {
            const Icon =
              item.icon;

            return (
              <article
                key={
                  item.title
                }
                className="
                  rounded-[1.5rem]

                  border
                  border-slate-200

                  bg-white

                  p-5

                  shadow-sm

                  transition-all

                  hover:-translate-y-0.5
                  hover:border-orange-200
                  hover:shadow-md
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-500
                      "
                    >
                      {
                        item.title
                      }
                    </p>


                    <p
                      className="
                        mt-3

                        text-3xl
                        font-black
                        tracking-tight
                        text-slate-950
                      "
                    >
                      {
                        item.value
                      }
                    </p>
                  </div>


                  <span
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center

                      rounded-xl

                      bg-orange-50

                      text-orange-600
                    "
                  >
                    <Icon
                      className="
                        h-5
                        w-5
                      "
                    />
                  </span>
                </div>


                <p
                  className="
                    mt-4

                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  {
                    item.subtitle
                  }
                </p>
              </article>
            );
          }
        )}
      </section>


      {/* =========================
          ORDER PIPELINE
      ========================== */}

      <section
        className="
          rounded-[1.75rem]

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
                text-xl
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


          <button
            type="button"
            onClick={() =>
              navigate(
                "/restaurant/orders"
              )
            }
            className="
              hidden
              items-center
              gap-2

              text-sm
              font-black
              text-orange-600

              sm:flex
            "
          >
            View all

            <ArrowRight
              className="
                h-4
                w-4
              "
            />
          </button>
        </div>


        <div
          className="
            mt-6

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

                    bg-slate-50/60

                    p-4

                    text-left

                    transition

                    hover:border-orange-200
                    hover:bg-orange-50
                  "
                >
                  <span
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
                  </span>


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
      </section>


      {/* =========================
          RECENT ORDERS
      ========================== */}

      <section
        className="
          overflow-hidden

          rounded-[1.75rem]

          border
          border-slate-200

          bg-white

          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4

            border-b
            border-slate-100

            p-5

            sm:p-6
          "
        >
          <div>
            <h2
              className="
                text-xl
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
              Latest orders received
              by your restaurant.
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/restaurant/orders"
              )
            }
            className="
              flex
              items-center
              gap-1.5

              text-sm
              font-black
              text-orange-600
            "
          >
            View all

            <ArrowRight
              className="
                h-4
                w-4
              "
            />
          </button>
        </div>


        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[760px]
            "
          >
            <thead
              className="
                bg-slate-50
              "
            >
              <tr>
                <th
                  className="
                    px-5
                    py-3.5

                    text-left

                    text-[11px]
                    font-black
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Order
                </th>

                <th
                  className="
                    px-5
                    py-3.5

                    text-left

                    text-[11px]
                    font-black
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Customer
                </th>

                <th
                  className="
                    px-5
                    py-3.5

                    text-left

                    text-[11px]
                    font-black
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Amount
                </th>

                <th
                  className="
                    px-5
                    py-3.5

                    text-left

                    text-[11px]
                    font-black
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-5
                    py-3.5

                    text-left

                    text-[11px]
                    font-black
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Time
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                  "
                />
              </tr>
            </thead>


            <tbody
              className="
                divide-y
                divide-slate-100
              "
            >
              {recentOrders.map(
                (order) => (
                  <tr
                    key={
                      order.orderNumber
                    }
                    className="
                      transition

                      hover:bg-orange-50/40
                    "
                  >
                    <td
                      className="
                        px-5
                        py-4

                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      {
                        order.orderNumber
                      }
                    </td>


                    <td
                      className="
                        px-5
                        py-4

                        text-sm
                        font-semibold
                        text-slate-600
                      "
                    >
                      {
                        order.customer
                      }
                    </td>


                    <td
                      className="
                        px-5
                        py-4

                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      {
                        order.total
                      }
                    </td>


                    <td
                      className="
                        px-5
                        py-4
                      "
                    >
                      <span
                        className={`
                          inline-flex

                          rounded-full

                          border

                          px-2.5
                          py-1

                          text-[10px]
                          font-black

                          ${getStatusClass(
                            order.status
                          )}
                        `}
                      >
                        {
                          order.status
                        }
                      </span>
                    </td>


                    <td
                      className="
                        px-5
                        py-4

                        text-xs
                        text-slate-400
                      "
                    >
                      {
                        order.time
                      }
                    </td>


                    <td
                      className="
                        px-5
                        py-4

                        text-right
                      "
                    >
                      <button
                        type="button"

                        onClick={() =>
                          navigate(
                            `/restaurant/orders/${order.orderNumber}`
                          )
                        }

                        className="
                          text-xs
                          font-black
                          text-orange-600

                          hover:text-orange-700
                        "
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};


export default RestaurantDashboard;