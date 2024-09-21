import React from "react";
import { Link } from "react-router-dom";
import useUserRole from "../hooks/Auth/useUserRole";

// LanguageOption Component: Reusable for each role selection
const LanguageOption = ({ id, label, checked, onChange }) => (
  <div
    className={`form-check select-goal mt-12 ${checked ? "language-sel" : ""}`}
  >
    <input
      className="form-check-input custom-input-goal"
      name="language"
      type="radio"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label custom-lable-goal" htmlFor={id}>
      {label}
    </label>
  </div>
);

const PrimaryGoalScreen = () => {
  const { selectedRole, handleRoleChange, saveRole } = useUserRole(); // Use the hook

  const roleOptions = [
    { value: "Entrepreneur", label: "I Am an Entrepreneur" },
    { value: "Seeker", label: "I Am a Seeker" },
  ];

  return (
    <>
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn">
              <Link to="/preferredlanguage">
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
              <Link to="/spend-learning">Skip</Link>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      <section id="primary_goal">
        <div className="container">
          <div className="primary_goal-wrap mt-32">
            <div className="goal-title">
              <p>What is your Role in Xtern</p>
            </div>

            <form className="primary-form mt-32">
              {roleOptions.map((option) => (
                <LanguageOption
                  key={option.value}
                  id={option.value}
                  label={option.label}
                  checked={selectedRole === option.value}
                  onChange={handleRoleChange}
                />
              ))}
            </form>

            <div className="next-btn-goal mt-32">
              <button onClick={saveRole}>Next</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrimaryGoalScreen;
