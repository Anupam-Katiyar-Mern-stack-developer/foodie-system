import apiClient from "../../api/apiClient";

export const getPaymentConfig = async () =>
  (await apiClient.get("/payments/config")).data.data;
export const getCheckoutQuote = async (couponCode = "", signal) =>
  (await apiClient.get("/payments/quote", { params: { couponCode }, signal }))
    .data.data;
let checkoutScript;
const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript)
    checkoutScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () =>
        window.Razorpay
          ? resolve()
          : reject(new Error("Payment checkout did not load"));
      script.onerror = () => {
        checkoutScript = null;
        script.remove();
        reject(new Error("Unable to load Razorpay. Please retry."));
      };
      document.head.append(script);
    });
  return checkoutScript;
};

export const payForCheckout = async (checkoutNumber) => {
  const status = (
    await apiClient.get(
      `/payments/${encodeURIComponent(checkoutNumber)}/status`
    )
  ).data.data;
  if (status.paymentStatus === "PAID") return status;
  if (status.paymentStarted) {
    const reconciled = (
      await apiClient.post("/payments/reconcile", { checkoutNumber })
    ).data.data;
    if (reconciled.paymentStatus === "PAID") return reconciled;
  }
  await loadRazorpay();
  const payment = (await apiClient.post("/payments/create", { checkoutNumber }))
    .data.data;
  return new Promise((resolve, reject) => {
    let confirming = false;
    const checkout = new window.Razorpay({
      key: payment.keyId,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.orderId,
      name: payment.siteName,
      description: `Checkout ${checkoutNumber}`,
      prefill: payment.prefill,
      theme: { color: "#f97316" },
      handler: async (result) => {
        confirming = true;
        try {
          let verified;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              verified = (
                await apiClient.post("/payments/verify", {
                  ...result,
                  checkoutNumber,
                })
              ).data.data;
              break;
            } catch (error) {
              if (error.response?.status !== 409 || attempt === 2) throw error;
              await new Promise((done) => setTimeout(done, 1200));
            }
          }
          resolve(verified);
        } catch (error) {
          try {
            const latest = (
              await apiClient.get(
                `/payments/${encodeURIComponent(checkoutNumber)}/status`
              )
            ).data.data;
            if (latest.paymentStatus === "PAID") {
              resolve(latest);
              return;
            }
          } catch {
            /* Keep the original verification failure. */
          }
          reject(
            new Error(
              error.response?.data?.message ||
                "Payment confirmation is pending. Retry verification from your order."
            )
          );
        }
      },
      modal: {
        ondismiss: () => {
          if (!confirming)
            reject(
              new Error("Payment window closed. You can pay from My Orders.")
            );
        },
      },
    });
    checkout.open();
  });
};
