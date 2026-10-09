import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaMotorcycle,
  FaRoute,
  FaShieldAlt,
  FaWallet,
} from "react-icons/fa";

import CommonForm from "../../../components/common/CommonForm/CommonForm";

import { loginDeliveryAgent } from "../../../redux/thunks/deliveryAgent/deliveryAuth.thunk";

import {
  deliveryLoginFields,
  deliveryLoginDefaultValues,
} from "../../../forms/deliveryAgent/login.form";

import { deliveryLoginSchema } from "../../../validations/deliveryAgent/login.validation";

const DeliveryLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginLoading } = useSelector((state) => state.deliveryAuth);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (values) => {
    try {
      await dispatch(
        loginDeliveryAgent({
          email: values.email.trim(),
          password: values.password,
        })
      ).unwrap();

      navigate("/delivery/dashboard", {
        replace: true,
      });
    } catch {
      // Error slice me store hoga
      // Toast thunk me show hoga
    }
  };

  const features = [
    {
      icon: FaMotorcycle,
      text: "Receive new delivery assignments",
    },
    {
      icon: FaRoute,
      text: "Navigate to restaurant and customer",
    },
    {
      icon: FaCheckCircle,
      text: "Manage active and completed deliveries",
    },
    {
      icon: FaWallet,
      text: "Track your delivery earnings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================
            LEFT SECTION
        ========================== */}

        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:items-center">
          <div className="pointer-events-none absolute -left-32 top-12 h-96 w-96 rounded-full bg-orange-500/20 blur-[130px]" />

          <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-rose-500/10 blur-[120px]" />

          <div className="relative z-10 mx-auto w-full max-w-xl px-12 xl:px-16">
            {/* BRAND */}

            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <FaMotorcycle className="text-xl" />
              </div>

              <span className="text-3xl font-black tracking-tight text-white">
                Foodie<span className="text-orange-400">.</span>
              </span>
            </Link>

            {/* CONTENT */}

            <div className="mt-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
                <FaMotorcycle />
                Delivery Partner
              </span>

              <h1 className="mt-7 text-5xl font-black leading-[1.15] tracking-tight text-white xl:text-6xl">
                Deliver food.
                <span className="block text-orange-400">Earn more.</span>
                Stay moving.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
                Manage delivery assignments, navigate to restaurants and
                customers, track completed orders and monitor your earnings
                from one place.
              </p>
            </div>

            {/* FEATURES */}

            <div className="mt-12 space-y-5">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-300"
                  >
                    <Icon className="shrink-0 text-orange-400" />
                    {feature.text}
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}

            <div className="mt-20 border-t border-white/10 pt-6">
              <p className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <FaShieldAlt className="text-orange-400" />
                Secure delivery partner access
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            RIGHT LOGIN SECTION
        ========================== */}

        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}

            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                <FaMotorcycle />
              </span>

              <span className="text-2xl font-black text-slate-950">
                Foodie<span className="text-orange-500">.</span>
              </span>
            </Link>

            {/* HEADER */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-orange-600">
                <FaMotorcycle />
                Partner Login
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome back!
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Sign in to manage your deliveries, routes and earnings.
              </p>
            </div>

            {/* COMMON FORM */}

            <div className="mt-9 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-7">
              <CommonForm
                fields={deliveryLoginFields}
                schema={deliveryLoginSchema}
                defaultValues={deliveryLoginDefaultValues}
                onSubmit={handleLogin}
                loading={loginLoading}
                submitText="Sign In"
                columns={1}
              />

              {/* REGISTER */}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Don't have a delivery partner account?
                </p>

                <Link
                  to="/delivery/register"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-black text-orange-600 transition hover:text-orange-700"
                >
                  Become a Delivery Partner
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>

            <p className="mt-7 text-center text-xs leading-6 text-slate-400">
              Sign in using your registered delivery partner account.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeliveryLogin;