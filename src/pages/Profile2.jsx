import React, { useState } from "react";
import ClientImg from "../assets/images/single-mentor/client-img.png";
import CommentIcon from "../assets/images/single-mentor/comment-icon.svg";
import FollowBtnIcon from "../assets/images/single-mentor/follow-btn-icon.svg";
import CourseIcon from "../assets/images/single-mentor/course-icon.svg";
import ExperienceIcon from "../assets/images/single-mentor/experience-icon.svg";
import StudentIcon from "../assets/images/single-mentor/student-icon.svg";
import RatingIcon from "../assets/images/single-mentor/rating-icon.svg";
import TimeIcon from "../assets/images/checkout-screen/time-icon.svg";
import BookmarkUnfillSvg from "../assets/images/single-courses/bookmark-unfill.svg";
import StudentImg1 from "../assets/images/single-mentor/student1.png";
import StudentImg2 from "../assets/images/single-mentor/student2.png";
import StudentImg3 from "../assets/images/single-mentor/student3.png";
import StudentImg4 from "../assets/images/single-mentor/student4.png";
import ClientImg1 from "../assets/images/single-courses/client1.png";
import ClientImg2 from "../assets/images/single-courses/client2.png";
import OrangeStar from "../assets/images/single-courses/orange-star.svg";
import FillStar from "../assets/images/single-courses/orange-fill-star.svg";
import OrangeStarUnfill from "../assets/images/single-courses/orange-star-unfill.svg";
import CourseImg1 from "../assets/images/single-mentor/course1.png";
import CourseImg2 from "../assets/images/single-mentor/course2.png";
import LikeIcon from "../assets/images/single-courses/like-icon.svg";
import DislikeIcon from "../assets/images/single-courses/dislike-icon.svg";
import { useNavigate } from "react-router-dom";
import useFetchUserData from "../hooks/Auth/useFetchUserData";
import code from '../assets/svg/code.svg'
import { useSelector } from "react-redux";
import Slider from "react-slick"
import schedule from '../assets/svg/schedule.svg'
import medal from '../assets/svg/medal.png'

const SingleMentor = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const navigate = useNavigate();
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const { userData, loading, error } = useFetchUserData();
  const internInfo = useSelector((state) => state.internInfo);
  console.log(internInfo);
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkedIcon = () => {
    setIsBookmarkedIcon(!isBookmarkedIcon);
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };
  return (
    <>
      {/* <!-- Header start --> */}
      <header id="top-header">
        <div className="container">
          <div className="top-header-full">
            <div className="back-btn">
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
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            <div className="header-title">
              <p>Profile</p>
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>
      {/* <!-- Header end --> */}
      {/* <!-- Single mentor screen content start --> */}
      <section id="single-mentor-sec">
        <div className="container">
          <h1 className="d-none">Hideen</h1>
          <h2 className="d-none">Mentor</h2>
          <div className="single-mentor-sec-wrap mt-32">
            <div className="single-mentor-first-wrap">
              <div className="mentor-img-sec">
               <div className="mentor-medal-sec">
               <img src={medal} className="mentor-medal" width={'24px'} alt="medal" />
               <span>Bronze</span>
               </div>
                <img src={userData?.profilePicture} alt="client-img" width={96} height={96}/>
              </div>
              <div className="single-mentor-details">
                <h3>{userData?.display_name}</h3>
                <h4 className="mt-12">Gradution Year: {internInfo?.graduationYear}</h4>
                <p className="mt-16">{internInfo?.internType}</p>
              </div>
              <div className="mentor-follow-sec">
                <div className="mentor-follow-btn">
                  <img src={schedule} width={'24px'} alt="schedule" />
                </div>
                <div className="mentor-comment">
                 Subscribe
                </div>
              </div>
            </div>
            <div className="navbar-boder mt-24"></div>

            <div className="mentor-skill-sec">
                <h3>Skills</h3>
                <span>View all</span>
            </div>
           
            <Slider {...settings}>
      {internInfo?.skillSet.map((skill, index) => (
        <div className="single-mentor-second-wrap-sec" key={index}>
          <div className={`mentor-icon ${['purple-bg', 'green-bg', 'pink-bg', 'orange-bg'][index % 4]}`}>
            <img width={'30px'} src={code} alt={`${skill.skillset}-icon`} />
          </div>
          <div className="mentor-content-single mt-12">
            <h3>{skill.skillset}</h3>
            <p>{skill.rating}</p>
          </div>
        </div>
      ))}
    </Slider>
 
            <div className="single-mentor-third-sec">
              <div className="fifth-decs-sec mt-32">
                <div className="fifth-decs-sec-wrap">
                  <ul
                    className="nav nav-pills single-mentor-tab"
                    id="mentor-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="mentor-course-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#course-content"
                        type="button"
                        role="tab"
                        aria-selected="true"
                      >
                        Work Experience
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="student-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#student-content"
                        type="button"
                        role="tab"
                        aria-selected="false"
                        tabIndex="-1"
                      >
                        Eduction
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="reviews-tab-btn"
                        data-bs-toggle="pill"
                        data-bs-target="#reviews-content"
                        type="button"
                        role="tab"
                        aria-selected="false"
                        tabIndex="-1"
                      >
                        Projects
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="course-tab-btn">
                    <div
                      className="tab-pane fade show active mt-16"
                      id="course-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                       <div className="experience-sec">
                       <h4>Software Developer Intern</h4>
                        <p>TechCorp Inc. | June 2022 - August 2022</p>
                        <ul>
            
                        </ul>
                       </div>

                    </div>
                  </div>
                  <div className="tab-content" id="student-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="student-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                        <div className="experience-sec">
                            <h4>B.E(Computer Science)</h4>
                            <p>Chandigarh University </p>
                            <p> Expected Graduation: May 2024</p>
                            <span>CGPA: 8.5</span>
                            
                                
                         
                        </div>
                    </div>
                  </div>
                  <div className="tab-content" id="review-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="reviews-content"
                      role="tabpanel"
                      tabIndex="0"
                      aria-labelledby="reviews-tab-btn"
                    >
                        <div className="experience-sec">
                            <h4>E-commerce Website</h4>
                            <p>Developed a full-stack e-commerce website using MERN stack</p>
                        </div>

                        <div className="experience-sec">
                            <h4>Social Media App</h4>
                            <p>Developed a social media app using React and Firebase</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Single mentor screen content end --> */}
    </>
  );
};
export default SingleMentor;
