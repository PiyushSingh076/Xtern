import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import Firebase auth

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to handle loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (isAuthenticated === null) {
    // Show loading spinner while checking authentication state
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" />; // Redirect to /signin if not authenticated
};

export default ProtectedRoute;
