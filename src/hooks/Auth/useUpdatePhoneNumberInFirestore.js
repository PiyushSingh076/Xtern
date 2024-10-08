import { useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useUpdatePhoneNumberInFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Verify OTP and store phone number in Firestore
  const verifyOtpAndStorePhone = async (otp) => {
    setLoading(true);
    setError("");

    try {
      const confirmationResult = window.confirmationResult;
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Update user's phone number if the document exists
        const phoneData = { phone_number: user.phoneNumber };
        await updateDoc(userDocRef, phoneData);
        toast.success("Phone number verified and stored.");
      } else {
        setError("User document not found!");
        return;
      }

      // Navigate based on user type after verification
      const userData = userDoc.data();
      if (!userData.typeUser) {
        navigate("/primarygoalscreen");
      } else if (userData.typeUser === "Intern") {
        if (!userData.skillSet || userData.skillSet.length === 0) {
          navigate("/select-skills");
        } else {
          navigate("/homescreen");
        }
      } else {
        navigate("/homescreen");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("Error in verifying OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtpAndStorePhone, loading, error };
};

export default useUpdatePhoneNumberInFirestore;
