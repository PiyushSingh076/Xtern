import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasError, setHasError] = useState(false);

  const checkAuthState = useCallback(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setIsAuthenticated(!!user); // Set true if user exists, false otherwise
      },
      (error) => {
        console.error("Error in auth state change: ", error);
        setHasError(true); // Handle potential Firebase errors
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = checkAuthState();

    // Fallback timeout in case the auth check hangs
    const timeoutId = setTimeout(() => {
      if (isAuthenticated === null) setHasError(true); // Mark as error if no response within 10 seconds
    }, 10000); // Adjust as per your need

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [checkAuthState, isAuthenticated]);

  if (hasError) {
    return <Navigate to="/error" />; // Redirect to an error page in case of issues
  }

  if (isAuthenticated === null) {
    return <Loading />; // Show loading spinner while checking authentication state
  }

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
