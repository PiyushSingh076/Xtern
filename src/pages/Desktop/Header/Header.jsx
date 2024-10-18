import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import './Header.css';
import { Route, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

export default function Header() {

  const { userData, loading, error } = useFetchUserData();

  const navigate = useNavigate()
  const [optionActive, setOptionActive] = useState('');

  const handleOptionClick = (index) => {
    setOptionActive(index);
    
  };

  return (
    <div className='nav-bar-container'>
      <div className='logo-search-container'>
        <span 
        onClick={()=>navigate(ROUTES.HOME_SCREEN)}
        className='logo'>Xtern</span>
         <div className='input-search-wrap-container'>
          <input className='search-input' type='text' placeholder='Search jobs' />
          <AiOutlineSearch className="search-icon" />
        </div> 
      </div>

      <div className="internships-jobs-option-container">
        <ul className="options-list">
          <li 
            className={`option-item ${optionActive === 'Learn' ? 'active' : ''}`} 
            onClick={() => handleOptionClick('Learn')}
          >
            Learn
          </li>
          <li 
            className={`option-item ${optionActive === 'Internship' ? 'active' : ''}`} 
            onClick={() => handleOptionClick('Internship')}
          >
            Internships
          </li>
          <li 
            className={`option-item ${optionActive === 'Jobs' ? 'active' : ''}`} 
            onClick={() => handleOptionClick('Jobs')}
          >
            Jobs
          </li>
          <li 
            className={`option-item ${optionActive === 'Mentorship' ? 'active' : ''}`} 
            onClick={() => handleOptionClick('Mentorship')}
          >
            Mentorship
          </li>
      {  !userData &&  (<li className="option-item-button">
            <button onClick={()=>navigate(ROUTES.SIGN_IN)} className="option-button-login">Login</button>
          </li>)}
          <li className="option-item-button">
            <button className="option-button-host">
              <AiOutlinePlus className="add-icon" />
              Host
            </button>
          </li>
        
        </ul>

        {userData && (
            <div
            onClick={()=>navigate(ROUTES.PROFILE)}
            >
            <img
             className='profile-icon'
                  src={userData?.profilePicture }
                  alt={userData?.display_name || "profile image"}
                />
            </div>
          )

          }
      </div>
    </div>
  );
}
