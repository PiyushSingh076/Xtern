import React from "react";
import "./MobHomeScreen.css";
import men from "../../assets/images/xtern-images/men-01.png";
import { useNavigate } from "react-router-dom";

export default function Xpert() {
  const navigate = useNavigate();

  const quality = [
    {
      id: 1,
      name: "Tech Lead",
      description:
        "Senior Tech Lead who can delivery modeules with a team of TalentedInterns, roughly 6-10 yrs of workexperince.",
    },
    {
      id: 2,
      name: "Handled Scale",
      description:
        "Rimberio specializes in resilient strategies, tackling difficulties with tenacity and flexiblity. ",
    },
    {
      id: 3,
      name: "Ownership",
      description:
        "An Xpert would ensure end to end dilevery & own up quality & timely release.",
    },
    {
      id: 4,
      name: "Fractional Cost",
      description:
        "To Further optimise cost an Xpert, Platform may be at max provided project to Xpert, Ensuring alldeliverabls are met successfully.",
    },
  ];

  return (
    <div className="mob-xpert-container">
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

      <div className="mob-Xpert-img-section">
        <img className="mob-xpert-img" src={men} />
        <button
          className="hire-xperts-btn"
          onClick={() => navigate("/filterscreen/Intern")}
        >
          <h4 className="hire-xpert-title">Hire Xpert</h4>
          <span className="hire-xpert-subtitle">
            Industry Expert Consultants
          </span>
        </button>
      </div>
    </div>
  );
}
