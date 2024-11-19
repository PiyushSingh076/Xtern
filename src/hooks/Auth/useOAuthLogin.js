import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";

const useOAuthLogin = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider, providerName) => {
    setLoadingProvider(providerName);
    try {
      // Sign in with the selected provider
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Reference to the user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the phone number is verified
        if (!userData.phone_number || !userData.isPhoneVerified) {
          toast("Please verify your phone number", { position: "bottom-left" });
          navigate("/verifyscreen");
        } else if (!userData.typeUser) {
          navigate("/roleselect");
        } else if (userData.typeUser === "entrepreneur") {
          toast.success("Welcome back, Entrepreneur!", {
            position: "bottom-left",
          });
          navigate("/homescreen");
        } else if (userData.typeUser === "Intern") {
          if (!userData.skillSet || userData.skillSet.length === 0) {
            navigate("/select-skills");
          } else {
            navigate("/");
          }
        }
      } else {
        // Create a new user document if it doesn't exist
        const newUserData = {
          uid: user.uid,
          display_name: user.displayName || "User",
          email: user.email,
          profilePicture: user.photoURL,
          provider: user.providerData[0]?.providerId,
          lastLogin: new Date(),
          isPhoneVerified: false, // Set phone verification flag to false initially
        };
        await setDoc(userDocRef, newUserData);
        sessionStorage.setItem("uid", newUserData.uid);
        toast.success("Verification Successful", { position: "bottom-left" });
        navigate("/verifyscreen");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Sign-in failed", { position: "bottom-left" });
    } finally {
      setLoadingProvider(null);
    }
  };

  return { handleOAuthLogin, loadingProvider };
};

export default useOAuthLogin;
