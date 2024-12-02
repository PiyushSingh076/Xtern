// Imports
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useUserProfileData from "../../hooks/Profile/useUserProfileData";
import SkillSet from "./SkillSet";
import Acadamic from "./Acadamic";
import MainProfile from "./MainProfile";
import VentureOptions from "./VentureOptions";
import Skeleton from '@mui/material/Skeleton';

const SingleMentor = () => {
  // State declarations
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams();
  const role = useSelector((state) => state.role);
  
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);
  
  console.log("profileData", profileData, profileError);

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page in the history stack
  };

  console.log('index',profileLoading)

  return (
    <>
      {/* Header section */}


      {/* Main content section */}
      <section id="single-mentor-sec">
        <div className="container">
          <h1 className="d-none">Hidden</h1>
          <h2 className="d-none">Mentor</h2>
          <div className="single-mentor-sec-wrap mt-32">

            {/* Profile information */}
            <MainProfile userdata={profileData} loading={profileLoading} />
            
            <div className="navbar-boder mt-24"></div>

            {/* {profileData?.organization  && <VentureOptions />} */}

            {/* SkillSet section */}
             
              <>
                {profileLoading ? (
                  <Skeleton variant="rounded" width={'100%'} height={'150px'} sx={{marginTop: '40px'}}/>
                ) : (
                  <SkillSet profileData={profileData} />
                )}
              </>
          

            {/* Acadamic section */}
      
              <>
                {profileLoading ? (
                  <Skeleton variant="rounded" width={'100%'} height={'350px'} sx={{marginTop: '80px'}}/>
                ) : (
                  <Acadamic profileData={profileData}  />
                )}
              </>
   
          </div>
        </div>
      </section>
      {/* End of main content section */}
    </>
  );
};

export default SingleMentor;
