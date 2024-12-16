import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useUserProfileData from "../../hooks/Profile/useUserProfileData";
import SkillSet from "./SkillSet";
import Acadamic from "./Acadamic";
import MainProfile from "./MainProfile";
import Skeleton from "@mui/material/Skeleton";
import { MdEdit } from "react-icons/md";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";

const SingleMentor = () => {
  // State declarations
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [Editable, setEditable] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams();
  const role = useSelector((state) => state.role);

  // Hooks for data fetching
  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(uid);

  const { userData: currentUser } = useFetchUserData();

  // Determine if the user is editable
  useEffect(() => {
    if (currentUser && currentUser.uid === uid) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [currentUser, uid]);


    const sanitizeProfileData = (data) => {
  return JSON.parse(JSON.stringify(data)); // Removes non-serializable fields
};

  // Navigate to edit page with sanitized data
  const handleEdit = () => {
    if(profileData?.type){
    const sanitizedData = sanitizeProfileData(profileData);
  navigate('/userdetail', { state: { profileData: sanitizedData } });
  }

  else{
     navigate('/userdetail')
  }
  };

  // Navigate back
  const handleBackClick = () => {
    navigate(-1);
  };

  // Render fallback for errors
  if (profileError) {
    return (
      <section id="single-mentor-sec">
        <div className="container">
          <h2>An error occurred while loading the profile.</h2>
          <button onClick={handleBackClick}>Go Back</button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header section */}
      {Editable && (
        <button
        style={{
          top:'50px'
        }}
         onClick={handleEdit} className="edit-btn">
          <MdEdit />
        </button>
      )}

      {/* Main content section */}
      <section id="single-mentor-sec">
        <div className="container">
          <h1 className="d-none">Hidden</h1>
          <h2 className="d-none">Mentor</h2>
          <div className="single-mentor-sec-wrap mt-32">
            {/* Profile information */}
            {profileLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={"300px"} />
            ) : (
              <MainProfile userdata={profileData} loading={profileLoading} />
            )}

            <div className="navbar-boder mt-24"></div>

            {/* SkillSet section */}
            {profileLoading ? (
              <Skeleton
                variant="rounded"
                width={"100%"}
                height={"150px"}
                sx={{ marginTop: "40px" }}
              />
            ) : (
              <SkillSet profileData={profileData} />
            )}

            {/* Acadamic section */}
            {profileLoading ? (
              <Skeleton
                variant="rounded"
                width={"100%"}
                height={"350px"}
                sx={{ marginTop: "80px" }}
              />
            ) : (
              <Acadamic profileData={profileData} />
            )}
          </div>
        </div>
      </section>
      {/* End of main content section */}
    </>
  );
};

export default SingleMentor;