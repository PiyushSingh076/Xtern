// hooks/useVerifyOtp.js
import { useState } from "react";
import {
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { ROUTES } from "../../constants/routes";

const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (otp, setError, navigate) => {
    setLoading(true);
    try {
      const confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        throw new Error(
          "No confirmation result available. Please request a new OTP."
        );
      }

      // Create phone credential using the verification ID and OTP
      const phoneCredential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );

      const user = auth.currentUser;

      // Logging for debugging
      console.log("Current User:", user);
      console.log("User Phone Number:", user.phoneNumber);

      if (user) {
        if (user.phoneNumber) {
          // Phone number is already linked
          console.log("Phone number is already linked.");
          await updateFirestorePhoneVerification(user, navigate);
        } else {
          // Phone number is not linked; attempt to link
          console.log("Attempting to link phone number.");
          await linkPhoneNumber(user, phoneCredential, setError, navigate);
        }
      } else {
        // User is not authenticated; sign in with phone credential
        console.log("User not authenticated. Signing in with phone credential.");
        await signInWithPhone(phoneCredential, navigate);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      // Handle specific Firebase Auth errors
      if (err.code) {
        switch (err.code) {
          case "auth/invalid-verification-code":
            setError("The OTP you entered is invalid. Please try again.");
            break;
          case "auth/code-expired":
            setError("The OTP has expired. Please request a new one.");
            break;
          case "auth/account-exists-with-different-credential":
            setError(
              "This phone number is linked to another account. Please sign in using that method."
            );
            break;
          default:
            setError(err.message || "Error verifying OTP. Please try again.");
        }
      } else {
        setError(err.message || "Error verifying OTP. Please try again.");
      }
      toast.error(setError);
    } finally {
      setLoading(false);
    }
  };

  const linkPhoneNumber = async (user, phoneCredential, setError, navigate) => {
    try {
      // Attempt to link the phone credential to the user
      await linkWithCredential(user, phoneCredential);
      
      // Reload the user to ensure phoneNumber is updated
      await user.reload();
      const updatedUser = auth.currentUser;
      console.log("Updated User Phone Number:", updatedUser.phoneNumber);

      // Proceed to update Firestore
      await updateFirestorePhoneVerification(updatedUser, navigate);
    } catch (error) {
      console.error("Linking error:", error);
      if (error.code === "auth/provider-already-linked") {
        // Phone number is already linked
        toast.info("Phone number is already linked to your account.");

        // Update Firestore verification status
        await updateFirestorePhoneVerification(user, navigate);
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setError(
          "This phone number is linked to another account. Please sign in using that method."
        );
        // Sign the user out to avoid conflicts
        await auth.signOut();
        navigate(ROUTES.SIGN_IN);
      } else {
        setError(
          error.message || "Error linking phone number. Please try again."
        );
        toast.error(setError);
      }
    }
  };

  const updateFirestorePhoneVerification = async (user, navigate) => {
    try {
      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Update Firestore with phone verification status
        await updateDoc(userDocRef, {
          isPhoneVerified: true,
        });
      } else {
        // If user document does not exist, create it
        await setDoc(userDocRef, {
          phone_number: user.phoneNumber,
          isPhoneVerified: true,
         
        });
      }

      // Clear the reCAPTCHA verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      toast.success("Phone number verified successfully!");

      // Redirect based on typeUser field
      if (userDocSnap.exists() && userDocSnap.data().typeUser) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.PREFERRED_ROLE);
      }
    } catch (error) {
      console.error("Error updating Firestore:", error);
      setError(error.message || "Error updating verification status.");
      toast.error(setError);
    }
  };

  const signInWithPhone = async (phoneCredential, navigate) => {
    try {
      // Sign in with the phone credential
      const userCredential = await signInWithCredential(auth, phoneCredential);
      const user = userCredential.user;

      // Fetch or create user data in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userDocRef, {
          phone_number: user.phoneNumber,
          isPhoneVerified: true,
       
        });
      } else {
        // Update existing user document
        await updateDoc(userDocRef, {
          phone_number: user.phoneNumber,
          isPhoneVerified: true,
        });
      }

      // Clear the reCAPTCHA verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      toast.success("Phone number verified and signed in successfully!");

      // Redirect based on typeUser field
      if (userDocSnap.exists() && userDocSnap.data().typeUser) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.PREFERRED_ROLE);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        console.error(
          "This phone number is linked to another account. Please sign in using that method."
        );
        // Sign the user out to avoid conflicts
        await auth.signOut();
        navigate(ROUTES.SIGN_IN);
      } else {
        console.error(
          error.message ||
            "Error signing in with phone number. Please try again."
        );
        setError(
          error.message || "Error signing in with phone number. Please try again."
        );
        toast.error(setError);
      }
    }
  };

  return { verifyOtp, loading };
};

export default useVerifyOtp;
