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
        if (!userDoc.exists() || userData?.isPhoneVerified === false || userData?.isPhoneVerified === null) {
          toast("Please verify your phone number", { position: "bottom-left" });
          navigate("/verifyscreen");
        } else if (!userData.type) {
          navigate("/choosetype");
        } else if (userData.type === "entrepreneur") {
          toast.success("Welcome back, Entrepreneur!", {
            position: "bottom-left",
          });
          navigate("/entrepreneur/"+userData.uid);
        } else if (userData.typeUser !== null && userData.typeUser !== "entrepreneur") {
          navigate("/profile/"+userData.uid)
        }
      } else {
        const newUserData = {
          uid: user.uid,
          display_name: user.displayName || "User",
          firstName: user.displayName ? user.displayName.split(" ")[0] : "User", // Extract first name
          lastName: user.displayName
            ? user.displayName.split(" ").slice(1).join(" ") // Extract last name (if exists)
            : "",
          fullName: user.displayName || "User",
          email: user.email,
          photo_url: user.photoURL,
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
