import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-hot-toast";

const usePhoneNumberVerification = () => {
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");

  // Ensure ReCAPTCHA is initialized properly
  const ensureRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      console.log("Initializing ReCAPTCHA...");
      window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("ReCAPTCHA verified successfully.");
          },
          "expired-callback": () => {
            console.log("ReCAPTCHA expired. Please try again.");
          },
        },
        auth
      );

      // Render ReCAPTCHA
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    } else {
      console.log("ReCAPTCHA already initialized.");
    }
  };

  // Send OTP to the user's phone number
  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    setError("");

    ensureRecaptcha(); // Initialize ReCAPTCHA if not already done

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number.");
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhoneNumber = "+" + phoneNumber;

      // Send OTP via Firebase
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );

      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      // Handle specific Firebase errors and reset ReCAPTCHA if needed
      switch (err.code) {
        case "auth/invalid-app-credential":
          setError("Invalid app credential. Please try again.");
          toast.error("Invalid app credential. Reinitializing ReCAPTCHA.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          toast.error("Network error. Please check your connection.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          toast.error("Too many requests. Please try again later.");
          break;
        default:
          setError("Error sending OTP. Please try again.");
          toast.error("Error sending OTP. Please try again.");
          console.error("Error in sending OTP:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { sendOTP, showOTP, loading, error };
};

export default usePhoneNumberVerification;
