// src/Components/Admin/Profile/Prefference/XpertRole.jsx

import React from "react";
import {
  FaLaptopCode,
  FaBrush,
  FaCloud,
  FaPen,
  FaChartLine,
  FaGavel,
  FaUserTie,
  FaCalculator,
  FaUserGraduate,
  FaSpa,
  FaStar,
} from "react-icons/fa";
import "./Prefference.css";
import { useDispatch } from "react-redux";
import { addXpertType } from "../../../Store/Slice/UserDetail";

export default function XpertRole({ next }) {
  const dispatch = useDispatch();

  const professionals = [
    { id: 9, name: "Yoga", icon: <FaSpa /> },
    { id: 1, name: "Developer", icon: <FaLaptopCode /> },
    { id: 2, name: "Designer", icon: <FaBrush /> },
    { id: 3, name: "Cloud DevOps", icon: <FaCloud /> },
    { id: 4, name: "Content Creator", icon: <FaPen /> },
    { id: 5, name: "Digital Marketing", icon: <FaChartLine /> },
    { id: 6, name: "Lawyer", icon: <FaGavel /> },
    { id: 7, name: "HR", icon: <FaUserTie /> },
    { id: 8, name: "Financial Analyst", icon: <FaCalculator /> },
    { id: 10, name: "Intern", icon: <FaUserGraduate /> },
    { id: 11, name: "Astrologist", icon: <FaStar /> },
  ];

  const setXpertType = (type) => {
    dispatch(addXpertType(type));
    next();
  };

  return (
    <div className="xpert-role-selection-container">
      <h2>Choose Your Type</h2>
      <div className="xpert-role-selection">
        {professionals.map((prof) => (
          <div
            onClick={() => setXpertType(prof.name)}
            key={prof.id}
            className="xpert-role-selection-card"
          >
            <div className="xpert-icon-select">{prof.icon}</div>
            <span>{prof.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
