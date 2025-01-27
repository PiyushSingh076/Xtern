import React, { useState } from "react";
import menu from "../assets/svg/menu.svg";
import close from "../assets/svg/close.png";
import { Link } from "react-router-dom";
import useFetchUserData from "../hooks/Auth/useFetchUserData";
import useOAuthLogout from "../hooks/Auth/useOAuthLogout";
import { AnimatePresence, motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineWallet,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineCalendar,
  AiOutlineLogin,
} from "react-icons/ai";
import { FaBriefcase } from "react-icons/fa";

export default function MobHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const { userData } = useFetchUserData();
  const { handleLogout } = useOAuthLogout();

  const navigate = useNavigate();

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuToggle = () => {
    setProfileMenu((prev) => !prev);
  };

  const handleMenuOptionClick = (route) => {
    setProfileMenu(false);
    navigate(route);
  };

  return (
    <div
      className="mob-header-container !z-[100]"
      // style={{ border: isOpen && "none" }}
    >
      <div className="menu-btn-container">
        <button className="menu-btn flex items-center" onClick={handleMenuClick}>
          <img src={menu} width={"20px"} />
        </button>
      </div>
      <div
        onClick={() => navigate("/homescreen")}
        className="absolute left-1/2 -translate-x-1/2"
      >
        <span style={{ color: "#0d6efd", fontSize: "22px" }}>X</span>pert
      </div>

      <div className="back-btn-container !w-fit">
        <img
          onClick={handleMenuToggle}
          src={userData?.photo_url}
          className="size-[25px] rounded-full object-cover"
        />
      </div>

      {profileMenu && (
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            top: "50px",
            right: "0px",
            backgroundColor: "#fff",
            width: "100px",
            height: "auto",
            border: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="dropdown-item"
            onClick={() => {
              if(userData?.type === "entrepreneur") {
                handleMenuOptionClick(`entrepreneur/${userData?.uid}`)
              }
              else{
                handleMenuOptionClick(`profile/${userData?.uid}`)
              }
            }}
          >
            <AiOutlineUser className="menu-icon" />
            Profile
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleMenuOptionClick("/wallet-screen")}
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
            onClick={() => handleMenuOptionClick("/support")}
          >
            <AiOutlineQuestionCircle className="menu-icon" />
            My Schedule
          </div>
          <div
            className="dropdown-item logout"
            onClick={() => {
              handleLogout();
              setProfileMenu(false);
            }}
          >
            <AiOutlineLogout className="menu-icon" />
            Log Out
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.1,
              }}
              onClick={() => setIsOpen(false)}
              className="fixed z-[40] size-full left-0 top-0 bg-black/10"
            ></motion.div>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{
                ease: "circInOut",
              }}
              className="fixed z-50 left-0 bg-white items-center !w-[60vw] !h-dvh  flex flex-col"
            >
              <div
                onClick={() => navigate("/homescreen")}
                className="px-2 my-2"
              >
                <span style={{ color: "#0d6efd", fontSize: "28px" }}>X</span>
                pert
              </div>

              {userData ? (
                <>
                  <MenuLink
                    close={() => setIsOpen(false)}
                    title="Profile"
                    icon={<AiOutlineUser></AiOutlineUser>}
                    href={userData.type === "entrepreneur" ? `entrepreneur/${userData.uid}` : `profile/${userData.uid}`}
                  ></MenuLink>
                  <MenuLink
                    close={() => setIsOpen(false)}
                    title={userData.type === "entrepreneur" ? `My Jobs` : `Jobs`}
                    icon={<FaBriefcase></FaBriefcase>}
                    href={userData.type === "entrepreneur" ? `/jobpostings` : `jobs`}
                  ></MenuLink>
                  <MenuLink
                    close={() => setIsOpen(false)}
                    title="My Schedule"
                    icon={<AiOutlineCalendar></AiOutlineCalendar>}
                    href="/"
                  ></MenuLink>
                  <button
                    close={() => setIsOpen(false)}
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="h-[5vh] p-2 flex items-center gap-2 text-xl text-red-800 w-full active:bg-red-900/20"
                  >
                    <AiOutlineLogout></AiOutlineLogout>
                    <span className="text-red-800">Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setIsOpen(false);
                    }}
                    className="h-[5vh] p-2 flex rounded-full text-white justify-center bg-[#0d6efd] w-[calc(100%-16px)] items-center gap-2 text-base"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setIsOpen(false);
                    }}
                    className="h-[5vh] mt-2 p-2 flex rounded-full text-white justify-center bg-[#0d6efd] w-[calc(100%-16px)] items-center gap-2 text-base"
                  >
                    Sign up
                  </button>
                </>
              )}
              <div className="mt-auto flex w-full flex-col p-2 no-underline">
                <div>Quick Links</div>
                <Link to="/homescreen" className="no-underline">
                  Home
                </Link>
                <Link to="/homescreen" className="no-underline">
                  About
                </Link>
                <Link to="/homescreen" className="no-underline">
                  Contact
                </Link>
              </div>
              {/* <MenuLink
                title="Home"
                icon={<AiOutlineUser></AiOutlineUser>}
                href="/"
              ></MenuLink>
              <MenuLink
                title="About"
                icon={<AiOutlineUser></AiOutlineUser>}
                href="/"
              ></MenuLink>
              <MenuLink
                title="Contact"
                icon={<AiOutlineUser></AiOutlineUser>}
                href="/"
              ></MenuLink> */}
            </motion.div>
            {/* <div className="side-menu">
            <div>
              <Link className="menu-items" to={"/"}>
                Home
              </Link>
            </div>
            <div>
              <Link className="menu-items" to={"/about"}>
                About
              </Link>
            </div>
            <div>
              <Link className="menu-items" to={"/contact"}>
                Contact
              </Link>
            </div>
            {userData && (
              <div>
                <Link className="menu-items" to={`profile/${userData.uid}`}>
                  Profile
                </Link>
              </div>
            )}
            {userData && (
              <div className="log-out">
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div> */}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ title, icon, href, close }) {
  return (
    <Link
      onClick={() => close()}
      className="w-full p-2 active:bg-gray-100 h-[5vh] text-xl no-underline text-black flex gap-2 items-center "
      to={href}
    >
      <div className="text-[rgb(13,110,253)]">{icon}</div>
      {title}
    </Link>
  );
}
