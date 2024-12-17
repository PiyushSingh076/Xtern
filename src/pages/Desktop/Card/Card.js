import React from "react";
// <<<<<<< pratham
// import "./Card.css"; // Assuming this CSS file exists and has appropriate styles
// import { useNavigate } from "react-router-dom";

// const Card = ({
//   photo_url,
//   display_name,
//   city,
//   state,
//   role,
//   skillSet,
//   experience,
//   education,
//   workexp,
//   assignments,
//   firstName,
//   uid,
// }) => {
//   const navigate = useNavigate();
//   const handleChatClick = () => {
//     navigate(
//       `/chat?firstName=${encodeURIComponent(
//         firstName
//       )}&uid=${encodeURIComponent(uid)}`
//     );
//   };

//   return (
//     <div className="card">
//       <div className="card-header">
//         <div
//           className="blurred-dp"
//           style={{
//             backgroundImage: `url(${photo_url})`,
//           }}
//         ></div>
//         {/* Set the background image */}
//         <h3>{display_name}</h3>
//       </div>
//       <div className="card-details">
//         <p>
//           <strong>Primary Role:</strong> {role}
//         </p>
//         {/* Aligning primary role */}
//         <p>
//           <strong>Skill Set: </strong>
//           {skillSet?.length > 0
//             ? skillSet.map((skill, index) => (
//                 <span key={index}>
//                   {typeof skill === "string"
//                     ? skill
//                     : `${skill.skill} (${skill.skillRating})`}{" "}
//                   {index < skillSet.length - 1 && ", "}
//                 </span>
//               ))
//             : "No skills available"}
//         </p>
//         <p>
//           <strong>Location:</strong> {city}, {state}
//         </p>
//         {/* Aligning location */}
//         <p>
//           <strong>Experience:</strong> {experience} years
//         </p>
//         {/* Aligning experience */}
//         <p>
//           <strong>Education:</strong> {education}
//         </p>
//         {/* Aligning education */}
//         <p>
//           <strong>Work Experience:</strong> {workexp}
//         </p>
//         {/* Aligning work experience */}
//         <p>
//           <strong>Assignments:</strong> {assignments}
//         </p>
//         {/* Aligning assignments */}
//       </div>
//       <div className="card-footer">
//         <button>Call</button>
//         <button onClick={handleChatClick}>Chat</button>
//         <button>Details</button>
// =======
import "./Card.css"; // Import related styles
import { useNavigate } from "react-router-dom";

const Card = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="card">

      <img src={data.photo_url} alt={data.name}  width={'100px'} style={{borderRadius: '50%', border: '1px solid #ccc'}}/>
      <span className="filter-card-name">{data.firstName} {data.lastName}</span>
      <span>Year of experience : {data.experience}</span>
      <span>
        <span style={{color: '#009DED'}}>&#8377;{data.consultingPrice}/min</span>
      </span>
    
      <div className="card-footer">
        <button onClick={() => alert(`Calling ${data.phone_number}`)}>Call</button>
        <button onClick={() => alert(`Chat with ${data.firstName}`)}>Chat</button>
        <button onClick={() => navigate(`/profile/${data.uid}`)}>Details</button>
      </div>
    </div>
  );
};

export default Card;