import { useEffect } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { toast } from "react-hot-toast";

const useRecaptcha = (auth) => {
  // Initialize the Recaptcha Verifier
  const initRecaptchaVerifier = () => {
    return new Promise((resolve, reject) => {
      try {
        // Check if recaptchaVerifier is already initialized
        if (!window.recaptchaVerifier && auth) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container", // HTML element ID where reCAPTCHA should be rendered
            {
              size: "invisible", // Invisible reCAPTCHA for seamless UX
              callback: (response) => {
                console.log("reCAPTCHA verified successfully.", response);
              },
              "expired-callback": () => {
                console.log("reCAPTCHA expired. Please try again.");
                toast.error("reCAPTCHA expired. Please try again.");
              },
            },
            auth
          );
          window.recaptchaVerifier.render().then(() => {
            resolve(window.recaptchaVerifier);
          });
        } else {
          resolve(window.recaptchaVerifier); // Already initialized, resolve it
        }
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
        reject(error);
      }
    });
  };

  // Reset and reinitialize the reCAPTCHA
  const resetRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    return initRecaptchaVerifier(); // Reinitialize recaptcha
  };

  useEffect(() => {
    // Initialize recaptcha on mount
    initRecaptchaVerifier();

    // Cleanup reCAPTCHA on component unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear(); // Clear reCAPTCHA
        window.recaptchaVerifier = null; // Reset reference
      }
    };
  }, [auth]);

  return { resetRecaptcha, initRecaptchaVerifier };
};

export default useRecaptcha;
