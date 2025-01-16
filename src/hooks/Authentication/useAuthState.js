import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../firebaseConfig";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        // Fetch registration status from Firestore
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRegistrationStatus(userData.registrationStatus || "logged_in");
        }
      } else {
        setUser(null);
        setRegistrationStatus(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, registrationStatus, setRegistrationStatus, refreshCount, setRefreshCount };
};

export default useAuthState;
