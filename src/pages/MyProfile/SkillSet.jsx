import Skeleton from "@mui/material/Skeleton";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import code from "../../assets/svg/code.svg";

export default function SkillSet({ profileData, skillloading }) {
  const navigate = useNavigate();

  const handleService = (item) => {
    const serializableItem = {
      serviceName: item.serviceName,
      serviceDescription: item.serviceDescription,
      serviceDuration: item.serviceDuration,
      serviceDurationType: item.serviceDurationType,
      servicePrice: item.servicePrice,
    };

    navigate("/service", { state: { item: serializableItem } });
  };

  // console.log("skill", profileData);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
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

  return (
    <div>
      <div className="profile-details-skill-sec">
        <h3>Skills</h3>
      </div>

      {/* Skills slider */}
      <div className="skillset-container">
        {profileData?.skillSet && profileData.skillSet.length > 0 ? (
          profileData.skillSet.map((skillItem, index) => {
            // Mapping the rating (1-5) to a percentage value (20-100)
            const ratingPercentage = (skillItem?.skillRating / 5) * 100;

            return (
              <div className="profile-details-second-wrap-sec" key={index}>
                <div
                  className={`mentor-icon ${
                    ["purple-bg", "green-bg", "pink-bg", "orange-bg"][index % 4]
                  }`}
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <CircularProgressbar
                    value={ratingPercentage} // Set progress based on the rating
                    styles={buildStyles({
                      pathColor:
                        ratingPercentage >= 80
                          ? "green"
                          : ratingPercentage >= 60
                          ? "orange"
                          : "red", // Change color based on rating
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

      <div style={{ width: "100%" }} className="service-container">
        <h3>Services</h3>
        <div className="service-list">
          {profileData?.serviceDetails?.map((serviceItem, index) => (
            <div
              key={index}
              className="service-item"
              onClick={() => navigate("/service/" + serviceItem?.id)} // Trigger navigation to project
            >
              <span className="service-name" style={{ fontSize: "0.8rem" }}>
                {serviceItem?.serviceName}
              </span>
              <span className="service-description">
                <div
                  dangerouslySetInnerHTML={{
                    __html: serviceItem?.serviceDescription,
                  }}
                  className="pointer-events-none saturate-0 no-underline"
                ></div>
                {/* {(serviceItem?.serviceDescription).slice(0, 50) + ".."} */}
              </span>
              <span className="service-price" style={{ fontSize: "0.7rem" }}>
                ₹{serviceItem?.servicePrice}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
