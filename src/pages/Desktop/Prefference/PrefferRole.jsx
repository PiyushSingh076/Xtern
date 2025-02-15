import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRole } from "../../../Store/Slice/UserInfo"; // Import action to change role
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes"; // Your routes
import "./Prefference.css"; // Import your styles
import Intern from "../../../assets/images/DesktopImage/intern.png";
import Employer from "../../../assets/images/DesktopImage/employee.png";
import Mentor from "../../../assets/images/DesktopImage/mentor.png";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

export default function PrefferedRole() {
  const [role, setRoleState] = useState(""); // Local state for role
  const selectedRole = useSelector((state) => state.role.selectedRole); // Access role from Redux store
  const dispatch = useDispatch(); // Dispatch actions to Redux
  const navigate = useNavigate(); // Hook to navigate between routes
  const { userData, loading, error } = useFetchUserData();
  // Handle role change and dispatch action
  const handleRoleChange = (selectedRole) => {
    setRoleState(selectedRole); // Update local state
    dispatch(setRole(selectedRole)); // Dispatch the selected role to Redux

    if (selectedRole === "intern") {
      navigate(ROUTES.INTERN); // Navigate to goal screen if "intern" is selected
    } else if (selectedRole === "venture") {
      navigate(ROUTES.VENTURE); // Navigate to venture dashboard
    }
  };

  return (
    <div className="des-preffered-role-container">
      <span className="des-hey-txt">
        Welcome{" "}
        <span style={{ color: "#3374AE" }}>
          {userData?.display_name || "User"}
        </span>
      </span>

      <div className="des-select-lang-sec">
        <span className="des-select-lang">
          Let's Get You Started, fill in a little about yourself
        </span>
        <div className="des-role-sec">
          {/* Intern Role Selection */}
          <div
            onClick={() => handleRoleChange("intern")}
            className="des-intern-container"
          >
            <img src={Intern} alt="Intern" className="des-role-image" />
            <span>I am an Intern</span>
            <p>
              You are a student or recent graduate who works for a period of
              time to gain job experience.
            </p>
          </div>

          {/* Venture Role Selection */}
          <div
            onClick={() => handleRoleChange("venture")}
            className="des-venture-container"
          >
            <img src={Employer} alt="Employer" className="des-role-image" />
            <span>I am an Employer</span>
            <p>
              You organize, manage, and assume the risk of a business or
              enterprise.
            </p>
          </div>

          {/* Mentor Role Selection */}
          <div
            onClick={() => handleRoleChange("mentor")}
            className="des-venture-container"
          >
            <img src={Mentor} alt="Mentor" className="des-role-image" />
            <span>I am a Mentor</span>
            <p>
              You are an experienced professional who guides and supports
              interns or less experienced individuals in their career
              development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
