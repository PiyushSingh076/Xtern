
import { useState } from "react";
import {
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { ROUTES } from "../../constants/routes";

const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (otp, setError, navigate) => {
    setLoading(true);
    try {
      const confirmationResult = window.confirmationResult;

      // Create phone credential
      const phoneCredential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );

      const user = auth.currentUser;

      if (user) {
        try {
          // Try linking the phone credential to the user
          await linkWithCredential(user, phoneCredential);

          // If successful, get user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // Update Firestore with the phone number and verification status
            await updateDoc(userDocRef, {
              phone_number: user.phoneNumber,
              isPhoneVerified: true,
            });

            // Clear the reCAPTCHA
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }

            toast.success("Phone number verified successfully!");

            // Redirect based on typeUser field
            if (userData.typeUser) {
              navigate(ROUTES.HOME);
            } else {
              navigate(ROUTES.PREFERRED_ROLE);
            }
          } else {
            throw new Error("User data not found.");
          }
        } catch (error) {
          console.log(error);
          // Handle account linking error
          if (error.code === "auth/account-exists-with-different-credential") {
            // If the error is due to a different credential, link the accounts
            setError(
              "This phone number is linked to another account. Please sign in."
            );

            // Sign the user out to avoid conflicts
            await auth.signOut();
            navigate(ROUTES.SIGN_IN);
          } else {
            throw error; // For other errors, pass it along to be handled in the catch block
          }
        }
      } else {
        throw new Error("No authenticated user found.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading };
};

export default useVerifyOtp;
