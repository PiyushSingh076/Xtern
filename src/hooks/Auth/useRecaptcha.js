// hooks/useRecaptcha.js
import { useEffect } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const useRecaptcha = () => {
  /**
   * Initializes the reCAPTCHA verifier.
   */
  const initRecaptchaVerifier = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow sending OTP
            console.log("reCAPTCHA solved", response);
          },
          "expired-callback": () => {
            // Reset reCAPTCHA if it expires
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.reset();
            }
          },
        },
        auth
      );

      window.recaptchaVerifier
        .render()
        .then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        })
        .catch((error) => {
          console.error("Error rendering reCAPTCHA:", error);
        });
    }
  };

  /**
   * Resets the reCAPTCHA verifier.
   */
  const resetRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    initRecaptchaVerifier();
  };

  /**
   * Cleanup on unmount.
   */
  useEffect(() => {
    initRecaptchaVerifier(); // Initialize on mount

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { resetRecaptcha, initRecaptchaVerifier };
};

export default useRecaptcha;
