import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import useAuthState from "../Authentication/useAuthState";
import { setRef } from "@mui/material";
import { AuthContext, useAuth } from "./useAuth";


const useFetchUserData = () => {
  const [userData, setUserData] = useState(null); // Holds user data from Firestore
  const [loading, setLoading] = useState(true); // Indicates loading state
  const [error, setError] = useState(null);
  const {registrationStatus, refreshCount} = useAuthState();
  
  const refreshData = useAuth()

  
   // Holds error messages, if any


  useEffect(() => {
    // Set up an authentication state observer
    async function fetchUserData() {


        const user = auth.currentUser;
        
        if (user) {
          setLoading(true)
          // User is signed in
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
  
            
  
            if (userDoc.exists()) {
              setUserData(userDoc.data()); // Update userData state with Firestore data
            } else {
              // User document does not exist in Firestore
              setError("No user profile found.");
              setUserData(null); // Clear any existing userData
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data.");
            setUserData(null); // Clear any existing userData
          } finally {
            setLoading(false); // Update loading state
          }
        } else {
          // User is signed out
          setUserData(null); // Clear userData when user signs out
          setLoading(false); // Update loading state
        }
      }
    
    onAuthStateChanged(auth, (userData) => {
      console.log("User Data",userData)
      if (userData) {
        fetchUserData();
      } else {
        setUserData(null); // Clear userData when user signs out
        setLoading(false); // Update loading state
      }
    });
     
  
    // console.log("Registration Status:", registrationStatus, refreshCount);
    // Clean up the listener when the component unmounts
    
  }, [registrationStatus, refreshCount, refreshData.refresh ]);

  return { userData, loading, error };
};

export default useFetchUserData;
