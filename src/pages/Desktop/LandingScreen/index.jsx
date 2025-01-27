import React, { useEffect, useState } from "react";
import "./Homescreen.css";
import LandingBanner from "./LandingBanner";
import Categories from "./Categories";
import Xperts from "./Xperts";
import Xterns from "./Xterns";
import TrustedComoany from "./TrustedComoany";
import ImageBtn from "./ImageBtn";
import BlogSection from "./BlogSection";
import Footer from "../Footer/Footer";
import Hire from "./Popup/Hire";
import Become from "./Popup/Become";
import Org from "./EmployerDashboad";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import Loading from "../../../components/Loading";
import useOAuthLogout from "../../../hooks/Auth/useOAuthLogout";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [Role, setRole] = useState("");

  const { userData, loading, error } = useFetchUserData();
  const { handleLogout, loading: logoutloading } = useOAuthLogout(); // Use the logout hook

  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(userData?.uid);
  console.log("profileData", profileData, profileError);

  console.log(Role);

  useEffect(() => {
    if (userData) {
      navigate("/homescreen");
    }
  }, [userData]);

  return (
    <div className="homescreen-container">
      {!userData && <LandingBanner pop={setShow} setRole={setRole} />}
      {profileData?.organization ? (
        <Org data={profileData} />
      ) : (
        userData && (
          <div
            style={{
              width: "100%",
              height: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userData?.organization ? (
              <div style={{ fontSize: "28px", color: "red" }}>Loading...</div>
            ) : (
              <div className="bad-request">
                <span>Sorry! your E-mail not register as Organisation</span>

                <button onClick={handleLogout}>Try Another Account</button>
              </div>
            )}
          </div>
        )
      )}
      {!show && (
        <div>
          {!userData && (
            <div>
              <Categories />
              <Xperts />
              <Xterns />
              <TrustedComoany />
              <ImageBtn />
              <BlogSection />
            </div>
          )}
          <Footer />
        </div>
      )}

      {show && (
        <div className="popup-container">
          {Role == "Bxpert" && <Become setShow={setShow} />}
          {Role == "Hxpert" && <Hire setShow={setShow} />}
        </div>
      )}
    </div>
  );
}
