// RecaptchaTest.jsx
import React, { useEffect } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebaseConfig";

const RecaptchaTest = () => {
  useEffect(() => {
    const setupRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-test",
          {
            size: "normal",
            callback: (response) => {
              // console.log("reCAPTCHA solved:", response);
            },
            "expired-callback": () => {
              toast.error("reCAPTCHA expired. Please verify again.");
              window.recaptchaVerifier.reset();
            },
          },
          auth
        );

        window.recaptchaVerifier
          .render()
          .then((widgetId) => {
          })
          .catch((error) => {
            toast.error("Failed to load reCAPTCHA. Please try again.");
          });
      }
    };

    setupRecaptcha();
  }, []);

  return <div id="recaptcha-test"></div>;
};

export default RecaptchaTest;
