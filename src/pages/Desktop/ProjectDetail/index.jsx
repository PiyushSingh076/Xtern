// mobile response reset

// Import necessary dependencies and components
import React, { useEffect, useRef, useState } from "react";
import BookmarkSvg from "../../../assets/svg/white-bookmark.svg";
import LockIconSvg from "../../../assets/images/single-courses/lock-icon.svg";
import DisableLockSvg from "../../../assets/images/single-courses/disable-lock.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import EditServiceForm from "./EditService";
import LeaveReviewBox from "./LeaveReviewBox";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import useFetchProjectData from "../../../hooks/Auth/useFetchProjectData";
import "./projectDetail.css";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import { useSelector } from "react-redux";
import YouTubePreview from "./YouTubePreview";
import StarRateIcon from "@mui/icons-material/StarRate";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import WalletModal from "./WalletModal";
import useAuthState from "../../../hooks/Authentication/useAuthState";
import { collection, doc, getDoc, getDocs, getFirestore, query } from "firebase/firestore";
import { UploadIcon } from "lucide-react";
import { db } from "../../../firebaseConfig";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    profilePic:
      "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
    review: "Great course! Very detailed and easy to understand.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    profilePic: "https://via.placeholder.com/50",
    review: "I learned a lot from this course. Highly recommend it!",
    rating: 2,
  },
  {
    id: 3,
    name: "Alice Johnson",
    profilePic: "https://via.placeholder.com/50",
    review: "The content was good, but I wish it had more examples.",
    rating: 3,
  },
];

