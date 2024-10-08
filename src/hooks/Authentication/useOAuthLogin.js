import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { toast } from "react-hot-toast";

const useOAuthLogin = (provider) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOAuthLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUser = {
          uid: user.uid,
          display_name: user.displayName || "User",
          email: user.email,
          profilePicture: user.photoURL,
          provider: user.providerData[0].providerId,
          registrationStatus: "logged_in",
        };
        await setDoc(userDocRef, newUser);
        toast.success("Google login successful.");
      } else {
        toast.success("Welcome back!");
      }
    } catch (err) {
      setError("Error during sign-in. Please try again.");
      console.error("Error during sign-in:", err);
    } finally {
      setLoading(false);
    }
  };

  return { handleOAuthLogin, loading, error };
};

export default useOAuthLogin;
