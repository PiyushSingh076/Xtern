// // hooks/useVerifyOtp.js
// import { useState } from "react";
// import {
//   PhoneAuthProvider,
//   linkWithCredential,
//   signInWithCredential,
// } from "firebase/auth";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import toast from "react-hot-toast";
// import { auth, db } from "../../firebaseConfig";
// import { ROUTES } from "../../constants/routes";

// const useVerifyOtp = () => {
//   const [loading, setLoading] = useState(false);

//   const verifyOtp = async (otp, setError, navigate) => {
//     setLoading(true);
//     try {
//       const confirmationResult = window.confirmationResult;

//       if (!confirmationResult) {
//         throw new Error(
//           "No confirmation result available. Please request a new OTP."
//         );
//       }

//       // Create phone credential using the verification ID and OTP
//       const phoneCredential = PhoneAuthProvider.credential(
//         confirmationResult.verificationId,
//         otp
//       );

//       const user = auth.currentUser;

//       if (user) {
//         // User is authenticated; attempt to link phone number
//         await linkPhoneNumber(user, phoneCredential, setError, navigate);
//       } else {
//         // User is not authenticated; sign in with phone credential
//         await signInWithPhone(phoneCredential, navigate);
//       }
//     } catch (err) {
//       console.error("Error verifying OTP:", err);
//       // Handle specific Firebase Auth errors
//       if (err.code) {
//         switch (err.code) {
//           case "auth/invalid-verification-code":
//             setError("The OTP you entered is invalid. Please try again.");
//             break;
//           case "auth/code-expired":
//             setError("The OTP has expired. Please request a new one.");
//             break;
//           case "auth/account-exists-with-different-credential":
//             setError(
//               "This phone number is linked to another account. Please sign in using that method."
//             );
//             break;
//           default:
//             setError(err.message || "Error verifying OTP. Please try again.");
//         }
//       } else {
//         setError(err.message || "Error verifying OTP. Please try again.");
//       }
//       toast.error(setError);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const linkPhoneNumber = async (user, phoneCredential, setError, navigate) => {
//     try {
//       // Link the phone credential to the user
//       await linkWithCredential(user, phoneCredential);

//       // Fetch user data from Firestore
//       const userDocRef = doc(db, "users", user.uid);
//       const userDocSnap = await getDoc(userDocRef);

//       if (userDocSnap.exists()) {
//         const userData = userDocSnap.data();

//         // Update Firestore with phone number and verification status
//         await updateDoc(userDocRef, {
//           phone_number: user.phoneNumber,
//           isPhoneVerified: true,
//         });
//       } else {
//         // If user document does not exist, create it
//         await setDoc(userDocRef, {
//           phone_number: user.phoneNumber,
//           isPhoneVerified: true,
//           typeUser: "default", // Adjust based on your user schema
//           // Add other default fields as necessary
//         });
//       }

//       // Clear the reCAPTCHA verifier
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = null;
//       }

//       toast.success("Phone number verified successfully!");

//       // Redirect based on typeUser field
//       if (userDocSnap.exists() && userDocSnap.data().typeUser) {
//         navigate(ROUTES.HOME);
//       } else {
//         navigate(ROUTES.PREFERRED_ROLE);
//       }
//     } catch (error) {
//       console.error("Linking error:", error);
//       if (error.code === "auth/account-exists-with-different-credential") {
//         setError(
//           "This phone number is linked to another account. Please sign in using that method."
//         );
//         // Sign the user out to avoid conflicts
//         await auth.signOut();
//         navigate(ROUTES.SIGN_IN);
//       } else {
//         setError(
//           error.message || "Error linking phone number. Please try again."
//         );
//       }
//     }
//   };

//   const signInWithPhone = async (phoneCredential, navigate) => {
//     try {
//       // Sign in with the phone credential
//       const userCredential = await signInWithCredential(auth, phoneCredential);
//       const user = userCredential.user;

//       // Fetch or create user data in Firestore
//       const userDocRef = doc(db, "users", user.uid);
//       const userDocSnap = await getDoc(userDocRef);

//       if (!userDocSnap.exists()) {
//         // Create a new user document if it doesn't exist
//         await setDoc(userDocRef, {
//           phone_number: user.phoneNumber,
//           isPhoneVerified: true,
   
//           // Add other default fields as necessary
//         });
//       } else {
//         // Update existing user document
//         await updateDoc(userDocRef, {
//           phone_number: user.phoneNumber,
//           isPhoneVerified: true,
//         });
//       }

//       // Clear the reCAPTCHA verifier
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = null;
//       }

//       toast.success("Phone number verified and signed in successfully!");

