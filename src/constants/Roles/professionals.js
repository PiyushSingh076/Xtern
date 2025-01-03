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
  FaBookOpen,
  FaAppleAlt,
} from "react-icons/fa";

// 1) For XpertRole usage
export const professionalsConfig = [
  { id: 13, name: "Dietician", icon: <FaAppleAlt /> },
  { id: 12, name: "Phonics English", icon: <FaBookOpen /> },
  { id: 10, name: "Intern", icon: <FaUserGraduate /> },
  { id: 1, name: "Developer", icon: <FaLaptopCode /> },
  { id: 9, name: "Yoga", icon: <FaSpa /> },
  { id: 2, name: "Designer", icon: <FaBrush /> },
  { id: 3, name: "Cloud DevOps", icon: <FaCloud /> },
  { id: 4, name: "Content Creator", icon: <FaPen /> },
  { id: 5, name: "Digital Marketing", icon: <FaChartLine /> },
  { id: 6, name: "Lawyer", icon: <FaGavel /> },
  { id: 7, name: "HR", icon: <FaUserTie /> },
  { id: 8, name: "Financial Analyst", icon: <FaCalculator /> },
  { id: 11, name: "Astrologist", icon: <FaStar /> },
];

// 2) For FilterScreen usage
export const professionalsFilterConfig = [
  { id: 9, name: "Yoga", icon: <FaSpa /> },
  { id: 13, name: "Dietician", icon: <FaAppleAlt /> },
  { id: 1, name: "Developer", icon: <FaLaptopCode /> },
  { id: 10, name: "Intern", icon: <FaUserGraduate /> },
  { id: 12, name: "Phonics English", icon: <FaBookOpen /> },
  { id: 2, name: "Designer", icon: <FaBrush /> },
  { id: 3, name: "Cloud DevOps", icon: <FaCloud /> },
  // { id: 4, name: "Content Creator", icon: <FaPen /> },
  { id: 5, name: "Digital Marketing", icon: <FaChartLine /> },
  { id: 6, name: "Lawyer", icon: <FaGavel /> },
  // { id: 7, name: "HR", icon: <FaUserTie /> },
  // { id: 8, name: "Accountant", icon: <FaCalculator /> },
];
