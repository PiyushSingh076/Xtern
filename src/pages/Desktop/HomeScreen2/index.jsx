import React, { useState, useEffect } from "react";
import "./Homescreen.css";
import LandingBanner from "./LandingBanner";
import Categories from "./Categories";
import Xperts from "./Xperts";
import Xterns from "./Xterns";
import TrustedCompany from "./TrustedComoany";
import ImageBtn from "./ImageBtn";
import BlogSection from "./BlogSection";
import Footer from "../Footer/Footer";
import Hire from "./Popup/Hire";
import Become from "./Popup/Become";
import Org from "./EmployerDashboad";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useUserProfileData from "../../../hooks/Profile/useUserProfileData";
import useOAuthLogout from "../../../hooks/Auth/useOAuthLogout";
import useAcceptInvite from "../../../hooks/Teams/useAcceptInvite";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function Homepage() {
  const [show, setShow] = useState(false);
  const [Role, setRole] = useState("");
  const [invitesAccepted, setInvitesAccepted] = useState(false);
  const [noInvites, setNoInvites] = useState(false); // Track if user has no invites
  const [isLoading, setIsLoading] = useState(true); // Unified loading state

  const {
    userData,
    loading: userLoading,
    error: userError,
  } = useFetchUserData();
  const { handleLogout, loading: logoutLoading } = useOAuthLogout();

  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
    refreshUserData,
  } = useUserProfileData(userData?.uid);

  const {
    acceptInvite,
    loading: acceptLoading,
    error: acceptError,
  } = useAcceptInvite();

  useEffect(() => {
    const checkAndAcceptInvites = async () => {
      if (!userData || profileLoading) {
        setIsLoading(false); // If user data is not ready or still loading profile
        return;
      }

      if (!profileData?.organization && !invitesAccepted) {
        const userPhoneNumber = profileData?.phone_number;

        if (userPhoneNumber) {
          const normalizedPhone = userPhoneNumber.replace(/\D/g, "");
          const invitesRef = collection(db, "teamInvite");
          const q = query(invitesRef, where("invited", "==", normalizedPhone));

          try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              console.log(`Found ${querySnapshot.size} invite(s) for user.`);
              for (const docSnapshot of querySnapshot.docs) {
                const inviteId = docSnapshot.id;
                console.log(`Accepting invite with ID: ${inviteId}`);
                await acceptInvite(inviteId);
              }
              // Refresh profile data after accepting invites
              if (typeof refreshUserData === "function") {
                await refreshUserData();
                console.log("Profile data refreshed after accepting invites.");
              }
            } else {
              console.log("No invites found for user.");
              setNoInvites(true); // Mark that user has no invites
            }
          } catch (err) {
            console.error("Error during invite acceptance:", err);
          } finally {
            setInvitesAccepted(true);
            setIsLoading(false);
          }
        } else {
          console.log("User has no phone number, cannot check invites.");
          setNoInvites(true); // Mark that user has no invites
          setInvitesAccepted(true);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // User already belongs to an organization
      }
    };

    checkAndAcceptInvites();
  }, [
    userData,
    profileData,
    profileLoading,
    invitesAccepted,
    acceptInvite,
    refreshUserData,
  ]);

  // Avoid rendering any content until all loading is resolved
  if (userLoading || isLoading || acceptLoading) {
    return (
      <div className="homescreen-container">
        <div
          style={{
            width: "100%",
            height: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // If no invites and no organization, show the homepage sections
  if (noInvites && !profileData?.organization) {
    return (
      <div className="homescreen-container">
        <LandingBanner pop={setShow} setRole={setRole} />
        <div>
          <Categories />
          <Xperts />
          <Xterns />
          <TrustedCompany />
          <ImageBtn />
          <BlogSection />
          <Footer />
        </div>
      </div>
    );
  }

  // Handle and display errors if any
  // if (userError || profileError || acceptError) {
  //   return (
  //     <div className="homescreen-container">
  //       <div
  //         style={{
  //           width: "100%",
  //           height: "90vh",
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           flexDirection: "column",
  //         }}
  //       >
  //         <div className="error-message">
  //           <span>{userError || profileError || acceptError}</span>
  //           <button onClick={handleLogout} disabled={logoutLoading}>
  //             Try Another Account
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="homescreen-container">
      {/* Show LandingBanner if user is not logged in */}
      {!userData && <LandingBanner pop={setShow} setRole={setRole} />}

      {/* If user is part of an organization, show Org component */}
      {userData && profileData?.organization ? (
        <Org data={profileData} />
      ) : null}

      {/* Show other homepage sections if not showing popup and user is not logged in */}
      {!show && (
        <div>
          {/* {!userData && ( */}
          <div>
            <Categories />
            <Xperts />
            <Xterns />
            <TrustedCompany />
            <ImageBtn />
            <BlogSection />
          </div>
          {/* )} */}
          <Footer />
        </div>
      )}

      {/* Show popup based on Role */}
      {show && (
        <div className="popup-container">
          {Role === "Bxpert" && <Become setShow={setShow} />}
          {Role === "Hxpert" && <Hire setShow={setShow} />}
        </div>
      )}
    </div>
  );
}
