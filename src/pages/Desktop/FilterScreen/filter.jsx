import React, { useState } from "react";
import {
  FaLaptopCode,
  FaBrush,
  FaCloud,
  FaPen,
  FaChartLine,
  FaGavel,
  FaUserTie,
  FaCalculator,
} from "react-icons/fa";
import "./filter.css";

const professionals = [
  { id: 1, name: "Developer", icon: <FaLaptopCode /> },
  { id: 2, name: "Designer", icon: <FaBrush /> },
  { id: 3, name: "Cloud DevOps", icon: <FaCloud /> },
  { id: 4, name: "Content Creator", icon: <FaPen /> },
  { id: 5, name: "Digital Marketing", icon: <FaChartLine /> },
  { id: 6, name: "Lawyer", icon: <FaGavel /> },
  { id: 7, name: "HR", icon: <FaUserTie /> },
  { id: 8, name: "Accountant", icon: <FaCalculator /> },
];

const FilterScreen = () => {
  const [selectedProfession, setSelectedProfession] = useState("All");

  const filteredProfessionals =
    selectedProfession === "All"
      ? professionals
      : professionals.filter((prof) => prof.name === selectedProfession);

  return (
    <div className="filter-container">
      <div className="filter-dropdown">
        <label htmlFor="profession-filter">Filter By Profession: </label>
        <select
          id="profession-filter"
          value={selectedProfession}
          onChange={(e) => setSelectedProfession(e.target.value)}
        >
          <option value="All">All</option>
          {professionals.map((prof) => (
            <option key={prof.id} value={prof.name}>
              {prof.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card-container">
        {filteredProfessionals.map((prof) => (
          <div className="card" key={prof.id}>
            <div className="icon">{prof.icon}</div>
            <div className="name">{prof.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterScreen;
