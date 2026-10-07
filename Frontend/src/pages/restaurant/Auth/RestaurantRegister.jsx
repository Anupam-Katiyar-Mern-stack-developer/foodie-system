import { useState } from "react";

import { Link } from "react-router-dom";

import {
    FaArrowLeft,
    FaArrowRight,
    FaCheckCircle,
    FaClipboardCheck,
    FaStore,
    FaUtensils,
} from "react-icons/fa";

import CommonForm from "../../../components/common/CommonForm/CommonForm";

import {
    restaurantRegisterFields,
    restaurantRegisterDefaultValues,
} from "../../../forms/restaurant/register.form";

import {
    restaurantRegisterSchema,
} from "../../../validations/restaurant/register.validation";

const RestaurantRegister = () => {
    const [registerLoading] = useState(false);
    const [previewMessage, setPreviewMessage] = useState("");

    // =========================================
    // REGISTER
    // Later Redux + API integration
    // =========================================

    const handleRegister = async (values) => {
        const {
            confirmPassword,
            ...payload
        } = values;

        // Later:
        //
        // await dispatch(
        //   registerRestaurant(payload)
        // ).unwrap();
        //
        // navigate("/restaurant/login");

        // UI-only: do not submit or store credentials yet.
        void payload;

        setPreviewMessage(
            "Registration form validated. Account creation will be enabled after API integration."
        );
    };

    return (
        <div className="min-h-screen bg-[#fffaf5]">

            {/* =========================
          TOP NAVIGATION
      ========================= */}

            <header className="border-b border-orange-100 bg-white">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-3"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <FaUtensils />
                        </span>

                        <span className="text-2xl font-black text-slate-950">
                            Foodie
                            <span className="text-orange-500">.</span>
                        </span>
                    </Link>

                    <Link
                        to="/restaurant/login"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-orange-600"
                    >
                        <FaArrowLeft className="text-xs" />
                        Partner Login
                    </Link>

                </div>
            </header>

            {/* =========================
          PAGE
      ========================= */}

            <main className="relative overflow-hidden px-5 py-12 sm:px-8 lg:py-16">

                <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-200/40 blur-[110px]" />

                <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-rose-200/30 blur-[110px]" />

                <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] xl:gap-16">

                    {/* =========================
              LEFT INFORMATION
          ========================= */}

                    <aside className="lg:sticky lg:top-10">

                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-600">
                            <FaStore />
                            Become a Foodie Partner
                        </span>

                        <h1 className="mt-6 max-w-lg text-4xl font-black leading-[1.15] tracking-tight text-slate-950 sm:text-5xl">
                            Grow your
                            <span className="block text-orange-500">
                                restaurant
                            </span>
                            with Foodie.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-slate-500">
                            Register your restaurant and manage your
                            menu, customer orders and daily operations
                            from one simple dashboard.
                        </p>

                        {/* FEATURES */}

                        <div className="mt-10 space-y-5">
                            {[
                                "Manage your food menu easily",
                                "Receive customer orders",
                                "Track order preparation",
                                "Manage restaurant availability",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                        <FaCheckCircle className="text-sm" />
                                    </span>

                                    <p className="text-sm font-bold text-slate-700">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* APPROVAL NOTE */}

                        <div className="mt-12 rounded-[1.5rem] border border-orange-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                    <FaClipboardCheck className="text-xl" />
                                </div>

                                <div>
                                    <h3 className="font-black text-slate-950">
                                        Restaurant Verification
                                    </h3>

                                    <p className="mt-2 text-sm leading-7 text-slate-500">
                                        After registration, your restaurant
                                        application will be reviewed by Admin.
                                        Once approved, you can log in and
                                        start managing your restaurant.
                                    </p>
                                </div>

                            </div>
                        </div>

                    </aside>

                    {/* =========================
              RIGHT REGISTRATION FORM
          ========================= */}

                    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/5">

                        {/* FORM HEADER */}

                        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-5 py-7 sm:px-8">
                            <span className="text-xs font-black uppercase tracking-[0.15em] text-orange-600">
                                Partner Registration
                            </span>

                            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                                Register Your Restaurant
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Provide your restaurant information to
                                submit your registration application.
                            </p>
                        </div>

                        {/* FORM */}

                        <div className="px-5 py-7 sm:px-8 sm:py-8">

                            <CommonForm
                                fields={restaurantRegisterFields}
                                schema={restaurantRegisterSchema}
                                defaultValues={restaurantRegisterDefaultValues}
                                onSubmit={handleRegister}
                                loading={registerLoading}
                                submitText="Submit Restaurant Registration"
                                columns={2}
                            />

                            {previewMessage && (
                                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-700">
                                    {previewMessage}
                                </div>
                            )}

                            {/* LOGIN LINK */}

                            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    Already have a restaurant account?
                                </p>

                                <Link
                                    to="/restaurant/login"
                                    className="mt-2 inline-flex items-center gap-2 text-sm font-black text-orange-600 transition hover:text-orange-700"
                                >
                                    Sign In to Your Account
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>

                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
};

export default RestaurantRegister;