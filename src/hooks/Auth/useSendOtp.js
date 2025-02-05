import { useState, useEffect, useCallback } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebaseConfig";

const useSendOtp = () => {
  const [loading, setLoading] = useState(false);

  const initializeRecaptcha = useCallback(() => {
    try {
      // Only initialize if it doesn't exist
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: "invisible",
            callback: (response) => {
            },
            'expired-callback': () => {
              // Reset instead of creating new instance
              if (window.recaptchaVerifier) {
                window.recaptchaVerifier.reset();
              }
            }
          },
          auth
        );
      

      // No need to render - it will be rendered automatically when needed
      return Promise.resolve(window.recaptchaVerifier);
    } catch (error) {
      throw error;
    }
  }, []);

  const sendOtp = async (phoneNumber, setShowOTP, setError, navigate) => {
    setLoading(true);
    setError("");

    try {
      const formattedPhone = phoneNumber.startsWith("+") 
        ? phoneNumber 
        : `+${phoneNumber}`;

      // const verifier = await initializeRecaptcha();
      
     
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error("Detailed error:", err);
      
      // Only clear on specific errors
      if (err.code === 'auth/captcha-check-failed' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (clearError) {
          console.error("Error clearing reCAPTCHA:", clearError);
        }
      }

      const errorMessages = {
        'auth/invalid-app-credential': 'Authentication setup error. Please try again.',
        'auth/invalid-phone-number': 'Please enter a valid phone number.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.'
      };

      const message = errorMessages[err.code] || 'Failed to send OTP. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Clear reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
    };
  }, []);

  return { sendOtp, loading };
};

export default useSendOtp;