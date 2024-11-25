import React from 'react'
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
import './Prefference.css'

export default function XpertRole() {

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

  return (
    <div className='xpert-role-selection-container'>
        <h2>Choose Your Type</h2>  
        <div className='xpert-role-selection'>
            {
                professionals.map((prof, index) => (
                    <div key={index} className='xpert-role-selection-card'>
                         <div className="xpert-icon-select">{prof.icon}</div>
                        <span>{prof.name}</span>
                    </div>
                ))
            }
        </div>
    </div>
  )
}
