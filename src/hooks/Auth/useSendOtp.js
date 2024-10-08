// hooks/useSendOtp.js
import { useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import toast from "react-hot-toast";

const useSendOtp = (auth) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async (phoneNumber, setShowOTP) => {
    setLoading(true);
    setError("");

    try {
      // Ensure reCAPTCHA verifier is initialized
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA verifier not initialized.");
      }

      const formattedPhone = `+${phoneNumber}`; // Ensure phone number is in international format

      // Send OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading, error };
};

export default useSendOtp;
