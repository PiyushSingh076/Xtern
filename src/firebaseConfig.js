import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyBdxeEzOz9LFz9hg2ZzfuC5n_Y5wEtb0-w",
  // authDomain: "startup-dev-f53e8.firebaseapp.com",
  // projectId: "startup-dev-f53e8",
  // storageBucket: "startup-dev-f53e8.firebasestorage.app",
  // messagingSenderId: "4190684230",
  // appId: "1:4190684230:web:5ea85779844fa72b81b647",
  // measurementId: "G-RJ1DC1JZK5"
  apiKey: "AIzaSyCpzZHQ5R-fjc3Y8eH2rakvvRNRyYRWu6c",

  authDomain: "startup-a54cf.firebaseapp.com",

  projectId: "startup-a54cf",

  storageBucket: "startup-a54cf.appspot.com",

  messagingSenderId: "876440760888",

  appId: "1:876440760888:web:7eabbfdf0b9ab0c0e8accd",

  measurementId: "G-TS4ZN2DBB0"

};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const realtimeDb = getDatabase(app); // Initialize Realtime Database
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app); // Initialize Firebase Storage
// Authentication providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

export {
  auth,
  db,
  realtimeDb,
  functions,
  storage, // Export storage
  googleProvider,
  facebookProvider,
  appleProvider,
};