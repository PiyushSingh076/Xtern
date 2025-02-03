import Skeleton from "@mui/material/Skeleton";
import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import code from "../../assets/svg/code.svg";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { FaClock, FaRegFolderOpen } from "react-icons/fa";
import moment from 'moment';

// Import Firebase Firestore and Auth functions
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function SkillSet({ profileData, skillloading }) {
  const navigate = useNavigate();

  // State to hold the user's service from Firebase
  const [userService, setUserService] = useState(null);

  // Fetch the current user's service from Firebase (from "services" collection)
  useEffect(() => {
    const fetchUserService = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const db = getFirestore();
        const servicesRef = collection(db, "services");
        const q = query(servicesRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        let serviceFound = null;
        querySnapshot.forEach((doc) => {
          serviceFound = { id: doc.id, ...doc.data() };
        });
        setUserService(serviceFound);
      } catch (error) {
        console.error("Error fetching user's service:", error);
      }
    };

    fetchUserService();
  }, []);

  const handleService = (item) => {
    if (item.serviceName.toLowerCase().trim() === "internship") return;

    const serializableItem = {
      serviceName: item.serviceName,
      serviceDescription: item.serviceDescription,
      serviceDuration: item.serviceDuration,
      serviceDurationType: item.serviceDurationType,
      servicePrice: item.servicePrice,
    };

    navigate("/service", { state: { item: serializableItem } });
  };

  if (skillloading) {
    return (
      <div className="skillset-container">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div className="profile-details-second-wrap-sec" key={index}>
              <Skeleton variant={"circular"} width={80} height={80} />
              <Skeleton width={"80%"} height={20} style={{ marginTop: 10 }} />
              <Skeleton width={"60%"} height={15} />
            </div>
          ))}
      </div>
    );
  }

  const SERVICE_CLICK_RESTRICTIONS = {
    intern: true,
    // Add more roles as needed
  };

  const formatDateGeneric = (date) => {
    return moment(date).format('DD MMM YYYY');
  };

  return (
    <div>
      {/* Skills Section */}
      <div className="profile-details-skill-sec">
        <h3>Skills</h3>
      </div>

      {/* Skills Slider */}
      <div className="skillset-container">
        {profileData?.skillSet?.length > 0 ? (
          profileData.skillSet.map((skillItem, index) => {
            const ratingPercentage = (skillItem?.skillRating / 5) * 100;
            return (
              <div className="profile-details-second-wrap-sec" key={index}>
                <div
                  className={`mentor-icon ${
                    ["purple-bg", "green-bg", "pink-bg", "orange-bg"][index % 4]
                  }`}
                  style={{ position: "relative", width: "80px", height: "80px" }}
                >
                  <CircularProgressbar
                    value={ratingPercentage}
                    styles={buildStyles({
                      pathColor:
                        ratingPercentage >= 80
                          ? "green"
                          : ratingPercentage >= 60
                          ? "orange"
                          : "red",
                      trailColor: "#f0f0f0",
                    })}
                  />
                  <img
                    src={code}
                    alt={`${skillItem?.skill}-icon`}
                    style={{
                      padding: "5px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "40px",
                    }}
                  />
                </div>
                <div className="mentor-content-single mt-12">
                  <p>{skillItem?.skill}</p>
                  <p>{skillItem?.skillRating} Star</p>
                </div>
              </div>
            );
          })
        ) : (
          <span style={{ color: "black", marginBottom: "20px" }}>
            No skill set available
          </span>
        )}
      </div>
      <div className="service-container">
        <h4>Service</h4>
        {profileData?.serviceDetails?.length ? (
          <div className="service-list">
            {profileData.serviceDetails.map((item, index) => {
              const isRestricted = SERVICE_CLICK_RESTRICTIONS[profileData?.type?.toLowerCase()];
              
              return (
                <div
                onClick={() => !isRestricted && navigate("/service/" + item?.id)}
                  className="service-item"
                  key={index}
                  style={{
                    cursor: isRestricted ? "not-allowed" : "pointer",
                    padding: "10px",
                    border: "1px solid #ddd",
                    transition: "box-shadow 0.3s, background-color 0.3s",
                  }}
                >
                  <span className="service-name">{item.serviceName}</span>

                  {/* **Interactive Description with Tooltip** */}
                  <Tooltip title={item.serviceName} arrow placement="top">
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item?.serviceDescription,
                        }}
                        className="pointer-events-none saturate-0 no-underline max-h-[70px] overflow-hidden"
                      ></div>
                    </div>
                  </Tooltip>

                  {profileData?.type?.toLowerCase() === "intern" ? (
                    /* **1. Compact Badge for Interns** */
                    <Chip
                      label={`Avail: ${item.availability}, ${item.hoursPerDay
                        }h/day | ${formatDateGeneric(
                          item.startDate
                        )}, ${formatDateGeneric(item.endDate)}`}
                      size="small"
                      color="primary"
                      sx={{
                        marginTop: 1,
                        backgroundColor: "#f5f5f5", 
                        border: "1px solid #424242", 
                        color: "#424242", 
                      }}
                    />
                  ) : (
                    /* **2. Service Duration and Price for Non-Interns** */
                    <div className="price-duration-container !mt-auto">
                      {item.serviceDuration && (
                        <span className="service-duration">
                          <FaClock /> {item.serviceDuration}{" "}
                          {item.serviceDurationType}
                        </span>
                      )}
                      {item.servicePrice && (
                        <span className="service-price">
                          ₹{item.servicePrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <FaRegFolderOpen size={50} color="#ccc" />
            <p>No services available</p>
          </div>
        )}
      </div>
    </div>
  );
}