//       // Redirect based on typeUser field
//       if (userDocSnap.exists() && userDocSnap.data().typeUser) {
//         navigate(ROUTES.HOME);
//       } else {
//         navigate(ROUTES.PREFERRED_ROLE);
//       }
//     } catch (error) {
//       console.error("Sign-in error:", error);
//       if (error.code === "auth/account-exists-with-different-credential") {
//         console.error(
//           "This phone number is linked to another account. Please sign in using that method."
//         );
//         // Sign the user out to avoid conflicts
//         await auth.signOut();
//         navigate(ROUTES.SIGN_IN);
//       } else {
//         console.error(
//           error.message ||
//             "Error signing in with phone number. Please try again."
//         );
//       }
//     }
//   };

//   return { verifyOtp, loading };
// };

// export default useVerifyOtp;





import { useState } from "react";
import {
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { ROUTES } from "../../constants/routes";

const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const getFirebaseErrorMessage = (error) => {
    const errorMap = {
      "auth/invalid-verification-code": "The OTP you entered is invalid. Please try again.",
      "auth/code-expired": "The OTP has expired. Please request a new one.",
      "auth/account-exists-with-different-credential":
        "This phone number is linked to another account. Please sign in using that method.",
      "auth/provider-already-linked": "This phone number is already linked to your account.",
      // Add more mappings as needed
    };

    return errorMap[error.code] || error.message || "An unexpected error occurred. Please try again.";
  };

  const verifyOtp = async (otp, setError, navigate) => {
    setLoading(true);
    try {
      const confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        throw new Error("No confirmation result available. Please request a new OTP.");
      }

      // Create phone credential
      const phoneCredential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );

      const user = auth.currentUser;

      if (user) {
        // User is authenticated; link phone number
        await linkPhoneNumber(user, phoneCredential, navigate);
      } else {
        // Sign in with phone credential
        await signInWithPhone(phoneCredential, navigate);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      const errorMessage = getFirebaseErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const linkPhoneNumber = async (user, phoneCredential, navigate) => {
    try {
      // Link phone credential to user
      await linkWithCredential(user, phoneCredential);

      // Update Firestore data
      await updateUserData(user);

      toast.success("Phone number verified successfully!");
      navigateUser(user, navigate);
    } catch (error) {
      console.error("Linking error:", error);

      if (error.code === "auth/provider-already-linked") {
        // Phone number already linked; treat as success
        await updateUserData(user);
        toast.success("Phone number already linked and verified!");
        navigateUser(user, navigate);
      } else if (error.code === "auth/account-exists-with-different-credential") {
        // Handle account conflict
        await resolveCredentialConflict(error, phoneCredential, navigate);
      } else {
        const errorMessage = getFirebaseErrorMessage(error);
        setErrorAndNavigate(errorMessage, navigate);
      }
    }
  };

  const signInWithPhone = async (phoneCredential, navigate) => {
    try {
      // Sign in with phone credential
      const userCredential = await signInWithCredential(auth, phoneCredential);
      const user = userCredential.user;

      // Update Firestore data
      await updateUserData(user);

      toast.success("Phone number verified and signed in successfully!");
      navigateUser(user, navigate);
    } catch (error) {
      console.error("Sign-in error:", error);

      if (error.code === "auth/account-exists-with-different-credential") {
        // Handle account conflict
        await resolveCredentialConflict(error, phoneCredential, navigate);
      } else {
        const errorMessage = getFirebaseErrorMessage(error);
        setErrorAndNavigate(errorMessage, navigate);
      }
    }
  };

  const resolveCredentialConflict = async (error, phoneCredential, navigate) => {
    const email = error.customData?.email;

    if (email) {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.includes("google.com")) {
        toast.error(
          "This phone number is linked to a Google account. Please sign in with Google."
        );
        navigate(ROUTES.SIGN_IN);
      } else {
        toast.error("Account conflict detected. Please resolve via support.");
      }
    } else {
      toast.error("Unable to resolve conflict. Please try again.");
    }

    await auth.signOut();
  };

  const updateUserData = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Update existing user document
      await updateDoc(userDocRef, {
        phone_number: user.phoneNumber,
        isPhoneVerified: true,
      });
    } else {
      // Create a new user document
      await setDoc(userDocRef, {
        phone_number: user.phoneNumber,
        isPhoneVerified: true,
        typeUser: "default",
      });
    }

    // Clear reCAPTCHA verifier
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  const navigateUser = async (user, navigate) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().typeUser) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.PREFERRED_ROLE);
      }
    } catch (err) {
      console.error("Navigation error:", err);
      toast.error("Failed to navigate. Please try again.");
    }
  };

  const setErrorAndNavigate = async (errorMessage, navigate) => {
    toast.error(errorMessage);
    await auth.signOut();
    navigate(ROUTES.SIGN_IN);
  };

  return { verifyOtp, loading };
};

export default useVerifyOtp;
