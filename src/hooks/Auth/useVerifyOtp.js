import { useState } from "react";
import {
  PhoneAuthProvider,
  linkWithCredential,
  updatePhoneNumber,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { useRefreshUserData } from "./useRefreshUserData";

const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const {refreshUser} = useRefreshUserData()

  /**
   * Verifies OTP and links phone number to the current authenticated user.
   * If the phone number provider is already linked, updates the Firestore DB with the new number.
   *
   * @param {string} otp - The OTP entered by the user.
   * @param {string} newPhoneNumber - The new phone number to update in Firestore.
   * @param {function} setError - Function to set error messages.
   * @param {function} navigate - Function to navigate to different routes.
   */
  const verifyOtp = async (otp, newPhoneNumber, setError, navigate) => {
    setLoading(true);

    let phoneCredential; // Declare `phoneCredential` for reuse across blocks

    try {
      const confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        throw new Error(
          "No confirmation result available. Please request a new OTP."
        );
      }

      // Create phone credential using OTP
      phoneCredential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );

      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "No authenticated user found. Please sign in with your account first."
        );
      }

      // Attempt to link phone number to the authenticated user
      await linkWithCredential(user, phoneCredential);

      // Update Firestore with the verified phone number
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        phone_number: phoneCredential.phoneNumber || user.phoneNumber,
        isPhoneVerified: true,
      });

      toast.success("Phone number verified and linked successfully!");
      const userSnapshot = await getDoc(userDocRef);
          console.log("userSnapshot", userSnapshot.data());
      const userData = userSnapshot.data();
      if(userData.type == null){
        navigate("/choosetype");
      }
      

      else if(userData.type == "entrepreneur"){
        navigate("/entrepreneur/"+userDocRef.id);
      }
      else{
        navigate("/profile/"+userDocRef.id);
      }
      refreshUser()



          navigate("/choosetype"); // Redirect to dashboard or home page
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.code === "auth/provider-already-linked") {
        try {
          const user = auth.currentUser;

          if (!user) {
            throw new Error(
              "No authenticated user found. Please sign in with your account first."
            );
          }

          if (!newPhoneNumber) {
            throw new Error(
              "New phone number is required to update Firestore."
            );
          }

          // Update Firestore with the new phone number
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            phone_number: newPhoneNumber,
            isPhoneVerified: true,
          });

          // Update phone number in Firebase Auth
          await updatePhoneNumber(user, phoneCredential);

          toast.success(
            "Phone number provider already linked. Firestore updated successfully!"
          );

          const userSnapshot = await getDoc(userDocRef);
          console.log("userSnapshot", userSnapshot.data());


          navigate("/homescreen"); // Redirect to dashboard or home page
        } catch (firestoreError) {
          console.error("Error updating Firestore:", firestoreError);
          toast.error("Failed to update phone number in Firestore.");
        }
        return;
      }

      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maps Firebase error codes to user-friendly messages.
   *
   * @param {object} error - The Firebase error object.
   * @returns {string} - A user-friendly error message.
   */
  const getFirebaseErrorMessage = (error) => {
    const errorMap = {
      "auth/invalid-verification-code":
        "The OTP you entered is invalid. Please try again.",
      "auth/code-expired": "The OTP has expired. Please request a new one.",
      "auth/credential-already-in-use":
        "This phone number is already linked to another account.",
      "auth/provider-already-linked":
        "This phone number is already linked to your account.",
      "auth/account-exists-with-different-credential":
        "This phone number is linked to a different account. Please sign in with that account.",
    };

    return (
      errorMap[error.code] || error.message || "An unexpected error occurred."
    );
  };

  return { verifyOtp, loading };
};

export default useVerifyOtp;

