// src/components/StepperForm/ProfilePicture.js
import React from "react";

const ProfilePicture = ({ profileImg, handleProfileImage }) => {
  return (
    <div className="profile-picture-section">
      <input
        className="file-input"
        type="file"
        id="hiddenFileInput"
        style={{ display: "none" }}
        onChange={handleProfileImage}
      />
      <img
        onClick={() => document.getElementById("hiddenFileInput").click()}
        width={"200px"}
        className="dp"
        src={
          profileImg
            ? profileImg
            : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
        }
        alt="Profile"
      />
    </div>
  );
};

export default ProfilePicture;
