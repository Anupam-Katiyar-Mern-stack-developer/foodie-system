export const deliveryOtpTemplate = ({
  customerName,
  orderNumber,
  otp,
}) => {
  return {
    subject:
      `Delivery OTP for ${orderNumber}`,

    text:
      `Hi ${customerName}, your delivery OTP for order ${orderNumber} is ${otp}. Please share it only with your delivery agent at the time of delivery.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 24px;
      ">
        <h2>Your Foodie Order is Out for Delivery</h2>

        <p>
          Hi ${customerName},
        </p>

        <p>
          Your order
          <strong>${orderNumber}</strong>
          is on the way.
        </p>

        <p>Your delivery OTP is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 24px 0;
        ">
          ${otp}
        </div>

        <p>
          Share this OTP only with the
          delivery agent when you receive
          your order.
        </p>

        <p>
          This OTP expires in 15 minutes.
        </p>
      </div>
    `,
  };
};