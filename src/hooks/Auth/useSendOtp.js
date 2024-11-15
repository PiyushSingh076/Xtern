// hooks/useSendOtp.js
import { useState, useEffect } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebaseConfig";

const useSendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Initializes the reCAPTCHA verifier if it's not already initialized.
   */
  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible", // Can be 'normal' if you want the widget to be visible
          callback: (response) => {
            // reCAPTCHA solved, allow OTP sending
            // You can optionally handle the response here
          },
          "expired-callback": () => {
            // Reset reCAPTCHA if it expires
            window.recaptchaVerifier.reset();
          },
        },
        auth
      );
    }
  };

  /**
   * Sends an OTP to the provided phone number.
   *
   * @param {string} phoneNumber - The user's phone number in international format (e.g., +1234567890).
   * @returns {Promise<void>}
   */
  const sendOtp = async (phoneNumber, setShowOTP) => {
    setLoading(true);
    setError("");

    try {
      // Initialize reCAPTCHA
      initializeRecaptcha();

      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`; // Ensure phone number is in international format

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
            setError("You have exceeded the OTP request limit. Please try again later.");
            toast.error("You have exceeded the OTP request limit. Please try again later.");
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

  /**
   * Cleans up the reCAPTCHA verifier when the component using this hook unmounts.
   */
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  return { sendOtp, loading, error };
};

export default useSendOtp;
