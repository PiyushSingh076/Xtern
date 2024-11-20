import React from "react";
import "./Card.css"; // Assuming this CSS file exists and has appropriate styles

const Card = ({
  fullname,
  city,
  state,
  primary,
  secondary,
  yearsOfExperience,
  education,
  workexp,
  assignments,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <div
          className="blurred-dp"
          style={{
            backgroundImage: `url("https://img.freepik.com/premium-photo/professional-photo-linkedin-profile-picture-beautiful-looking-woman-light-color_1078199-10524.jpg")`,
          }}
        ></div>
        {/* Set the background image */}
        <h3>{fullname}</h3>
      </div>
      <div className="card-details">
        <p>
          <strong>Primary Role:</strong> {primary}
        </p>
        {/* Aligning primary role */}
        <p>
          <strong>Secondary Role:</strong> {secondary}
        </p>
        {/* Aligning secondary role */}
        <p>
          <strong>Location:</strong> {city}, {state}
        </p>
        {/* Aligning location */}
        <p>
          <strong>Experience:</strong> {yearsOfExperience} years
        </p>
        {/* Aligning experience */}
        <p>
          <strong>Education:</strong> {education}
        </p>
        {/* Aligning education */}
        <p>
          <strong>Work Experience:</strong> {workexp}
        </p>
        {/* Aligning work experience */}
        <p>
          <strong>Assignments:</strong> {assignments}
        </p>
        {/* Aligning assignments */}
      </div>
      <div className="card-footer">
        <button>Call</button>
        <button>Chat</button>
        <button>Details</button>
      </div>
    </div>
  );
};

export default Card;
