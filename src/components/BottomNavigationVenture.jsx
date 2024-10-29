// Bottom navigation component for venture users
import { Link, useLocation } from "react-router-dom";
import { TbBriefcase2 } from "react-icons/tb"; // Briefcase icon for Teams tab
import { MdOutlineMenuBook } from "react-icons/md"; // Book icon for Posts tab
import { MdGroups } from "react-icons/md"; // Groups icon for Discover tab
import { MdOutlineChat } from "react-icons/md"; // Chat icon for Chat tab
import teams from "../assets/svg/teams.svg";
import org from "../assets/svg/org.svg";

const BottomNavigationVenture = () => {
  const location = useLocation(); // Get the current location from react-router

  // Helper function to check if current path matches given path
  const isActive = (path) => location.pathname === path;

  return (
    // Main bottom navigation container with padding
    <div id="bottom-navigation" style={{ paddingBottom: "20px" }}>
      <div className="container">
        <div className="home-navigation-menu">
          <div className="bottom-panel navigation-menu-wrap">
            {/* Navigation menu items */}
            <ul className="bootom-tabbar d-flex justify-content-around">
              {/* Posts tab */}
              <li
                className={isActive("/course-ongoing-screen") ? "active" : ""}
              >
                <Link
                  to="/course-ongoing-screen"
                  className={isActive("/course-ongoing-screen") ? "active" : ""}
                >
                  <MdOutlineMenuBook
                    className={
                      isActive("/course-ongoing-screen") ? "active" : ""
                    }
                    color={isActive("/course-ongoing-screen") ? "white" : ""}
                    size={24}
                  />
                </Link>
                <span className="d-block small">Posts</span>
              </li>

              {/* Teams tab */}
              <li className={isActive("/teams/xtern") ? "active" : ""}>
                <Link
                  to="/teams/xtern"
                  className={isActive("/teams/xtern") ? "active" : ""}
                >
                  <img
                    src={teams}
                    className={isActive("/teams/xtern") ? "active" : ""}
                    style={{
                      filter: isActive("/teams/xtern") ? "brightness(0) invert(1)" : "none",
                      width: isActive("/teams/xtern") ? "40px" : "24px"
                    }}
                  />
                </Link>
                <span className="d-block small">Teams</span>
              </li>

              {/* Discover tab */}
              <li className={isActive("/homescreen") ? "active" : ""}>
                <Link
                  to="/homescreen"
                  className={isActive("/homescreen") ? "active" : ""}
                >
                  <MdGroups
                    className={isActive("/homescreen") ? "active" : ""}
                    color={isActive("/homescreen") ? "white" : "black"}
                    size={24}
                  />
                </Link>
                <span className="d-block small">Discover</span>
              </li>

              {/* Chat tab */}
              <li className={isActive("/chat-screen") ? "active" : ""}>
                <Link
                  to="/chat-screen"
                  className={isActive("/chat-screen") ? "active" : ""}
                >
                  <MdOutlineChat
                    className={isActive("/chat-screen") ? "active" : ""}
                    color={isActive("/chat-screen") ? "white" : ""}
                    size={24}
                  />
                </Link>
                <span className="d-block small">Chat</span>
              </li>

              {/* Organization/Profile tab */}
              <li className={isActive("/profile") ? "active" : ""}>
                <Link
                  to="/profile"
                  className={isActive("/profile") ? "active" : ""}
                >
                  {/* Custom SVG icon for profile */}
                  <img
                    src={org}
                    className={isActive("/profile") ? "active" : ""}
                    style={{
                      filter: isActive("/profile") ? "brightness(0) invert(1)" : "none",
                      width: isActive("/profile") ? "40px" : "24px",
                      color: isActive("/profile") ? "white" : "blue"
                    }}
                  />
                </Link>
                <span className="d-block small">Org</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigationVenture;
