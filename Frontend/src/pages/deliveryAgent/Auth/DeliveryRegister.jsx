import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaCheckCircle,
    FaMapMarkedAlt,
    FaMotorcycle,
    FaShieldAlt,
    FaWallet,
} from "react-icons/fa";

import CommonForm from "../../../components/common/CommonForm/CommonForm";

import { registerDeliveryAgent } from "../../../redux/thunks/deliveryAgent/deliveryAuth.thunk";

import {
    deliveryRegisterFields,
    deliveryRegisterDefaultValues,
} from "../../../forms/deliveryAgent/register.form";

import { deliveryRegisterSchema } from "../../../validations/deliveryAgent/register.validation";

const DeliveryRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { registerLoading } = useSelector((state) => state.deliveryAuth);

    // =========================
    // REGISTER
    // =========================

    const handleRegister = async (values) => {
        const { confirmPassword, ...rest } = values;

        const payload = {
            ...rest,
            name: rest.name.trim(),
            email: rest.email.trim(),
            phone: rest.phone.trim(),
            address: rest.address.trim(),
            vehicleNumber:
                rest.vehicleType === "BICYCLE" ? null : rest.vehicleNumber.trim(),
        };

        try {
            await dispatch(registerDeliveryAgent(payload)).unwrap();

            navigate("/delivery/login", {
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
            text: "Receive delivery assignments",
        },
        {
            icon: FaMapMarkedAlt,
            text: "Navigate to pickup and delivery locations",
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

                        <div className="mt-16">
                            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
                                <FaMotorcycle />
                                Delivery Partner
                            </span>

                            <h1 className="mt-7 text-5xl font-black leading-[1.15] tracking-tight text-white xl:text-6xl">
                                Join Foodie.
                                <span className="block text-orange-400">Start delivering.</span>
                                Start earning.
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
                                Register as a Foodie delivery partner and manage delivery
                                assignments, navigation, order status and earnings from one
                                dashboard.
                            </p>
                        </div>

                        {/* FEATURES */}

                        <div className="mt-10 space-y-5">
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

                        <div className="mt-14 border-t border-white/10 pt-6">
                            <p className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                <FaShieldAlt className="text-orange-400" />
                                Secure delivery partner registration
                            </p>
                        </div>
                    </div>
                </section>

                {/* =========================
            RIGHT REGISTER SECTION
        ========================== */}

                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                    <div className="w-full max-w-2xl">
                        {/* MOBILE BRAND */}

                        <Link
                            to="/"
                            className="mb-8 inline-flex items-center gap-3 lg:hidden"
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
                                Partner Registration
                            </div>

                            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                Become a delivery partner
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Enter your personal, vehicle and account information to create
                                your delivery partner account.
                            </p>
                        </div>

                        {/* COMMON FORM */}

                        <div className="mt-7 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-7">
                            <CommonForm
                                fields={deliveryRegisterFields}
                                schema={deliveryRegisterSchema}
                                defaultValues={deliveryRegisterDefaultValues}
                                onSubmit={handleRegister}
                                loading={registerLoading}
                                submitText="Create Partner Account"
                                columns={2}
                            />

                            {/* LOGIN LINK */}

                            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Already have a delivery partner account?
                                </p>

                                <Link
                                    to="/delivery/login"
                                    className="mt-2 inline-flex items-center gap-2 text-sm font-black text-orange-600 transition hover:text-orange-700"
                                >
                                    Sign In
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-xs leading-6 text-slate-400">
                            Your delivery partner account can be used to manage assignments,
                            active deliveries and earnings.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DeliveryRegister;