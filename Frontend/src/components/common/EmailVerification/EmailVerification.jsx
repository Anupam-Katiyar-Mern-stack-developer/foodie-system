import { useEffect, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Modal from "../Modal/Modal";
import {
  getVerificationStatus,
  sendVerificationCode,
  verifyEmailCode,
} from "../../../services/emailVerification.service";

export default function EmailVerification({ kind, accountEmail, onVerified }) {
  const [status, setStatus] = useState(null),
    [open, setOpen] = useState(false),
    [code, setCode] = useState(""),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const data = await getVerificationStatus(kind, controller.signal);
        if (active) {
          setStatus(data);
          setCooldown(data.retryAfter || 0);
        }
      } catch {
        /* Other authenticated requests handle expired sessions. */
      }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      controller.abort();
      window.removeEventListener("focus", refresh);
    };
  }, [kind, accountEmail]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000
    );
    return () => clearTimeout(timer);
  }, [cooldown]);
  const send = async () => {
    if (busy || cooldown) return;
    setBusy("send");
    setError("");
    try {
      const data = await sendVerificationCode(kind);
      setStatus({ ...data, codePending: !data.emailVerified });
      setCode("");
      setCooldown(data.retryAfter || 0);
      if (!data.emailVerified)
        toast.success("Verification code sent to your email.");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to send the code. Please try again."
      );
      const wait = Number(e.response?.headers?.["retry-after"]);
      if (wait) setCooldown(wait);
    } finally {
      setBusy("");
    }
  };
  const verify = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setBusy("verify");
    setError("");
    try {
      const data = await verifyEmailCode(kind, code);
      setStatus(data);
      setOpen(false);
      setCode("");
      toast.success("Email verified successfully!");
      onVerified?.();
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to verify the code. Please retry."
      );
    } finally {
      setBusy("");
    }
  };
  if (!status || status.emailVerified) return null;
  return (
    <>
      <div
        className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5"
        role="region"
        aria-label="Email verification"
      >
        <div className="flex min-w-0 items-start gap-3">
          <Mail className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm font-bold text-amber-950">
              Verify your email address
            </p>
            <p className="mt-1 break-all text-xs leading-5 text-amber-800">
              {status.email} · Verify it to keep your account details up to
              date.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setOpen(true);
            setError("");
            if (!status.codePending) void send();
          }}
        >
          Verify email
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        title="Verify your email"
        description={`We'll send a 6-digit code to ${status.email}.`}
        size="sm"
        disableClose={Boolean(busy)}
      >
        <form onSubmit={verify} className="space-y-5 p-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <ShieldCheck size={28} />
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Enter the code from your latest email. It is valid for 10 minutes.
            Check your spam folder too.
          </p>
          <Input
            label="Verification code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, ""));
              setError("");
            }}
            disabled={Boolean(busy)}
            className="text-center text-2xl tracking-[.35em]"
          />
          {error && (
            <p role="alert" className="text-sm leading-6 text-rose-700">
              {error}
            </p>
          )}
          <Button
            type="submit"
            fullWidth
            loading={busy === "verify"}
            disabled={Boolean(busy) || code.length !== 6}
          >
            Verify email address
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            loading={busy === "send"}
            disabled={Boolean(busy) || cooldown > 0}
            onClick={send}
          >
            {cooldown > 0
              ? `Resend code in ${cooldown}s`
              : status.codePending
              ? "Resend code"
              : "Send verification code"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
