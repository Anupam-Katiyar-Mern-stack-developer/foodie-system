import { useState } from "react";
import {
    Link,
    useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    ArrowLeft,
    CheckCircle2,
    KeyRound,
    Mail,
} from "lucide-react";

import { forgotPassword } from "../../../redux/thunks/common/passwordReset.thunk";

const ACCOUNT_CONFIG = {
    USER: {
        title: "Customer",
        loginPath: "/login",
    },
    RESTAURANT: {
        title: "Restaurant",
        loginPath: "/restaurant/login",
    },
    DELIVERY_AGENT: {
        title: "Delivery Agent",
        loginPath: "/delivery/login",
    },
    ADMIN: {
        title: "Admin",
        loginPath: "/admin/login",
    },
};

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const requestedType =
        searchParams.get("type")?.toUpperCase();

    const accountType =
        ACCOUNT_CONFIG[requestedType]
            ? requestedType
            : "USER";

    const config = ACCOUNT_CONFIG[accountType];

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);

            const result = await dispatch(
                forgotPassword({
                    email: email.trim(),
                    accountType,
                }),
            ).unwrap();

            setMessage(
                result.message ||
                "Password reset link has been sent.",
            );
        } catch (error) {
            setError(
                typeof error === "string"
                    ? error
                    : "Failed to send reset link",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4 py-10">
            <div className="w-full max-w-md">
                <Link
                    to={config.loginPath}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-600"
                >
                    <ArrowLeft size={17} />
                    Back to login
                </Link>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                        <KeyRound size={26} />
                    </div>

                    <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
                        Forgot password?
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Enter your {config.title.toLowerCase()} account
                        email and we'll send you a secure password reset
                        link.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-7"
                    >
                        <label className="text-sm font-bold text-slate-700">
                            Email address
                        </label>

                        <div className="relative mt-2">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        {error && (
                            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;