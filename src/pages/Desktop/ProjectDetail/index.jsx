// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import FillStar from "../../../assets/images/single-courses/orange-fill-star.svg";
import StudentIcon from "../../../assets/images/single-courses/student-icon.svg";
import TimeIcon from "../../../assets/images/single-courses/time-icon.svg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import useFetchProjectData from "../../../hooks/Auth/useFetchProjectData";
import "./projectDetail.css";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import { useSelector } from "react-redux";
import YouTubePreview from "./YouTubePreview";
import StarRateIcon from "@mui/icons-material/StarRate";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

// Define the ProjectDetails component
const ProjectDetails = () => {
  // State variables
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isBookmarkIcon, setIsBookmarkIcon] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Hooks
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Get authentication state from Redux store
  const auth = useSelector((state) => state.role.auth);

  const location = useLocation();
  const { item } = location.state || {};

  console.log(item, "service");

  // Navigation function
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page in the history stack
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkIcon = () => {
    setIsBookmarkIcon(!isBookmarkIcon);
  };

  // Slider settings (not used in this component)
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: true,
    infinite: true,
    variableWidth: true,
    autoplaySpeed: 2000,
    dots: false,
    arrows: false,
  };

  // Hardcoded reviews
  const reviews = [
    {
      icon: FillStar,
      name: "John Doe",
      comment: "Amazing course, very detailed and well structured!",
    },
    {
      icon: StudentIcon,
      name: "Jane Smith",
      comment: "The course content was engaging and easy to follow.",
    },
    {
      icon: TimeIcon,
      name: "Michael Brown",
      comment: "Great value for the time invested. Highly recommend!",
    },
  ];

  // Show loading component while data is being fetched

  // Render the component
  // return (
  //   <div className="course-page">
  //     {/* Left Section: Video Preview */}
  //     <div className="left-section">
  //       <YouTubePreview />
  //     </div>

  //     {/* Right Section: Course Details */}
  //     <div className="right-section">
  //       {/* Course Details */}
  //       <div className="course-summary">
  //         <div className="course-detail-item">
  //           <img src={FillStar} alt="Rating" className="course-detail-icon" />
  //           <span className="course-detail-text">4.8/5.0 (200 Ratings)</span>
  //         </div>
  //         <div className="course-detail-item">
  //           <img
  //             src={StudentIcon}
  //             alt="Students Enrolled"
  //             className="course-detail-icon"
  //           />
  //           <span className="course-detail-text">500 Students Enrolled</span>
  //         </div>
  //         <div className="course-detail-item">
  //           <img
  //             src={TimeIcon}
  //             alt="Course Duration"
  //             className="course-detail-icon"
  //           />
  //           <span className="course-detail-text">10 Hours of Content</span>
  //         </div>
  //       </div>

  //       {/* Tabs */}
  //       <div className="tabs">
  //         <button
  //           className={`tab ${activeTab === "description" ? "active" : ""}`}
  //           onClick={() => setActiveTab("description")}
  //         >
  //           Description
  //         </button>
  //         <button
  //           className={`tab ${activeTab === "reviews" ? "active" : ""}`}
  //           onClick={() => setActiveTab("reviews")}
  //         >
  //           Reviews
  //         </button>
  //       </div>

  //       {/* Tab Content */}
  //       <div className="tab-content">
  //         {activeTab === "description" && (
  //           <div className="description">
  //             <h3>Course Description</h3>
  //             <p>
  //               Learn the fundamentals of software development, including
  //               coding, debugging, and project management. This course is
  //               perfect for beginners and intermediate learners looking to
  //               enhance their skills.
  //             </p>
  //           </div>
  //         )}
  //         {activeTab === "reviews" && (
  //           <div className="reviews">
  //             {reviews.map((review, index) => (
  //               <div key={index} className="review-item">
  //                 <img
  //                   src={review.profilePic}
  //                   alt={review.name}
  //                   className="review-profile-pic"
  //                 />
  //                 <div className="review-content">
  //                   <h4 className="review-name">{review.name}</h4>
  //                   <div className="review-rating">
  //                     {Array.from({ length: review.rating }, (_, i) => (
  //                       <img
  //                         key={i}
  //                         src={FillStar}
  //                         alt="Star"
  //                         className="review-star"
  //                       />
  //                     ))}
  //                   </div>
  //                   <p className="review-comment">{review.comment}</p>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="course-page">
      {/* Left Section: Video Preview */}
      <div className="left-section">
        <YouTubePreview />
      </div>

      {/* Right Section: Course Details */}
      <div className="right-section">
        {/* Course Details */}
        <div className="course-header">
          <h1>{item.serviceName}</h1>
          <div>
            <span className="course-price">₹200</span>
          </div>
        </div>
        <div className="course-summary">
          <div className="course-detail-item">
            <StarRateIcon
              className="course-detail-icon"
              sx={{ color: "#0a65fc" }}
            />
            <span className="course-detail-text">4.8/5.0</span>
          </div>
          <div className="course-detail-item">
            <GroupIcon
              className="course-detail-icon"
              sx={{ color: "#0a65fc" }}
            />
            <span className="course-detail-text">500 Students Enrolled</span>
          </div>
          <div className="course-detail-item">
            <AccessTimeFilledIcon
              className="course-detail-icon"
              sx={{ color: "#0a65fc" }}
            />
            <span className="course-detail-text">10 Hours of Content</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        {/* <div className="tab-content">
          {activeTab === "description" && (
            <div className="description">
              <p>{item.serviceDescription}</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="reviews">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <img
                    src={review.profilePic}
                    alt={review.name}
                    className="review-profile-pic"
                  />
                  <div className="review-content">
                    <h4 className="review-name">{review.name}</h4>
                    <div className="review-rating">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <img
                          key={i}
                          src={FillStar}
                          alt="Star"
                          className="review-star"
                        />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
        <div className="tab-content-container">
          {activeTab === "description" && (
            <div className="description">
              <p>{item.serviceDescription}</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="reviews">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <img
                    src={review.profilePic}
                    alt={review.name}
                    className="review-profile-pic"
                  />
                  <div className="review-content">
                    <h4 className="review-name">{review.name}</h4>
                    <div className="review-rating">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <img
                          key={i}
                          src={FillStar}
                          alt="Star"
                          className="review-star"
                        />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="des-buy-now-description">
          {false ? (
            <Link className="buy-now" to={`/applyproject/${projectId}`}>
              Apply Now
            </Link>
          ) : (
            <Link className="buy-now" to={`/signin`}>
              Buy Now{" "}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
