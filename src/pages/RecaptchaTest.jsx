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
              console.log("reCAPTCHA solved:", response);
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired. Resetting...");
              window.recaptchaVerifier.reset();
            },
          },
          auth
        );

        window.recaptchaVerifier
          .render()
          .then((widgetId) => {
            console.log("reCAPTCHA rendered with widget ID:", widgetId);
          })
          .catch((error) => {
            console.error("Error rendering reCAPTCHA:", error);
          });
      }
    };

    setupRecaptcha();
  }, []);

  return <div id="recaptcha-test"></div>;
};

export default RecaptchaTest;
