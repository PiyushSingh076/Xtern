import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";

const useOAuthLogin = () => {
  const [loadingProvider, setLoadingProvider] = useState(null); // Track loading per provider
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider, providerName) => {
    setLoadingProvider(providerName); // Set loading state for the specific provider
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // If user already exists, redirect them to the home screen
        toast.success("Welcome back!", { position: "bottom-left" });
        navigate("/homescreen");
      } else {
        // If user doesn't exist, store user data and navigate to verification screen
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          provider: user.providerData[0].providerId,
          lastLogin: new Date(),
        };

        // Store user data in Firestore
        await setDoc(userDocRef, userData);
        sessionStorage.setItem('uid', userData.uid)
        toast.success("Verification Successful", { position: "bottom-left" });
        // navigate("/verifyscreen");
        navigate("/preferredlanguage");
      }
    } catch (error) {
      console.error("Error during sign-in", error);
      toast.error("Sign-in failed", { position: "bottom-left" });
    } finally {
      setLoadingProvider(null); // Reset the loading state after completion
    }
  };

  return { handleOAuthLogin, loadingProvider };
};

export default useOAuthLogin;
