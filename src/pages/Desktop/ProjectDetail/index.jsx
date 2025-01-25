import React, { useEffect, useState } from "react";
import BookmarkSvg from "../../../assets/svg/white-bookmark.svg";
import StarRateIcon from "@mui/icons-material/StarRate";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./projectDetail.css";
import { saveReview } from "./firestoreHelpers";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import WalletModal from "./WalletModal";
import { Skeleton } from "@mui/material";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const db = getFirestore();

const ProjectDetails = () => {
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const { userData } = useFetchUserData();
  const [canReview, setCanReview] = useState(false);

  const navigate = useNavigate();
  const { projectId } = useParams();
  const auth = useSelector((state) => state.role.auth);
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);
  const [item, setItem] = useState({});

  

  useEffect(() => {
    const fetchItem = async () => {
      setPageLoading(true);
      const serviceSnapshot = await getDoc(doc(db, "services", projectId));

      if (serviceSnapshot.exists()) {
        console.log("service data", serviceSnapshot.data());
        setItem(serviceSnapshot.data());
      }
      setPageLoading(false);
    };
    fetchItem();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const [showModal, setShowModal] = useState(false);

  const handleBuyNowClick = () => {
    setShowModal(true);
  };

  // const handleVideoUpload = async () => {
  //   if (!selectedFile) {
  //     alert("Please select a file before uploading.");
  //     return;
  //   }

  //   const file = selectedFile;

  //   if (file.size > 10 * 1024 * 1024) {
  //     alert("File size should not exceed 10 MB.");
  //     return;
  //   }

  //   try {
  //     const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  //     const storage = getStorage();
  //     const storageRef = ref(storage, `videos/${sanitizedFileName}`);
  //     const snapshot = await uploadBytes(storageRef, file);
  //     const serviceVideo = await getDownloadURL(snapshot.ref);

  //     const auth = getAuth();
  //     const currentUser = auth.currentUser;

  //     if (!currentUser) {
  //       alert("You must be logged in to upload a video.");
  //       return;
  //     }

  //     const serviceNameData = {
  //       serviceName: item?.serviceName || "Unknown Service",
  //       userId: currentUser.uid,
  //       serviceVideo,
  //       timestamp: new Date(),
  //     };

  //     await setDoc(
  //       doc(db, "services", projectId),
  //       {
  //         serviceVideo: serviceVideo,
  //       },
  //       { merge: true }
  //     );

  //     setVideoFile(serviceVideo);
  //     setSelectedFile(null);
  //     document.querySelector("input[type='file']").value = "";
  //   } catch (error) {
  //     console.error("Error uploading video:", error);
  //     alert("Failed to upload video. Please try again.");
  //   }
  // };

  const handleReviewTabClick = () => {
    setShowReviews(true);
    fetchReviews();
  };

  const handleReviewSubmit = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in to submit a review.");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      let userPhotoURL = "";
      if (userDoc.exists()) {
        userPhotoURL = userDoc.data().photo_url;
      }

      let userName = "";
      if (userDoc.exists()) {
        userName = userDoc.data().display_name || userDoc.data().email;
      } else {
        userName = currentUser.display_name || currentUser.email;
      }

      const reviewData = {
        name: userName,
        review: reviewText,
        rating,
        userId: currentUser.uid,
        serviceId: projectId,
        photoURL: userPhotoURL,
        timestamp: new Date(),
      };

      const reviewId = await saveReview(reviewData);

      setReviews((prevReviews) => [
        ...prevReviews,
        { id: reviewId, ...reviewData },
      ]);

      setReviewText("");
      setRating(0);
      setShowReviewForm(false);
      setCanReview(false)
    } catch (error) {
      console.error("Failed to save review:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      // const auth = getAuth();
      // const currentUser = auth.currentUser;

      // if (!currentUser) {
      //   console.error("User is not logged in.");
      //   setReviews([]);
      //   return;
      // }

      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("serviceId", "==", projectId));
      const querySnapshot = await getDocs(q);

      const userReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Reviews",userReviews)

      const counter = 0;
      userReviews.forEach((review) => {
        if (review.userId !== userData.uid) {
          counter++;
        }
      });
      if(counter == userReviews.length){
        setCanReview(true)
      }
      

      setReviews(userReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="des-project-detail-container">
      <section id="single-description-screen1">
        <div className="des-first-desc-img-sec">
          <div className="hero-img-desc">
            <div className="d-flex justify-content-center">
              {item.serviceVideo ? (
                <div className="w-[400px] h-[300px] relative flex items-center justify-center">
                  <video
                    controls
                    src={item.serviceVideo}
                    className="absolute size-full object-cover"
                  ></video>
                </div>
              ) : (
                <div className="w-[400px] h-[300px] relative flex items-center justify-center">
                  No video available
                </div>
              )}
            </div>
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
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="single-courses-bookmark-icon">
                <a
                  href="#"
                  className={`item-bookmark ${isBookmarked ? "active" : ""}`}
                  onClick={toggleBookmark}
                >
                  <img src={BookmarkSvg} alt="bookmark-icon" />
                </a>
              </div>
            </div>
          </div>

          <div className="desc-container">
            <div className="des-clearsingle-courses-description">
              <div className="second-decs-sec">
                <div className="second-decs-sec-wrap">
                  <div className="second-decs-sec-top">
                    {pageLoading == false ? (
                      <>
                        <h1 className="second-txt1">{item.serviceName}</h1>
                      </>
                    ) : (
                      <Skeleton
                        height={40}
                        width={200}
                        variant="text"
                        className=""
                      ></Skeleton>
                    )}
                    {pageLoading == false ? (
                      <>
                        <span className="firs-txt2">₹{item.servicePrice}</span>
                      </>
                    ) : (
                      <Skeleton
                        height={40}
                        width={80}
                        variant="text"
                        className=""
                      ></Skeleton>
                    )}
                  </div>

                  <div className="second-decs-sec-bottom">
                    <div className="second-decs-sec-bottom-wrap">
                      <div className="mt-12 flex items-center gap-2">
                        <GroupIcon sx={{ color: "#0a65fc" }} />
                        <span className="second-txt2">0 Application</span>
                      </div>
                      {/* <div className="mt-12">
                        <StarRateIcon sx={{ color: "#0a65fc" }} />
                        <span className="second-txt2">Level: Medium</span>
                      </div> */}
                      <div className="mt-12 flex items-center gap-2">
                        <AccessTimeFilledIcon sx={{ color: "#0a65fc" }} />
                        <span className="second-txt2">
                          {item.serviceDuration} {item.serviceDurationType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fifth-decs-sec mt-32">
                <div className="fifth-decs-sec-wrap">
                  <ul className="nav nav-pills single-courses-tab">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        data-bs-toggle="pill"
                        data-bs-target="#description-content"
                      >
                        Description
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        onClick={handleReviewTabClick}
                        data-bs-toggle="pill"
                        data-bs-target="#review-content"
                      >
                        Review
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="description-content"
                    >
                      <div className="description-content-wrap mt-24">
                        <h3 className="des-con-txt1">Details</h3>
                        {pageLoading === true ? (
                          <Skeleton
                            variant="text"
                            width={300}
                            height={40}
                          ></Skeleton>
                        ) : (
                          <>
                            <p className="des-text">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: item.serviceDescription,
                                }}
                              ></div>
                            </p>
                          </>
                        )}

                        {auth ? (
                          <div className="des-buy-now-description">
                            <Link
                              className="buy-now"
                              to={`/applyproject/${projectId}`}
                            >
                              Apply Now
                            </Link>
                          </div>
                        ) : (
                          userData &&
                          item &&
                          item?.userRef?.id !== userData.uid && (
                            <div className="des-buy-now-description">
                              <button
                                disabled={pageLoading}
                                className="buy-now size-full "
                                onClick={handleBuyNowClick}
                              >
                                Buy Now
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="tab-pane fade" id="review-content">
                      <div className="review-content-wrap mt-24">
                        <h2 className="review-heading">What Our Users Say</h2>

                        {(item &&
                          userData &&
                          item?.userRef?.id !== userData.uid) && canReview && (
                            <>
                              <div className="review-form">
                                <textarea
                                  placeholder="Write your review here..."
                                  value={reviewText}
                                  onChange={(e) =>
                                    setReviewText(e.target.value)
                                  }
                                  className="review-textarea"
                                />
                                <div className="rating-input">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <span
                                      key={index}
                                      onClick={() => setRating(index + 1)}
                                    >
                                      {index < rating ? (
                                        <StarRateIcon
                                          sx={{ color: "#0a65fc" }}
                                        />
                                      ) : (
                                        <StarBorderIcon
                                          sx={{ color: "#0a65fc" }}
                                        />
                                      )}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  className="submit-review-btn"
                                  onClick={handleReviewSubmit}
                                >
                                  Submit Review
                                </button>
                              </div>
                            </>
                          )}

                        {showReviews && reviews.length > 0 ? (
                          <div className="review-list-container">
                            <div className="review-list">
                              {reviews.map((review) => (
                                <div className="review-item" key={review.id}>
                                  <img
                                    src={review.photoURL}
                                    alt={`${review.name}'s profile`}
                                    className="review-profile-pic"
                                  />
                                  <div className="review-details">
                                    <h4 className="review-name">
                                      {review.name}
                                    </h4>
                                    <p className="review-text">
                                      {review.review}
                                    </p>
                                    <div className="review-stars">
                                      {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                          <span key={index}>
                                            {index < review.rating ? (
                                              <StarRateIcon
                                                sx={{ color: "#0a65fc" }}
                                              />
                                            ) : (
                                              <StarBorderIcon
                                                sx={{ color: "#0a65fc" }}
                                              />
                                            )}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : <div className="w-full py-6 flex items-center justify-center">No reviews yet</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
