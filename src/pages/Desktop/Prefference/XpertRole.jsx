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
     FaUserGraduate,
  } from "react-icons/fa";
import './Prefference.css'
import { useDispatch } from 'react-redux';
import { addXpertType } from '../../../Store/Slice/UserDetail';
import { useNavigate } from 'react-router-dom';

export default function XpertRole() {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const professionals = [
        { id: 1, name: "Developer", icon: <FaLaptopCode /> },
        { id: 2, name: "Designer", icon: <FaBrush /> },
        { id: 3, name: "Cloud DevOps", icon: <FaCloud /> },
        { id: 4, name: "Content Creator", icon: <FaPen /> },
        { id: 5, name: "Digital Marketing", icon: <FaChartLine /> },
        { id: 6, name: "Lawyer", icon: <FaGavel /> },
        { id: 7, name: "HR", icon: <FaUserTie /> },
        { id: 8, name: "Accountant", icon: <FaCalculator /> },
        { id: 9, name: "Intern", icon: <FaUserGraduate/> },

      ];


      const setXpertType = (type) =>{
            dispatch(addXpertType(type))
            navigate('/userdetail')
            
      }

  return (
    <div className='xpert-role-selection-container'>
        <h2>Choose Your Type</h2>  
        <div className='xpert-role-selection'>
            {
                professionals.map((prof, index) => (
                    <div
                    onClick={()=>{setXpertType(prof.name)}}
                     key={index} className='xpert-role-selection-card'>
                         <div className="xpert-icon-select">{prof.icon}</div>
                        <span>{prof.name}</span>
                    </div>
                ))
            }
        </div>
    </div>
  )
}
