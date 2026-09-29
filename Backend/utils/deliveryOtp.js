import crypto from "crypto";

export const generateDeliveryOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashDeliveryOtp = (otp) => {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(String(otp))
    .digest("hex");
};

export const verifyDeliveryOtp = ({ otp, otpHash }) => {
  if (!otpHash) {
    return false;
  }

  const generatedHash = hashDeliveryOtp(otp);

  const generatedBuffer = Buffer.from(generatedHash, "hex");

  const storedBuffer = Buffer.from(otpHash, "hex");

  if (generatedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, storedBuffer);
};
