import { useState } from "react";

import { Link } from "react-router-dom";

import {
    FaArrowRight,
    FaCheckCircle,
    FaShieldAlt,
    FaStore,
    FaUtensils,
} from "react-icons/fa";

import CommonForm from "../../../components/common/CommonForm/CommonForm";

import {
    restaurantLoginFields,
    restaurantLoginDefaultValues,
} from "../../../forms/restaurant/login.form";

import {
    restaurantLoginSchema,
} from "../../../validations/restaurant/login.validation";

const RestaurantLogin = () => {
    const [loginLoading] = useState(false);
    const [previewMessage, setPreviewMessage] = useState("");

    // =========================================
    // LOGIN
    // API integration later
    // =========================================

    const handleLogin = async (values) => {
        // Later:
        // await dispatch(loginRestaurant(values)).unwrap();
        // navigate("/restaurant/dashboard");

        setPreviewMessage(
            "Login form validated. Authentication API will be connected next."
        );
    };

    return (
        <div className="min-h-screen bg-[#fffaf5]">
            <div className="grid min-h-screen lg:grid-cols-2">

                {/* =========================
            LEFT BRAND SECTION
        ========================= */}

                <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:items-center">
                    <div className="pointer-events-none absolute -left-32 top-12 h-96 w-96 rounded-full bg-orange-500/20 blur-[130px]" />

                    <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-rose-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto w-full max-w-xl px-12 xl:px-16">

                        {/* BRAND */}

                        <Link
                            to="/"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                                <FaUtensils className="text-xl" />
                            </div>

                            <span className="text-3xl font-black tracking-tight text-white">
                                Foodie
                                <span className="text-orange-400">.</span>
                            </span>
                        </Link>

                        {/* CONTENT */}

                        <div className="mt-20">
                            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-300">
                                <FaStore />
                                Restaurant Partner
                            </span>

                            <h1 className="mt-7 text-5xl font-black leading-[1.15] tracking-tight text-white xl:text-6xl">
                                Manage your
                                <span className="block text-orange-400">
                                    restaurant
                                </span>
                                effortlessly.
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
                                Manage orders, update your menu, control
                                restaurant availability and deliver an
                                amazing experience to your customers.
                            </p>
                        </div>

                        {/* FEATURES */}

                        <div className="mt-12 space-y-5">
                            {[
                                "Manage incoming customer orders",
                                "Update your restaurant menu",
                                "Track restaurant activity",
                                "Control restaurant availability",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 text-sm font-semibold text-slate-300"
                                >
                                    <FaCheckCircle className="shrink-0 text-orange-400" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        {/* FOOTER */}

                        <div className="mt-20 border-t border-white/10 pt-6">
                            <p className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                <FaShieldAlt className="text-orange-400" />
                                Secure restaurant partner access
                            </p>
                        </div>
                    </div>
                </section>

                {/* =========================
            RIGHT LOGIN SECTION
        ========================= */}

                <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
                    <div className="w-full max-w-md">

                        {/* MOBILE BRAND */}

                        <Link
                            to="/"
                            className="mb-10 inline-flex items-center gap-3 lg:hidden"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                                <FaUtensils />
                            </span>

                            <span className="text-2xl font-black text-slate-950">
                                Foodie
                                <span className="text-orange-500">.</span>
                            </span>
                        </Link>

                        {/* HEADER */}

                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-orange-600">
                                <FaStore />
                                Partner Login
                            </div>

                            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                Welcome back!
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Sign in to manage your restaurant,
                                orders and menu.
                            </p>
                        </div>

                        {/* FORM */}

                        <div className="mt-9 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-7">
                            <CommonForm
                                fields={restaurantLoginFields}
                                schema={restaurantLoginSchema}
                                defaultValues={restaurantLoginDefaultValues}
                                onSubmit={handleLogin}
                                loading={loginLoading}
                                submitText="Sign In"
                                columns={1}
                            />

                            {previewMessage && (
                                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                                    {previewMessage}
                                </div>
                            )}

                            {/* REGISTER LINK */}

                            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Don't have a restaurant account?
                                </p>

                                <Link
                                    to="/restaurant/register"
                                    className="mt-2 inline-flex items-center gap-2 text-sm font-black text-orange-600 transition hover:text-orange-700"
                                >
                                    Register Your Restaurant
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>

                        {/* FOOTER */}

                        <p className="mt-7 text-center text-xs leading-6 text-slate-400">
                            Access is available after restaurant
                            approval by the Foodie team.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default RestaurantLogin;