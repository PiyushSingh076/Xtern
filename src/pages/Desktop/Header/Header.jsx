import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineUser, AiOutlineWallet, AiOutlineQuestionCircle, AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Header.css';
import { ROUTES } from '../../../constants/routes';
import useFetchUserData from '../../../hooks/Auth/useFetchUserData';
import useOAuthLogout from '../../../hooks/Auth/useOAuthLogout';

export default function Header() {
  const data = useSelector((state) => state.user);
  const isDetailEmpty = Object.keys(data.detail).length === 0;
  const { userData, loading } = useFetchUserData();
  const { handleLogout } = useOAuthLogout();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const profileButtonRef = useRef(null);
  const menuRef = useRef(null);

  

  const handleMenuToggle = () => {
    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left });
    }
    setMenuOpen(!menuOpen);
  };

  const handleMenuOptionClick = (route) => {
    navigate(route)
    
  };

  const handleNavigateProfile = () => {
    const toProfile = `profile/${userData?.uid}`
    const toEntrepreneur = `entrepreneur/${userData?.uid}`
    console.log(userData)
    setMenuOpen(false);
    if(userData?.type === "entrepreneur"){
      console.log("is entrepreneur")
      navigate(toEntrepreneur);
    }
    else if(userData.type == undefined || userData.type == "user"){
      navigate(toProfile);
    }
  }

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
          <button
            ref={profileButtonRef}
            className="profile-container"
            onClick={handleMenuToggle}
          >
            <img
              src={userData?.photo_url}
              width="30px"
              height="30px"
              className='size-[30px] object-cover'
              style={{ borderRadius: '50%', cursor: 'pointer' }}
              alt="Profile"
            />
            {userData?.firstName}
          </button>
        )}
      </div>

      {menuOpen && (
        <div
          className="dropdown-menu"
          ref={menuRef}
          style={{
            position: 'absolute',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
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
            onClick={() => handleNavigateProfile()}
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
            className="dropdown-item"
            onClick={() => navigate('/myvideocall')}
          >
            <AiOutlineQuestionCircle className="menu-icon" />
            My Schedule
          </div>
          <div
            className="dropdown-item logout"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            <AiOutlineLogout className="menu-icon" />
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}