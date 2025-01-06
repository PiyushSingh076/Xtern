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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
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
    setMenuOpen(false);
    navigate(route);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
        {/* If no user, show Log in button */}
        {!userData && (
          <button
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="hire-xpert-btn"
          >
            Log in
          </button>
        )}

        {/* If user is logged in, show avatar or icon + name */}
        {userData && (
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
            {userData?.firstName}
          </button>
        )}
      </div>

      {menuOpen && (
        <div
          className="dropdown-menu"
          ref={menuRef}
          style={{
            position: "absolute",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            backgroundColor: "#fff",
            width: "200px",
            height: "auto",
            border: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
          </div>
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
  );
}
