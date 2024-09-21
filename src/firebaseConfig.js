import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getFunctions } from "firebase/functions";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCpzZHQ5R-fjc3Y8eH2rakvvRNRyYRWu6c",
  authDomain: "startup-a54cf.firebaseapp.com",
  projectId: "startup-a54cf",
  storageBucket: "startup-a54cf.appspot.com",
  messagingSenderId: "876440760888",
  appId: "1:876440760888:web:7eabbfdf0b9ab0c0e8accd",
  measurementId: "G-TS4ZN2DBB0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const functions = getFunctions(app)

// ReCAPTCHA setup for phone authentication
const setUpRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible", // Invisible for better UX
        callback: (response) => {
          console.log("ReCAPTCHA verified successfully.", response);
        },
        "expired-callback": () => {
          console.log("ReCAPTCHA expired. Please try again.");
        },
      },
      auth
    );

    // Ensure ReCAPTCHA is rendered
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }
};

// Initialize the providers for Google, Facebook, and Apple
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

// Export auth, Firestore (db), providers, and ReCAPTCHA setup
export {
  auth,
  db, // Export Firestore
  setUpRecaptcha,
  googleProvider,
  facebookProvider,
  appleProvider,
};