// Define the ProjectDetails component
const ProjectDetails = () => {
  // State variables
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [isBookmarkIcon, setIsBookmarkIcon] = useState(false);

  const fileInputRef = useRef(null);

  const [showReviewBox, setShowReviewBox] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [serviceReviews, setServiceReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const firestore = getFirestore();
        const reviewsRef = collection(firestore, "reviews");
        const q = query(reviewsRef);
        const querySnapshot = await getDocs(q);

        const reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });

        setServiceReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleLeaveReviewClick = () => {
    setShowReviewBox(true);
  };

  const handleCancelClick = () => {
    setShowReviewBox(false);
  };

  const handleButtonClick = () => {
    // Trigger click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // console.log("Selected file:", file);
      // Add your file upload logic here
    }
  };

  // Hooks
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user, loading } = useAuthState();

  // Get authentication state from Redux store
  const auth = useSelector((state) => state.role.auth);
  console.log(`auth: ${auth}`);
  

  const location = useLocation();
  // const { item } = location.state || {};
 
  const [item, setItem] = useState({})

  useEffect(() => {
    const fetchItem = async () => {
      const serviceSnapshot = await getDoc(doc(db, "services", projectId))

      if (serviceSnapshot.exists()) {
        console.log("service data", serviceSnapshot.data());
        setItem(serviceSnapshot.data())
      }
    }
    fetchItem()
  }, [])

  const [showModal, setShowModal] = useState(false);

  const handleBuyNowClick = () => {
    setShowModal(true);
  };

  // console.log(item, "service");

  // Navigation function
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page in the history stack
  };

  // Toggle bookmark functions
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

  // Show loading component while data is being fetched

  // Render the component
  return (
    <div className="des-project-detail-container">
      {/* Single description section start */}
      <section id="single-description-screen1">
        <div className="des-first-desc-img-sec">
          {/* Project image */}
          <div className="hero-img-desc">
            <div className="d-flex justify-content-center">
              {/* <img
                src={HeaderImg}
                alt="social-media-img"
                height="400"
                width="400"
                className="des-img-fluid"
              /> */}

              <YouTubePreview />
            </div>

            {/* Back button and bookmark icon */}
            <div className="single-courses-top">
              <div className="course-back-icon">
                <svg
                  onClick={handleBackClick}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_330_7385"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="black" />
                  </mask>
                  <g mask="url(#mask0_330_7385)">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <div className="single-courses-bookmark-icon">
                <a
                  href=""
                  className={`item-bookmark ${isBookmarked ? "active" : ""}`}
                  onClick={toggleBookmark}
                  tabIndex="0"
                >
                  <img src={BookmarkSvg} alt="bookmark-icon" />
                </a>
              </div>
            </div>
            {item?.uid && user?.uid && item.uid === user.uid && (
              <>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "#0a65fc",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    marginTop: "10px",
                    marginLeft: "140px",
                  }}
                  onClick={handleButtonClick}
                >
                  <UploadIcon sx={{ color: "white", padding: "2px" }} />
                  Upload Video
                </button>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
          {/* Project details */}
          <div className="desc-container">
            <div className="des-clearsingle-courses-description">
              {/* Skills and price */}
              {/* <div className="first-decs-sec mt-16">
                 <div className="first-decs-sec-wrap">
                  <div className="skills-left-sec">
                     <div className="first-left-sec">
                      <div> {"Design"}</div>
                    </div>
                    <div className="first-left-sec">
                      <div> {"UI/UX"}</div>
                    </div>
                    <div className="first-left-sec">
                      <div> {"Figma"}</div>
                    </div> 
                  </div>

                  <div className="first-right-sec">
                    <div>
                      <span className="firs-txt2">₹{item.servicePrice}</span>
                    </div>
                  </div>
                </div> 
              </div> */}
              {/* Project title and details */}
              <div className="second-decs-sec ">
                <div className="second-decs-sec-wrap">
                  <div className="second-decs-sec-top">
                    <h1 className="second-txt1">{item.serviceName}</h1>
                    <span className="firs-txt2">₹{item.servicePrice}</span>
                  </div>
                  {showEditForm && (
                    <EditServiceForm
                      initialDetails={item}
                      onSave={(updatedDetails) => {
                        console.log("Updated Service:", updatedDetails);
                        setShowEditForm(false); // Hide the form after saving
                      }}
                      onCancel={() => setShowEditForm(false)} // Hide the form on cancel
                    />
                  )}

                  <div className="second-decs-sec-bottom">
                    <div className="second-decs-sec-bottom-wrap">
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <GroupIcon sx={{ color: "#0a65fc" }} />
                        </span>
                        <span className="second-txt2">0 Application</span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8 fillStar">
                          <StarRateIcon sx={{ color: "#0a65fc" }} />
                        </span>
                        <span className="second-txt2">Level: Medium</span>
                      </div>
                      <div className="mt-12">
                        <span className="student-img mr-8">
                          <AccessTimeFilledIcon sx={{ color: "#0a65fc" }} />
                        </span>
                        <span className="second-txt2">89m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Description tabs */}
              <div className="fifth-decs-sec mt-32">
                <div className="fifth-decs-sec-wrap">
                  <ul
                    className="nav nav-pills single-courses-tab"
                    id="description-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="description-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#description-content"
                        type="button"
                        role="tab"
                        aria-selected="true"
                      >
                        Description
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="review-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#review-content"
                        type="button"
                        role="tab"
                        aria-selected="false"
                      >
                        Review
                      </button>
                    </li>
                    {/*  <li className="nav-item" role="presentation">
                       <button
                        className="nav-link"
                        id="lessons-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#lesson-content"
                        type="button"
                        role="tab"
                        aria-selected="false"
                      >
                        Assessment
                      </button> 
                    </li>
                    <li className="nav-item" role="presentation"></li>*/}
                  </ul>
                  {/* Description content */}
                  <div className="tab-content" id="description-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="description-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <div className="description-content-wrap mt-24">
                        <div className="description-first-content">
                          <h3 className="des-con-txt1">Details</h3>
                          <div
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                          >
                            <p className="des-text">
                              {item.serviceDescription}
                            </p>
                          </div>
                          {/* Apply Now button */}
                          <div className="des-buy-now-description">
                            {auth ? (
                              <Link
                                className="buy-now"
                                to={`/applyproject/${projectId}`}
                              >
                                Apply Now
                              </Link>
                            ) : (
                              <button className="buy-now size-full "  onClick={handleBuyNowClick}>
                              Buy Now
                            </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* review content */}
                  {/* <div
                    className="tab-pane fade"
                    id="review-content"
                    role="tabpanel"
                    tabIndex="0"
                  >
                    <div className="review-content-wrap mt-24">
                      <h3 className="des-con-txt1">User Reviews</h3>
                      <div
                        className="review-list"
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        {reviews.map((review) => (
                          <div className="review-item" key={review.id}>
                            <img
                              src={review.profilePic}
                              alt={`${review.name}'s profile`}
                              className="review-profile-pic"
                            />
                            <div className="review-details">
                              <h4 className="review-name">{review.name}</h4>
                              <p className="review-text">{review.review}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div> */}
                  <div
                    className="tab-pane fade"
                    id="review-content"
                    role="tabpanel"
                    tabIndex="0"
                  >
                    <div className="review-content-wrap mt-24">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* User Reviews Heading */}
                        <h3 className="des-con-txt1">User Reviews</h3>

                        {/* Leave Review Button */}
                        {user && (
                          <button
                            style={{
                              backgroundColor: "#0a65fc",
                              color: "white",
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onClick={handleLeaveReviewClick}
                          >
                            Leave Review
                          </button>
                        )}
                      </div>
                      {showReviewBox && (
                        <LeaveReviewBox onCancel={handleCancelClick} />
                      )}
                      <div
                        className="review-list"
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        {serviceReviews.map((review) => (
                          <div className="review-item" key={review.id}>
                            {/* Profile Picture */}
                            <img
                              src={review.profilePic}
                              alt={`${review.name}'s profile`}
                              className="review-profile-pic"
                            />
                            <div className="review-details">
                              {/* User Name */}
                              <div>
                                <h4 className="review-name">{review.name}</h4>

                                {/* User Review */}
                                <p className="review-text">{review.review}</p>
                              </div>
                              {/* Star Rating */}
                              <div className="review-stars">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <span key={index}>
                                    {index < review.rating ? (
                                      <StarRateIcon sx={{ color: "#0a65fc" }} />
                                    ) : (
                                      <StarBorderIcon
                                        sx={{ color: "#0a65fc" }}
                                      />
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Assessment content */}
                  <div className="tab-content" id="lessons-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="lesson-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <div className="lesson-content-wrap mt-24">
                        <div className="lesson-first-content">
                          <div className="lesson-first-content-top">
                            <div className="lesson-first-content-wrap">
                              <div className="lesson-course">
                                <h3 className="des-con-txt1">Course content</h3>
                              </div>
                              <div className="lesson-expand">
                                <p className="lesson-txt1">Expand Sections</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Accordion for course content */}
                        <div className="lesson-second-content">
                          <div className="lesson-second-content-bottom">
                            <div className="accordion" id="lesson-introduction">
                              {/* Introduction section */}
                              <div className="accordion-item mt-16">
                                <h2
                                  className="accordion-header"
                                  id="lesson-title1"
                                >
                                  <button
                                    className="accordion-button lesson-custom-btn"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse1"
                                    aria-expanded="true"
                                  >
                                    <span className="lesson-title">
                                      Introduction
                                    </span>
                                    <span className="lesson-custom-time">
                                      5 min
                                    </span>
                                  </button>
                                </h2>
                                <div
                                  id="collapse1"
                                  className="accordion-collapse collapse show"
                                  data-bs-parent="#lesson-introduction"
                                >
                                  <div className="accordion-body">
                                    <div className="lesson-intro-content mt-12">
                                      <div className="lesson-intro-content-wrap">
                                        <span className="lesson-txt2">
                                          Promotion
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2">
                                          Introduction
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2 color-grey">
                                          Course Material
                                        </span>
                                        <span className="lesson-lock-img color-grey">
                                          <img
                                            src={DisableLockSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* How Grids Work section */}
                              <div className="accordion-item mt-16">
                                <h2
                                  className="accordion-header"
                                  id="lesson-title2"
                                >
                                  <button
                                    className="accordion-button lesson-custom-btn"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse2"
                                    aria-expanded="true"
                                  >
                                    <span className="lesson-title">
                                      How Grids Work
                                    </span>
                                    <span className="lesson-custom-time">
                                      21 min
                                    </span>
                                  </button>
                                </h2>
                                <div
                                  id="collapse2"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#lesson-introduction"
                                >
                                  <div className="accordion-body">
                                    <div className="lesson-intro-content mt-12">
                                      <div className="lesson-intro-content-wrap">
                                        <span className="lesson-txt2">
                                          Promotion
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2">
                                          Introduction
                                        </span>
                                        <span className="lesson-lock-img">
                                          <img
                                            src={LockIconSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                      <div className="lesson-intro-content-wrap mt-12">
                                        <span className="lesson-txt2 color-grey">
                                          Course Material
                                        </span>
                                        <span className="lesson-lock-img color-grey">
                                          <img
                                            src={DisableLockSvg}
                                            alt="lock-icon"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <YouTubePreview /> */}
      </section>
      {/* Single description section end */}
      {/* Video modal start */}
      {/* <div
        className="modal"
        id="review-video-modal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
             <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div> 
             <div className="modal-body">
              <iframe
                src="https://www.youtube.com/embed/1SZle1skb84?si=2wmkzqF3sKhSy3xH"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen=""
              ></iframe>
             
            </div> 
            
           </div>
        </div> 
       
      </div> */}
      {/* Video modal end */}

      {showModal && (
        <WalletModal
        service={item}
          serviceName={item.serviceName}
          servicePrice={item.servicePrice}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
