export const deliveryOtpTemplate = ({ customerName, orderNumber, otp }) => {
  const subject = `Delivery OTP for ${orderNumber}`;

  const text = `Hi ${customerName}, your delivery verification OTP is ${otp}. It is valid for 15 minutes. Do not share this OTP until your order reaches you.`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#0f172a">
      <h2 style="margin:0 0 12px">Your Foodie order is on the way 🚚</h2>

      <p>Hi ${customerName},</p>

      <p>
        Your order <strong>${orderNumber}</strong> is out for delivery.
        Give the OTP below to the delivery partner only after receiving your order.
      </p>

      <div style="margin:24px 0;padding:20px;text-align:center;background:#fff7ed;border-radius:12px">
        <div style="font-size:12px;color:#64748b">DELIVERY OTP</div>
        <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#f97316">
          ${otp}
        </div>
      </div>

      <p style="color:#64748b">
        This OTP is valid for 15 minutes.
      </p>

      <p style="color:#dc2626;font-weight:600">
        Do not share this OTP before receiving your order.
      </p>
    </div>
  `;

  return { subject, text, html };
};
