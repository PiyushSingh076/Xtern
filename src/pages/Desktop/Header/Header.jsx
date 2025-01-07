import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineUser,
  AiOutlineWallet,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Header.css";
import { ROUTES } from "../../../constants/routes";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useOAuthLogout from "../../../hooks/Auth/useOAuthLogout";

export default function Header() {
  const data = useSelector((state) => state.user);
  const isDetailEmpty = Object.keys(data.detail).length === 0;
  const { userData } = useFetchUserData();
  const { handleLogout } = useOAuthLogout();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const profileButtonRef = useRef(null);
  const menuRef = useRef(null);


  // Decide if we have a valid userPhoto
  const hasUserPhoto =
    userData?.photo_url &&
    typeof userData.photo_url === "string" &&
    userData.photo_url.trim() !== "";



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


  const handleMenuToggle = (event) => {
    event.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both menu AND profile button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-bar-container">
      <div className="logo-search-container">
        <span onClick={() => navigate(ROUTES.HOME_SCREEN)} className="logo">
          <span style={{ color: "#0d6efd", fontSize: "34px" }}>X</span>pert
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

        {userData && (

          <div className="profile-menu-container">
            <button
              ref={profileButtonRef}
              className="profile-container"
              onClick={handleMenuToggle}
            >
              {hasUserPhoto ? (
                <img
                  src={userData.photo_url}
                  width="30px"
                  height="30px"
                  className="border"
                  style={{ borderRadius: "50%", cursor: "pointer" }}
                  alt={userData?.firstName || "User"}
                />
              ) : (
                <AiOutlineUser
                  style={{ fontSize: "1.5rem", marginRight: "5px" }}
                />
              )}
              <span className="profile-name">{userData?.firstName}</span>
            </button>

            {menuOpen && (
              <div className="dropdown-menu" ref={menuRef}>
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuOptionClick(`profile/${userData?.uid}`)}
                >
                  <AiOutlineUser className="menu-icon" />
                  Profile
                </div>
                {/* <div
                  className="dropdown-item"
                  onClick={() => handleMenuOptionClick("/wallet")}
                >
                  <AiOutlineWallet className="menu-icon" />
                  Wallet
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuOptionClick("/support")}
                >
                  <AiOutlineQuestionCircle className="menu-icon" />
                  Support
                </div> */}
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/myvideocall")}
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
        )}
      </div>

    </div>
  );
}