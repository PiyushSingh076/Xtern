import React, { useState, useEffect, useRef } from 'react';
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

  console.log(data);

  const { userData, loading } = useFetchUserData();
  console.log(userData);

  const { handleLogout } = useOAuthLogout();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Menu toggle state
  const menuRef = useRef(null); // Reference for the dropdown menu

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuOptionClick = (route) => {
    setMenuOpen(false); // Close menu on option click
    navigate(route);
  };

  // Close menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-bar-container">
      <div className="logo-search-container">
        <span onClick={() => navigate(ROUTES.HOME_SCREEN)} className="logo">
          <span style={{ color: '#0d6efd', fontSize: '34px' }}>X</span>pert
        </span>
      </div>

      <div className="hire-btns">
        {!userData && (
          <button onClick={() => navigate(ROUTES.SIGN_IN)} className="hire-xpert-btn">
            Log in
          </button>
        )}
        {userData && (
          <button className="profile-container" onClick={handleMenuToggle}>
            <img
              src={userData?.photo_url}
              width="30px"
              style={{ borderRadius: '50%', cursor: 'pointer' }}
            />
            {userData?.firstName}
          </button>
        )}
        <div className="header-wallet-container">
          <AiOutlineWallet className="wallet-icon" />
          <span className="wallet-balance">₹0</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div 
          className="dropdown-menu"
          ref={menuRef} // Attach ref to the dropdown
          style={{
            position: 'absolute',
            top: '90px',
            right: '40px',
            backgroundColor: '#fff',
            width: '200px',
            height: 'auto',
            border: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
            onClick={() => { handleLogout(); setMenuOpen(false); }}
          >
            <AiOutlineLogout className="menu-icon" />
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}