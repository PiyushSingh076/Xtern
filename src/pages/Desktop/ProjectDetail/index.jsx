import React, { useEffect, useState } from "react";
import BookmarkSvg from "../../../assets/svg/white-bookmark.svg";
import StarRateIcon from "@mui/icons-material/StarRate";
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
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Card, CardContent, Typography, IconButton, Grid, Box, Skeleton } from "@mui/material"
import { FiEdit } from "react-icons/fi";
import GroupIcon from "@mui/icons-material/Group"
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PersonIcon from "@mui/icons-material/Person"
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import Carousel from "react-material-ui-carousel";
import ReactPlayer from "react-player";
import Layout from "../../../components/SEO/Layout";
import EditServiceModal from './EditServiceModal';

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
  const [currentMedia, setCurrentMedia] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [serviceProvider, setServiceProvider] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setPageLoading(true);
      const serviceSnapshot = await getDoc(doc(db, "services", projectId));

      if (serviceSnapshot.exists()) {
        const serviceData = serviceSnapshot.data();
        setItem(serviceData);

        // Fetch service provider details
        if (serviceData.userRef) {
          const userDoc = await getDoc(serviceData.userRef);
          if (userDoc.exists()) {
            setServiceProvider(userDoc.data());
          }
        }
      }
      setPageLoading(false);
    };
    fetchItem();
    console.log('service provider', serviceProvider);

  }, []);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };


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

      let userName = userDoc.data().firstName;


      const reviewData = {
        name: userName,
        review: reviewText,
        rating,
        userId: userData.uid,
        serviceId: projectId,
        photoURL: userPhotoURL,
        timestamp: new Date(),
      };

      console.log("Submitting review:", reviewData);

      const reviewId = await saveReview(reviewData);

      setReviews((prevReviews) => [
        ...prevReviews,
        { id: reviewId, ...reviewData },
      ]);

      setReviewText("");
      setRating(0);
      setShowReviewForm(false);
      setCanReview(false);
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



      console.log("Reviews", userReviews);

      let counter = 0;
      userReviews.forEach((review) => {
        console.log(review.userId, userData.uid);
        if (review.userId !== userData.uid) {
          counter++;
        }
      });
      console.log("Counter", counter, userReviews.length);
      if (counter == userReviews.length) {
        setCanReview(true);
      }

      setReviews(userReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const [media, setMedia] = useState([]);
  useEffect(() => {
    if (item) {
      const newMedia = [];
      console.log("item", item);
      if (item.serviceVideo) {
        newMedia.push({
          type: "video",
          src: item.serviceVideo,
        });
      }

      if (item.images && item.images.length > 0) {
        item.images.forEach((image) => {
          newMedia.push({
            type: "image",
            src: image,
          });
        });
      }

      console.log("newMedia", newMedia);
      setMedia(newMedia); // Directly set new media instead of merging

    }
  }, [item]);

  const handleSaveSuccess = (updatedService) => {
    // Update the local state with new service data
    setItem(prev => ({
      ...prev,
      ...updatedService
    }));
    // Close the modal
    setEditModalOpen(false);
  };


  return (
    <>
    <Layout title={item?.serviceName? item.serviceName : "User Service"} />
    <div className="des-project-detail-container max-h-screen overflow-y-auto">
      <ViewModal
        open={modalOpen}
        media={media}
        onClose={() => setModalOpen(false)}
        current={currentMedia}
      />
      
      <section id="single-description-screen1">
        <div className="des-first-desc-img-sec !m-0 !px-4 !flex !flex-col md:!flex-row gap-6">
          
          {/* Left Column - Media and Service Provider */}
          <div className="hero-img-desc w-full md:w-1/2">
            <div className="d-flex justify-content-center">
              <div className="rounded-md w-full md:w-[400px] h-fit overflow-hidden relative">
                {pageLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={225} className="rounded-md" />
                ) : (
                  Array.isArray(media) && media.length > 0 ? (
                    <Carousel
                      onChange={(e) => setCurrentMedia(e)}
                      autoPlay={false}
                      navButtonsAlwaysVisible
                      animation="slide"
                      className="w-full md:w-[400px] h-fit rounded-md"
                    >
                    {media.map((mediaItem, index) => (
                      <div
                        key={`image-slide-${index}`}
                        className="w-full rounded-md aspect-[16/9] flex items-center justify-center relative overflow-hidden"
                      >
                        <div
                          onClick={() => setModalOpen(true)}
                          className="size-full group z-50 bg-black/0 hover:bg-black/20 transition-all text-xl font-medium text-transparent hover:text-white left-0 top-0 flex items-center justify-center cursor-pointer"
                        >
                          <div className="">View</div>
                        </div>
                        {mediaItem.type === "video" ? (
                          <video
                            muted
                            autoPlay
                            loop
                            src={mediaItem.src}
                            className="absolute size-full object-cover left-0 top-0 !m-0"
                            alt={`Slide ${index + 1}`}
                          />
                        ) : (
                          <img
                            src={mediaItem.src}
                            className="absolute size-full object-cover left-0 top-0"
                            alt={`Slide ${index + 1}`}
                          />
                        )}
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    No Video/Images Available
                  </div>
                )
                )}
              </div>
            </div>

            {/* Service Provider Card Below Media */}
            {pageLoading ? (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-md">
                <Skeleton variant="text" width={150} height={32} className="mx-auto mb-4" />
                <div className="flex items-start gap-4">
                  <Skeleton variant="circular" width={64} height={64} />
                  <div className="flex flex-col flex-grow">
                    <Skeleton variant="text" width={150} height={24} />
                    <Skeleton variant="text" width={200} height={20} />
                  </div>
                </div>
              </div>
            ) : serviceProvider && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-md">
                <Typography variant="h6" className="font-medium text-center mb-4">
                  Service Provider
                </Typography>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    {serviceProvider.photo_url ? (
                      <img
                        src={serviceProvider.photo_url || "/placeholder.svg"}
                        alt={serviceProvider.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <PersonIcon className="text-gray-400" fontSize="large" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Typography variant="subtitle1" className="font-medium">
                      {serviceProvider.display_name}
                    </Typography>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2">
                        {serviceProvider.state || "Location not specified"}, {serviceProvider.city}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            )}

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




           {/* Right Column - Description */}
           <div className="desc-container !min-w-0 !w-full md:w-1/2">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="relative mb-4">
                  {pageLoading ? (
                    <Box>
                      <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
                        <div className="flex-grow">
                          <Skeleton variant="text" width={300} height={48} />
                        </div>
                        <div className="w-full md:w-auto">
                          <Skeleton variant="text" width={100} height={40} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <Skeleton variant="text" width={120} height={24} />
                        <Skeleton variant="text" width={120} height={24} />
                      </div>
                    </Box>
                  ) : (
                    <Box>
                      <div className="flex justify-between items-start gap-4 flex-wrap md:flex-nowrap">
                        {/* Service Name and Edit Button */}
                        <div className="relative mb-2 flex-grow">
                          <Typography variant="h4" component="h1" className="pr-10 font-bold">
                            {item.serviceName}
                            {userData && item && userData.uid === item.userRef?.id && (
                              <IconButton
                                onClick={handleEditClick}
                                className="absolute -top-2 right-0 text-blue-500 hover:text-blue-700"
                                size="small"
                              >
                                <FiEdit color="blue" size={20} />
                              </IconButton>
                            )}
                          </Typography>
                        </div>

                        {/* Price - Now aligned to the right */}
                        <div className="w-full md:w-auto">
                          <Typography variant="h5" className="text-primary font-bold">
                            ₹{item.servicePrice}
                          </Typography>
                        </div>
                      </div>

                      {/* Stats row - Full width on mobile, aligned below title and price */}
                      <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <GroupIcon sx={{ color: "#0a65fc" }} />
                          <Typography variant="body2">0 Application</Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <AccessTimeFilledIcon sx={{ color: "#0a65fc" }} />
                          <Typography variant="body2">
                            {item.duration} {item.durationType}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  )}
                </div>
              </Grid>
            </Grid>



             {/* Description Tabs */}
            {pageLoading ? (
              <div className="mt-8">
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="rectangular" height={200} className="mt-4" />
              </div>
            ) : (
              <div className="fifth-decs-sec mt-8">
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

                      {item &&
                        userData &&
                        item?.userRef?.id !== userData.uid &&
                        canReview && (
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
                      ) : (
                        <div className="w-full py-6 flex items-center justify-center">
                          No reviews yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
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

      <EditServiceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        service={item}
        serviceId={projectId}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
    </>
  );
};

const ViewModal = ({ href, isVideo, open, onClose, media, current }) => {
  return (
    <>
      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "65vw",
              maxWidth: "100vw", // Set your width here
            },
          },
        }}
        className="!max-w-[100vw]"
        open={open}
        onClose={onClose}
      >
        <DialogTitle>View </DialogTitle>
        <DialogContent className="!max-w-[100vw] flex items-center justify-center">
          <div className="!w-[60vw]  h-fit min-h-[60vh]">
            <Carousel
              index={current}
              onChange={(e) => console.log(e)}
              autoPlay={false}
              navButtonsAlwaysVisible
              animation="slide"
              className="w-full  h-fit rounded-md"
            >
              {Array.isArray(media) &&
                media.length > 0 &&
                media.map((mediaItem, index) => (
                  <div
                    key={`image-slide-modal-${index}`}
                    className="w-full rounded-md aspect-[16/9] flex items-center justify-center relative overflow-hidden"
                  >
                    {mediaItem.type === "video" && (
                      <video
                        controls
                        src={mediaItem.src}

                        className="!absolute !size-full !object-cover !max-w-[100vw] !left-0 !top-0 !m-0"
                        alt={`Slide ${index + 1}`}
                      />
                      // <ReactPlayer style={{ width: "100%", height: "100%", margin: 0 }} controls url={mediaItem.src} ></ReactPlayer>
                    )}
                    {mediaItem.type === "image" && (
                      <img
                        src={mediaItem.src}
                        className="absolute size-full object-cover left-0 top-0"
                        alt={`Slide ${index + 1}`}
                      />
                    )}
                  </div>
                ))}
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDetails;
