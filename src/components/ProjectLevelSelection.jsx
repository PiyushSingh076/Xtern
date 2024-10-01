import React from "react";
import { FaTasks, FaUserGraduate, FaChartLine, FaRocket } from "react-icons/fa"; // Importing necessary icons

const ProjectLevelSelection = ({ projectLevel, setProjectLevel }) => {
  const levels = [
    { name: "Beginner", icon: <FaUserGraduate /> },
    { name: "Medium", icon: <FaChartLine /> },
    { name: "Advanced", icon: <FaRocket /> },
  ];

  return (
    <div className="mt-2 mb-2">
      {/* Label on top */}
      <label className="form-label">Choose Level</label>

      {/* Badge Level Selection */}
      <div className="d-flex gap-2 align-items-center">
        {levels.map((level) => (
          <span
            key={level.name}
            className={`badge level-badge gap-1 d-flex align-items-center ${
              projectLevel === level.name ? "badge-active" : "text-dark"
            } p-2`}
            style={{ cursor: "pointer" }}
            onClick={() => setProjectLevel(level.name)}
          >
            {level.icon} {/* Icon for the level */}
            <span className="ml-2">{level.name}</span> {/* Level Name */}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectLevelSelection;
