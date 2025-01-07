import React from "react";
import "./MobHomeScreen.css";
import rectangle from "../../assets/images/homescreen/Rectangle-3586-min.png";
import mask from "../../assets/images/homescreen/Mask-group-1-min-1.png";
import { useNavigate } from "react-router-dom";

export default function Xtern() {
  const navigate = useNavigate();

  const quality = [
    {
      id: 1,
      name: "Top Universities",
      description:
        "Interns from top universities are trained with real world projects to deliver the best of tech.",
    },
    {
      id: 2,
      name: "Best Coders",
      description:
        "Rimberio specializes in resilient strategies, tackling difficulties with tenacity and flexiblity. ",
    },
    {
      id: 3,
      name: "AI Assessments",
      description:
        "Xterns are thoroughly assessed and ranked based on AI backed assessments.",
    },
    {
      id: 4,
      name: "Real World Projects",
      description:
        "Xterns have extensive experience working on real-world projects and a history of notable achievements in tech.",
    },
  ];

  return (
    <div className="mob-xtern-container">
      <h1 className="Xpert-text">Xperts</h1>
      <span>Hire Industry Expert Consultants</span>
      <div className="mob-xpert-quality-card-container">
        {quality.map((item) => (
          <div key={item.id} className="xpert-quality-card">
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mob-Xtren-img-section">
        <div className="mob-img-vector">
          <img className="xtern-vector" src={rectangle} />
          <img className="xtern-img" src={mask} />
        </div>
        {/* <button
          className="hire-xtern-btn"
          onClick={() => navigate("/signup")}
          
        >
          <h4 className="hire-xpert-title">Become Xpert</h4>
          <span className="hire-xpert-subtitle">Industry Expert Consultants</span>
        </button> */}
      </div>
    </div>
  );
}
