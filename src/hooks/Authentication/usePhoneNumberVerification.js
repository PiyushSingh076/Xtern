import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const usePhoneNumberVerification = (userId) => {
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState(null);

  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    setError(null);

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhoneNumber = "+" + phoneNumber;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      setError("Error sending OTP. Please try again.");
      console.error("Error in sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setLoading(true);
    setError(null);

    try {
      const confirmationResult = window.confirmationResult;
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Update Firestore with phone number
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        phone_number: user.phoneNumber,
        registrationStatus: "phone_verified",
      });

      toast.success("Phone number verified and stored.");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("Error in verifying OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  return { sendOTP, verifyOTP, showOTP, loading, error };
};

export default usePhoneNumberVerification;
