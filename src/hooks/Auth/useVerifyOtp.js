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

      if (user) {
        // User is authenticated; check if phone is already linked
        const providers = user.providerData.map(
          (provider) => provider.providerId
        );
        if (providers.includes(PhoneAuthProvider.PROVIDER_ID)) {
          // Phone is already linked, proceed to verify or update as needed
          await updatePhoneNumber(user, phoneCredential, setError, navigate);
        } else {
          // Phone is not linked, attempt to link
          await linkPhoneNumber(user, phoneCredential, setError, navigate);
        }
      } else {
        // User is not authenticated; sign in with phone credential
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

      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Update Firestore with phone number and verification status
        await updateDoc(userDocRef, {
          phone_number: user.phoneNumber,
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
      console.error("Linking error:", error);
      if (error.code === "auth/provider-already-linked") {
        // Phone number is already linked
        toast.info("Phone number is already linked to your account.");

        // Optionally, update Firestore if needed
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, {
            phone_number: user.phoneNumber,
            isPhoneVerified: true,
          });
        }

        // Redirect the user appropriately
        navigate(ROUTES.HOME);
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
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

  const updatePhoneNumber = async (
    user,
    phoneCredential,
    setError,
    navigate
  ) => {
    try {
      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Update Firestore with phone number and verification status
        await updateDoc(userDocRef, {
          phone_number: user.phoneNumber,
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
      console.error("Updating phone number error:", error);
      setError(
        error.message || "Error updating phone number. Please try again."
      );
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
          error.message ||
            "Error signing in with phone number. Please try again."
        );
        toast.error(setError);
      }
    }
  };

  return { verifyOtp, loading };
};

export default useVerifyOtp;
