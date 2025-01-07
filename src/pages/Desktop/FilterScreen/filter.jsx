// src/Components/Filter/FilterScreen.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Import from the config
import { professionalsFilterConfig } from "../../../constants/Roles/professionals";

import CardList from "../Card/CarList";
import "./filter.css";

const FilterScreen = () => {
  const navigate = useNavigate();
  const type = useParams();
  const [selectedProfession, setSelectedProfession] = useState(null);

  useEffect(() => {
    if (type?.type) {
      setSelectedProfession(type.type);
    }
  }, [type]);

  const handleClick = (name) => {
    navigate(`/filterscreen/${name}`);
  };

  return (
    <div className="filter-container">
      <div className="profession-cards">
        {professionalsFilterConfig.map((profession) => (
          <div
            key={profession.id}
            className={`card ${
              selectedProfession === profession.name ? "selected" : ""
            }`}
            onClick={() => handleClick(profession.name)}
          >
            <div
              className={`${
                selectedProfession === profession.name
                  ? "text-white"
                  : "text-primary"
              }`}
              style={{
                fontSize:
                  selectedProfession === profession.name ? "2rem" : "1.5rem", // Adjust sizes as needed
                transition: "font-size 0.3s ease", // Smooth size transition
              }}
            >
              {profession.icon}
            </div>

            <h3>{profession.name}</h3>
          </div>
        ))}
      </div>
      <CardList profession={selectedProfession} />
    </div>
  );
};

export default FilterScreen;
