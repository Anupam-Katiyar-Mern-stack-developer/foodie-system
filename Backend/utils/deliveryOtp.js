import crypto from "crypto";

const getOtpSecret = () => {
  const secret = process.env.DELIVERY_OTP_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Delivery OTP secret is not configured");
  }

  return secret;
};

export const generateDeliveryOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashDeliveryOtp = (otp) => {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(String(otp))
    .digest("hex");
};

export const verifyDeliveryOtp = (otp, storedHash) => {
  if (!otp || !storedHash) return false;

  const otpHash = hashDeliveryOtp(otp);

  const first = Buffer.from(otpHash, "hex");
  const second = Buffer.from(storedHash, "hex");

  if (first.length !== second.length) return false;

  return crypto.timingSafeEqual(first, second);
};
