import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineUser,
  AiOutlineWallet,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineBell,
} from "react-icons/ai";
import { FaBriefcase, FaUser, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Header.css";
import { ROUTES } from "../../../constants/routes";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useOAuthLogout from "../../../hooks/Auth/useOAuthLogout";
import { ENTREPRENEUR_ROLE } from "../../../constants/Roles/professionals";
import { Button, Skeleton } from "@mui/material";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import toast from "react-hot-toast";

export default function Header() {
  const data = useSelector((state) => state.user);
  const { userData, loading } = useFetchUserData();
  const { handleLogout } = useOAuthLogout();
  const navigate = useNavigate();
  const { acceptInvite } = useNotifications(userData?.uid);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  const [isAcceptClicked, setIsAcceptClicked] = useState(false);

  const profileButtonRef = useRef(null);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  // Fetch invites when user data is available
  useEffect(() => {
    if (userData?.uid) {
      fetchInvites(userData.uid);
    }
  }, [userData]);

  // Fetch invites from Firestore
  async function fetchInvites(uid) {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", uid),
    );
    const invitesSnapshot = await getDocs(q);
    const inviteData = invitesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      loading: false,
    }));
    setInvites(inviteData);
  }

  // Handle accepting an invite
  const handleAcceptInvite = async (event, invite) => {
    event.stopPropagation();
    setIsAcceptClicked(true);
  
    try {
      // Update the invite's loading state
      setInvites((prevInvites) =>
        prevInvites.map((i) =>
          i.id === invite.id ? { ...i, loading: true } : i
        )
      );
  
      // Call the acceptInvite function with only the notificationId
      await acceptInvite(invite.id); // pass the notificationId
  
      // Remove the accepted invite from the UI
      setInvites((prevInvites) =>
        prevInvites.filter((i) => i.id !== invite.id)
      );
    } catch (error) {
      console.error("Error accepting invite:", error);
    } finally {
      setIsAcceptClicked(false);
    }
  };
  
  // Handle clicks outside the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        //setNotificationOpen(false);
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
      navigate("/jobs");
    } else {
      navigate("/event");
    }
  };

  const handleJobClick = () => {
    setMenuOpen(false);
    // if (userData.type === ENTREPRENEUR_ROLE) {
    navigate("/jobs"); // Redirect for entrepreneurs
    // }
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
          <button
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="hire-xpert-btn"
          >
            Log in
          </button>
        )}

        {loading ? (
          <div className="profile-menu-container">
            <div className="overflow-auto h-[45px] mr-[10px] w-[100px] rounded-full">
              <Skeleton variant="rectangular" width={100} height={45} />
            </div>
          </div>
        ) : (
          userData && (
            <>
              {/* Notification Bell */}
              <div className="notification-container">
                <button
                  ref={notificationRef}
                  className="notification-btn"
                  onClick={handleNotificationToggle}
                >
                  <AiOutlineBell style={{ fontSize: "1.5rem", cursor: "pointer" }} />
                  {invites?.length > 0 && (
                    <span className="notification-badge">{invites.length}</span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="notification-dropdown">
                    {invites?.length > 0 ? (
                      invites.map((invite, index) => (
                        <div key={index} className="notification-item">
                          <p>
                            <strong>{invite?.entrepreneurName || "Unknown"}</strong> invited you to join their team.
                          </p>
                          <p className="invite-description">{invite?.description}</p>
                          <p className="invite-stipend">{invite?.stipend}</p>
                          <Button
                            disabled={invite.loading || invite.status === "ACCEPTED"}
                            className="accept-btn !flex !gap-2 !items-center"
                            onClick={(e) => handleAcceptInvite(e, invite)}
                          >
                            {invite.loading && (
                              <div className="spinner-border spinner-border-sm"></div>
                            )}
                            {invite.status === "ACCEPTED" ? "Accepted" : "Accept"}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No new notifications</p>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="profile-menu-container">
                <button
                  ref={profileButtonRef}
                  className="profile-container"
                  onClick={handleMenuToggle}
                >
                  {hasUserPhoto ? (
                    <div className="size-[30px] relative overflow-hidden rounded-full">
                      <img
                        src={userData.photo_url}
                        width="30px"
                        height="30px"
                        className="border object-cover absolute left-0 top-0 size-full"
                        style={{ borderRadius: "50%", cursor: "pointer" }}
                        alt={userData?.firstName || "User"}
                      />
                    </div>
                  ) : (
                    <AiOutlineUser style={{ fontSize: "1.5rem", marginRight: "5px" }} />
                  )}
                  <span className="profile-name !text-black hover:!text-black">
                    {userData?.firstName}
                  </span>
                </button>

                {menuOpen && (
                  <div className="dropdown-menu" ref={menuRef}>
                    {userData.role === "superuser" && (
                      <div className="dropdown-item" onClick={() => navigate("/superuser")}>
                        <FaUser className="menu-icon" />
                        Superuser Dashboard
                      </div>
                    )}
                    <div className="dropdown-item" onClick={handleMenuProfileClick}>
                      <AiOutlineUser className="menu-icon" />
                      Profile
                    </div>
                    <div className="dropdown-item" onClick={handleMenuOptionClick}>
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
            </>
          )
        )}
      </div>
    </div>
  );
}