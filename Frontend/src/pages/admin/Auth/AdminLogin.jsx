import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, UtensilsCrossed, Store, Bike, ArrowLeft } from "lucide-react";
import CommonForm from "../../../components/common/CommonForm/CommonForm";
import Card from "../../../components/common/Card/Card";
import { adminLoginFields } from "../../../forms/admin/admin.form";
import { adminLoginSchema } from "../../../validations/admin/admin.validation";
import { loginAdmin } from "../../../redux/thunks/admin/admin.thunk";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loginLoading, loginError } = useSelector((state) => state.admin);
  if (token) return <Navigate to="/admin/dashboard" replace />;
  const submit = async (values) => {
    try {
      await dispatch(loginAdmin(values)).unwrap();
      const from = location.state?.from;
      navigate(typeof from === "string" && from.startsWith("/admin/") && from !== "/admin/login" ? from : "/admin/dashboard", { replace: true });
    } catch { /* Inline error comes from Redux. */ }
  };
  return (
    <main className="grid min-h-screen bg-[#fffaf5] lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full border-[70px] border-orange-500/10" aria-hidden="true" />
        <Link to="/" className="relative flex w-fit items-center gap-3 text-3xl font-black"><UtensilsCrossed className="h-8 w-8 text-orange-400" aria-hidden="true" />foodie<span className="text-orange-400">.</span></Link>
        <div className="relative max-w-lg"><p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-orange-300">The people behind every delivery</p><h1 className="text-5xl font-black leading-[1.12] tracking-tight xl:text-6xl">Good food.<br />Great partners.<br /><span className="text-orange-400">One workspace.</span></h1><p className="mt-6 max-w-md text-base leading-7 text-slate-300">Bring your restaurants, delivery partners and food community together. Everything you need to oversee Foodie.</p><div className="mt-10 flex flex-wrap gap-3">{[[Store, "Restaurants"], [Bike, "Delivery partners"], [ShieldCheck, "Admin access"]].map(([Icon, text]) => <span key={text} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200"><Icon className="h-4 w-4 text-orange-300" aria-hidden="true" />{text}</span>)}</div></div>
        <p className="relative text-xs text-slate-400">Foodie · Built around better deliveries.</p>
      </section>
      <section className="flex flex-col justify-center px-5 py-10 sm:px-12 xl:px-24">
        <Link to="/" className="mb-10 flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to Foodie</Link>
        <div className="mx-auto w-full max-w-md"><span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-200 bg-orange-100 text-orange-600"><ShieldCheck className="h-7 w-7" aria-hidden="true" /></span><p className="text-xs font-bold uppercase tracking-widest text-orange-700">Administrator access</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Welcome back.</h2><p className="mb-8 mt-3 leading-6 text-slate-500">Sign in to your Foodie admin workspace.</p><Card padding="lg">{loginError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{loginError}</p>}<CommonForm fields={adminLoginFields} schema={adminLoginSchema} defaultValues={{ email: "", password: "" }} onSubmit={submit} loading={loginLoading} columns={1} showCancel={false} submitText="Sign in to workspace" loadingText="Signing in..." /></Card><p className="mt-6 text-center text-xs leading-5 text-slate-500">Access is restricted to authorised Foodie administrators.<br />Contact your platform owner if you need an account.</p></div>
      </section>
    </main>
  );
}
