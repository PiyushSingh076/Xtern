import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserRole from "../hooks/Auth/useUserRole";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import useFetchUserData from "../hooks/Auth/useFetchUserData";

// RoleOption Component: Reusable for each role selection
const RoleOption = ({ id, label, checked, onChange }) => (
  <div
    className={`form-check select-goal mt-12 ${checked ? "language-sel" : ""}`}
  >
    <input
      className="form-check-input custom-input-goal"
      name="role"
      type="radio"
      id={id}
      checked={checked}
      onChange={onChange}
      aria-labelledby={`${id}-label`}
    />
    <label
      className="form-check-label custom-label-goal"
      htmlFor={id}
      id={`${id}-label`}
    >
      {label}
    </label>
  </div>
);

const PrimaryGoalScreen = () => {
  const { selectedRole, handleRoleChange, saveRole } = useUserRole(); // Use the hook
  const [userName, setUserName] = useState(""); // State to store the user's name
  const navigate = useNavigate();
  const { userData } = useFetchUserData();
  console.log("user Data : ", userData);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if displayName is available, otherwise fallback to email or "User"
        const name = user.displayName || user.email || "User";
        setUserName(name); // Update the state with the name
      } else {
        setUserName(""); // Clear the name if the user is not logged in
        navigate("/signin"); // Redirect to sign-in if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [navigate]);

  const roleOptions = [
    { value: "Entrepreneur", label: "I Am Part of a Venture" },
    { value: "Intern", label: "I Am an Intern" },
  ];

  return (
    <>
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn">
              <Link
                onClick={() => navigate(-1)}
                aria-label="Back to Preferred Language Selection"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_330_7385"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="white"></rect>
                  </mask>
                  <g mask="url(#mask0_330_7385)">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              </Link>
            </div>
            <div className="top-navbar-title">
              <p>Select Role</p>
            </div>
            <div className="skip-btn-goal">
              {/* <Link to="/spend-learning">Skip</Link> */}
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      <section id="primary_goal">
        <div className="container">
          <div className="primary_goal-wrap mt-32">
            {/* <div className="goal-title mt-32">
              <p>Select Your Role in Xtern</p>
            </div> */}

            <form className="primary-form mt-32">
              <fieldset>
                <legend className="sr-only">
                  Hey <b>{userName} </b> , Select your role in Xtern
                </legend>
                {roleOptions.map((option) => (
                  <RoleOption
                    key={option.value}
                    id={option.value}
                    label={option.label}
                    checked={selectedRole === option.value}
                    onChange={handleRoleChange}
                  />
                ))}
              </fieldset>
            </form>

            <div className="next-btn-goal mt-32">
              <button type="button" onClick={saveRole}>
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrimaryGoalScreen;
