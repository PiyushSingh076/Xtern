import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineUser,
  AiOutlineWallet,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineCalendar,
  AiOutlineMessage,
  AiOutlineBell,
} from "react-icons/ai";
import { FaBriefcase, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Header.css";
import { ROUTES } from "../../../constants/routes";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useOAuthLogout from "../../../hooks/Auth/useOAuthLogout";
import { ENTREPRENEUR_ROLE } from "../../../constants/Roles/professionals";
import { Skeleton } from "@mui/material";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function Header() {
  const data = useSelector((state) => state.user);
  const { userData, loading } = useFetchUserData();
  const { handleLogout } = useOAuthLogout();
  const navigate = useNavigate();
  const { notifications, acceptInvite, declineInvite } = useNotifications(userData?.uid);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const profileButtonRef = useRef(null);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState([]);  // State to store fetched invites
  const { refreshUser, refresh } = useAuth();

  // Fetch invites when user data is available
  useEffect(() => {
    if (userData?.uid) {
      fetchInvites(userData.uid);
    }
  }, [userData?.uid]);

  async function fetchInvites(uid) {
    if (!uid) return;
    const q = query(collection(db, "notifications"), where("uid", "==", uid), where("type", "==", "INVITE"));
    const invitesSnapshot = await getDocs(q);
    const inviteData = invitesSnapshot.docs.map((doc) => doc.data());
    setInvites(inviteData); // Set invites state with the fetched data
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        profileButtonRef.current && !profileButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
      if (
        notificationRef.current && !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hasUserPhoto =
    userData?.photo_url &&
    typeof userData.photo_url === "string" &&
    userData.photo_url.trim() !== "";

  const handleMenuProfileClick = () => {
    setMenuOpen(false);
    if (userData.type === ENTREPRENEUR_ROLE) {
      navigate(`/entrepreneur/${userData?.uid}`);
    } else {
      navigate(`/profile/${userData?.uid}`);
    }
  };

  const handleMenuOptionClick = () => {
    setMenuOpen(false);
    if (userData.type === ENTREPRENEUR_ROLE) {
      navigate("/jobpostings");
    } else {
      navigate("/jobs");
    }
  };

  const handleWalletClick = () => {
    setMenuOpen(false);
    navigate("/wallet-screen");
  };

  const handleMenuToggle = (event) => {
    event.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleNotificationToggle = (event) => {
    event.stopPropagation();
    setNotificationOpen(!notificationOpen);
  };

  return (
    <div className="nav-bar-container">
      <div className="logo-search-container">
        <span onClick={() => navigate(ROUTES.HOME_SCREEN)} className="logo">
          <span style={{ color: "#0d6efd", fontSize: "34px" }}>X</span>pert
        </span>
      </div>

      <div className="hire-btns">
        {userData == null && !loading && (
          <button onClick={() => navigate(ROUTES.SIGN_IN)} className="hire-xpert-btn">
            Log in
          </button>
        )}

        {loading ? (
          <div className="profile-menu-container">
            <div className="overflow-auto h-[45px] mr-[10px] w-[100px] rounded-full">
              <Skeleton variant="rectangular" width={100} height={45}></Skeleton>
            </div>
          </div>
        ) : (
          userData && (
            <>
              {/* Notification Bell */}
              <div className="notification-container">
                <button ref={notificationRef} className="notification-btn" onClick={handleNotificationToggle}>
                  <AiOutlineBell style={{ fontSize: "1.5rem", cursor: "pointer" }} />
                  {invites?.length > 0 && <span className="notification-badge">{invites?.length}</span>}
                </button>

                {notificationOpen && (
                  <div className="notification-dropdown">
                    {invites?.length > 0 ? (
                      invites.map((invite, index) => (
                        <div key={index} className="notification-item">
                          <p>
                            <strong>{invite.from || "Unknown"}</strong> invited you.
                          </p>
                          <button className="accept-btn" onClick={() => acceptInvite(invite.id)}>Accept</button>
                          <button className="decline-btn" onClick={() => declineInvite(invite.id)}>Decline</button>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No new invites</p>
                    )}
                  </div>
                )}

              </div>

              {/* Profile Menu */}
              <div className="profile-menu-container">
                <button ref={profileButtonRef} className="profile-container" onClick={handleMenuToggle}>
                  {hasUserPhoto ? (
                    <img src={userData.photo_url} width="30px" height="30px" className="border size-[30px] object-cover"
                      style={{ borderRadius: "50%", cursor: "pointer" }} alt={userData?.firstName || "User"} />
                  ) : (
                    <AiOutlineUser style={{ fontSize: "1.5rem", marginRight: "5px" }} />
                  )}
                  <span className="profile-name !text-black hover:!text-black">{userData?.firstName}</span>
                </button>

                {menuOpen && (
                  <div className="dropdown-menu" ref={menuRef}>
                    <div className="dropdown-item" onClick={handleMenuProfileClick}>
                      <AiOutlineUser className="menu-icon" />
                      Profile
                    </div>
                    <div className="dropdown-item" onClick={() => handleMenuOptionClick("/jobs")}>
                      <FaBriefcase className="menu-icon" />
                      Jobs
                    </div>
                    <div className="dropdown-item" onClick={handleWalletClick}>
                      <FaWallet className="menu-icon" />
                      Wallet
                    </div>
                    <div className="dropdown-item" onClick={handleMenuOptionClick}>
                      <AiOutlineQuestionCircle className="menu-icon" />
                      My {userData.type === ENTREPRENEUR_ROLE ? "Jobs" : "Schedule"}
                    </div>
                    <div className="dropdown-item logout" onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}>
                      <AiOutlineLogout className="menu-icon" />
                      Log Out
                    </div>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
