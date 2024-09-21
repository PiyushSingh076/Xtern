import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";

const useOAuthLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Prepare user data for storage
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        provider: user.providerData[0].providerId,
        lastLogin: new Date(),
      };

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      toast.success("Verification Successful", { position: "bottom-left" });
      navigate("/preferredlanguage"); // Redirect the user after successful login
    } catch (error) {
      console.error("Error during sign-in", error);
      toast.error("Sign-in failed", { position: "bottom-left" });
    } finally {
      setLoading(false);
    }
  };

  return { handleOAuthLogin, loading };
};

export default useOAuthLogin;
