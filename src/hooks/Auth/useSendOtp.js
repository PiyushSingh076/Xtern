// hooks/useSendOtp.js
import { useState } from "react";
import { signInWithPhoneNumber } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebaseConfig";

const useSendOtp = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Sends an OTP to the provided phone number.
   *
   * @param {string} phoneNumber - The user's phone number in international format (e.g., +1234567890).
   * @param {function} setShowOTP - Function to toggle the OTP input visibility.
   * @param {function} setError - Function to set error messages in the component.
   * @returns {Promise<void>}
   */
  const sendOtp = async (phoneNumber, setShowOTP, setError) => {
    setLoading(true);
    try {
      // Assume that reCAPTCHA is already initialized via useRecaptcha
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error("reCAPTCHA verifier not initialized");
      }

      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`; // Ensure phone number is in international format

      // Send OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      // Store confirmationResult locally instead of globally
      // You might want to manage this differently based on your app's architecture
      setShowOTP(true);
      toast.success("OTP sent successfully!");

      // Optionally, you can return confirmationResult if needed elsewhere
      return confirmationResult;
    } catch (err) {
      console.error("Error sending OTP:", err);

      // Handle specific Firebase Auth errors
      if (err.code) {
        switch (err.code) {
          case "auth/invalid-phone-number":
            setError("The phone number entered is invalid.");
            toast.error("The phone number entered is invalid.");
            break;
          case "auth/missing-phone-number":
            setError("Please enter a phone number.");
            toast.error("Please enter a phone number.");
            break;
          case "auth/quota-exceeded":
            setError(
              "You have exceeded the OTP request limit. Please try again later."
            );
            toast.error(
              "You have exceeded the OTP request limit. Please try again later."
            );
            break;
          default:
            setError("Failed to send OTP. Please try again.");
            toast.error("Failed to send OTP. Please try again.");
        }
      } else {
        setError("Failed to send OTP. Please try again.");
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading };
};

export default useSendOtp;
