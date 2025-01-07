import React, { useEffect, useState } from "react";
import CardList from "../Card/CardList";

import {
  FaLaptopCode,
  FaBrush,
  FaCloud,
  FaPen,
  FaChartLine,
  FaGavel,
  FaUserTie,
  FaCalculator,
  FaSpa,
  FaUserGraduate,
} from "react-icons/fa";
import "./filter.css";

import { useParams, useNavigate } from "react-router-dom";

const professionals = [
  { id: 1, name: "Developer", icon: <FaLaptopCode /> },
  { id: 2, name: "Designer", icon: <FaBrush /> },
  { id: 3, name: "Cloud DevOps", icon: <FaCloud /> },
  { id: 4, name: "Content Creator", icon: <FaPen /> },
  { id: 5, name: "Digital Marketing", icon: <FaChartLine /> },
  { id: 6, name: "Lawyer", icon: <FaGavel /> },
  { id: 7, name: "HR", icon: <FaUserTie /> },
  { id: 8, name: "Accountant", icon: <FaCalculator /> },
  { id: 9, name: "Yoga", icon: <FaSpa /> },
  { id: 10, name: "Intern", icon: <FaUserGraduate /> },
];

const FilterScreen = () => {
  const navigate = useNavigate();
  const type = useParams();

  useEffect(() => {
    if (type) {
      setSelectedProfession(type.type);
    }
  });

  const [selectedProfession, setSelectedProfession] = useState(null);

  const handleClick = (name) => {
    navigate(`/filterscreen/${name}`);
  };

  return (
    <div className="filter-container">
      <div className="profession-cards">
        {professionals.map((profession) => (
          <div
            key={profession.id}
            className={`card ${
              selectedProfession === profession.name ? "selected" : ""
            }`}
            onClick={() => handleClick(profession.name)}
          >
            <div className="icon">{profession.icon}</div>
            <h3>{profession.name}</h3>
          </div>
        ))}
      </div>
      <CardList profession={selectedProfession} />
    </div>
  );
};

export default FilterScreen;
