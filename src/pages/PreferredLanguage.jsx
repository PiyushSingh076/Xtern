import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Import Firestore and Auth config
import { onAuthStateChanged } from "firebase/auth"; // Import the auth state change listener
import toast from "react-hot-toast";

// Modular component for a single language option
const LanguageOption = ({ value, checked, onChange, label }) => (
  <div className="lang-sec">
    <input
      type="radio"
      id={`select-lang-${value}`}
      name="select-language"
      value={value}
      checked={checked === value}
      onChange={onChange}
      aria-label={`Select ${label}`}
    />
    <label className="custom-radio-sel-lang" htmlFor={`select-lang-${value}`}>
      {label}
    </label>
  </div>
);

const PreferredLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [userId, setUserId] = useState(null); // State to store user ID
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        console.log(user);
        setUserId(user.uid); // Store the user ID
        setUserName(user.displayName || user?.email || "User"); // Default to "User" if displayName is not available
      } else {
        setUserName(""); // Clear the name if the user is not logged in
        setUserId(null); // Clear the user ID
        navigate("/signin"); // Redirect to sign-in if not authenticated
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const savePreferredLanguage = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      const userRef = doc(db, "users", user.uid);

      // Check if the user exists in Firestore before updating
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error("User does not exist in Firestore.");
      }

      // Update the user's preferred language in Firestore
      await updateDoc(userRef, {
        preferredLanguage: selectedLanguage,
      });

      toast.success("Language preference saved!");
      navigate("/primarygoalscreen"); // Redirect to Primary Goal Screen
    } catch (error) {
      console.error("Error saving preferred language:", error.message);
      toast.error("Failed to save language preference: " + error.message);
    }
  };

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Spanish", label: "Spanish" },
    { value: "Arabic", label: "Arabic" },
    { value: "Bulgarian", label: "Bulgarian" },
    { value: "French", label: "French" },
    { value: "Russian", label: "Russian" },
  ];

  return (
    <>
      {/* Header with Skip button */}
      <header id="top-header">
        <div className="container">
          <div className="skip-section">
            <div className="skip-btn">
              <Link to="/primarygoalscreen">Skip</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Preferred Language Selection Section */}
      <section id="select-language-page">
        <div className="container">
          <h1 className="hey-txt">Hey, {userName}</h1>{" "}
          {/* Display the user's name dynamically */}
          <p className="select-lang">
            Please select your preferred language to facilitate communication.
          </p>
          <form className="select-lang-sec mt-32">
            {languageOptions.map((option) => (
              <LanguageOption
                key={option.value}
                value={option.value}
                checked={selectedLanguage}
                onChange={handleLanguageChange}
                label={option.label}
              />
            ))}
          </form>
          <div className="next-btn mt-32">
            <button
              onClick={savePreferredLanguage}
              aria-label="Save selected language"
            >
              Select
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PreferredLanguage;
