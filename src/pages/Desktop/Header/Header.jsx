import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useOAuthLogout from "../../../hooks/Auth/useOAuthLogout";
import { useSelector } from 'react-redux';
import { AiOutlineUser, AiOutlineWallet, AiOutlineQuestionCircle, AiOutlineLogout } from 'react-icons/ai';

export default function Header() {
  const data = useSelector((state) => state.user);
  const isDetailEmpty = Object.keys(data.detail).length === 0;


  console.log(data)




  const { userData, loading } = useFetchUserData();

  console.log(userData)

  const { handleLogout } = useOAuthLogout(); 
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Menu toggle state

  const handleMenuToggle = () => {
    console.log('clciker')
    setMenuOpen((prev) => !prev);
    console.log(menuOpen)
  };

  const handleMenuOptionClick = (route) => {
    setMenuOpen(false); // Close menu on option click
    navigate(route);
  };

  return (
    <div className="nav-bar-container">
      <div className="logo-search-container">
        <span 
          onClick={() => navigate(ROUTES.HOME_SCREEN)} 
          className="logo"
        >
          <span style={{ color: '#0d6efd', fontSize: '34px' }}>X</span>pert
        </span>
      </div>

      <div className="hire-btns">
        {!userData && (
          <button 
            onClick={() => navigate(ROUTES.SIGN_IN)} 
            className="hire-xpert-btn"
          >
            Log in
          </button>
        )}
        { userData && (
          <div className="profile-container" onClick={handleMenuToggle}>
            <img
              src={data.detail.profileImage || userData?.profileImage}
              width="30px"
              style={{ borderRadius: '50%', cursor: 'pointer' }}
              
            />
           {userData?.firstName}
          </div>
        )}
   
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div 
        className='dropdown-menu'
        style={{
          position: 'absolute',
          top: '90px',
          right: '5px',
          backgroundColor: '#fff',
          width: '200px',
          height: 'auto',
          border: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'

        }}
        >
       <div 
            className="dropdown-item" 
            onClick={() => handleMenuOptionClick(`profile/${userData?.uid}`)}
          >
            <AiOutlineUser className="menu-icon" />
            Profile
          </div>
          <div 
            className="dropdown-item" 
            onClick={() => handleMenuOptionClick('/wallet')}
          >
            <AiOutlineWallet className="menu-icon" />
            Wallet
          </div>
          <div 
            className="dropdown-item" 
            onClick={() => handleMenuOptionClick('/support')}
          >
            <AiOutlineQuestionCircle className="menu-icon" />
            Support
          </div>
          <div 
            className="dropdown-item logout" 
            onClick={()=>{ handleLogout(); setMenuOpen(false) }}
          >
            <AiOutlineLogout className="menu-icon" />
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}