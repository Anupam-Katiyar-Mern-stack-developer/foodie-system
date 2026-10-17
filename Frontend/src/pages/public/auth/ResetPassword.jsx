import { useState } from "react";
import {
    Link,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
} from "lucide-react";

import { resetPassword } from "../../../redux/thunks/common/passwordReset.thunk";

const LOGIN_PATHS = {
    USER: "/login",
    RESTAURANT: "/restaurant/login",
    DELIVERY_AGENT: "/delivery/login",
    ADMIN: "/admin/login",
};

const ResetPassword = () => {
    const dispatch = useDispatch();

    const { token } = useParams();
    const [searchParams] = useSearchParams();

    const accountType =
        searchParams.get("type")?.toUpperCase();

    const loginPath =
        LOGIN_PATHS[accountType] || "/login";

    const [password, setPassword] = useState("");
    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Both password fields are required");
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters long",
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const result = await dispatch(
                resetPassword({
                    token,
                    password,
                    confirmPassword,
                }),
            ).unwrap();

            setSuccess(
                result.message ||
                "Password reset successfully.",
            );

            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            setError(
                typeof error === "string"
                    ? error
                    : "Failed to reset password",
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4">
                <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/5">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={32} />
                    </div>

                    <h1 className="mt-6 text-2xl font-black text-slate-950">
                        Password changed
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {success}
                    </p>

                    <Link
                        to={loginPath}
                        className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
                    >
                        Continue to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4 py-10">
            <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <KeyRound size={26} />
                </div>

                <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
                    Set new password
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create a strong new password for your Foodie
                    account.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-5"
                >
                    <div>
                        <label className="text-sm font-bold text-slate-700">
                            New password
                        </label>

                        <div className="relative mt-2">
                            <LockKeyhole
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) => !previous,
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-700">
                            Confirm password
                        </label>

                        <div className="relative mt-2">
                            <LockKeyhole
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value,
                                    )
                                }
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous,
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;