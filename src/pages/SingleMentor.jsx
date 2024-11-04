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
import { Link, useNavigate, useParams } from "react-router-dom";
import useUserProfileData from "../hooks/Profile/useUserProfileData";
import code from "../assets/svg/code.svg";

const SingleMentor = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
  const navigate = useNavigate();

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleBookmarkedIcon = () => {
    setIsBookmarkedIcon(!isBookmarkedIcon);
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page in the history stack
  };
  const { uid } = useParams();

  const { userData, loading, error } = useUserProfileData(uid);
  console.log(userData, "lllllllllll");
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
              <p>Mentor</p>
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
                <img
                  src={userData?.photo_url || ClientImg}
                  alt="client-img"
                  height={80}
                  width={80}
                />
              </div>
              <div className="single-mentor-details">
                <h3>{userData?.display_name || "Claire Joe"}</h3>
                <h4 className="mt-12">
                  Graduation Year : {userData?.gradYear || "2024"}{" "}
                </h4>
                <p className="mt-16">{userData?.role || "Intern"}</p>
              </div>
              <div className="mentor-follow-sec">
                {/* <div className="mentor-follow-btn">
                  <img src={FollowBtnIcon} alt="follow-btn" />
                </div>
                <div className="mentor-comment">
                  <img src={CommentIcon} alt="follow-btn" />
                </div> */}
              </div>
            </div>
            <div className="navbar-boder mt-24"></div>
            {/* <div className="single-mentor-second-wrap-sec mt-24">
              <div className="single-mentor-second-wrap">
                <div className="mentor-icon purple-bg">
                  <img src={CourseIcon} alt="course-icon" />
                </div>
                <div className="mentor-content-single mt-12">
                  <h3>2</h3>
                  <p>Courses</p>
                </div>
              </div>
              <div className="single-mentor-second-wrap">
                <div className="mentor-icon green-bg">
                  <img src={ExperienceIcon} alt="experience-icon" />
                </div>
                <div className="mentor-content-single mt-12">
                  <h3>10+</h3>
                  <p>Experience</p>
                </div>
              </div>
              <div className="single-mentor-second-wrap">
                <div className="mentor-icon pink-bg">
                  <img src={StudentIcon} alt="student-icon" />
                </div>
                <div className="mentor-content-single mt-12">
                  <h3>245k</h3>
                  <p>Students</p>
                </div>
              </div>
              <div className="single-mentor-second-wrap">
                <div className="mentor-icon orange-bg">
                  <img src={RatingIcon} alt="rating-icon" />
                </div>
                <div className="mentor-content-single mt-12">
                  <h3>4.8</h3>
                  <p>Rating</p>
                </div>
              </div>
            </div> */}

            <div className="single-mentor-second-wrap-sec mt-24">
              {userData?.skillSet?.map((skill, index) => (
                <div className="single-mentor-second-wrap" key={index}>
                  <div
                    className={`mentor-icon ${
                      ["purple-bg", "green-bg", "pink-bg", "orange-bg"][
                        index % 4
                      ]
                    }`}
                  >
                    <img src={code} alt={`${skill.skill}-icon`} width="30px" />
                  </div>
                  <div className="mentor-content-single mt-12">
                    <h3>{skill?.skill}</h3>
                    <p>{skill?.rating}</p>
                  </div>
                </div>
              ))}
            </div>
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
                        Projects
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
                        Education
                      </button>
                    </li>
                  </ul>
                  {/* <div className="tab-content" id="course-tab-btn">
                    <div
                      className="tab-pane fade show active mt-16"
                      id="course-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <div className="mentor-course-tab-wrap">
                        <div className="checkout-screen-top">
                          <div className="checkout-first">
                            <img src={CourseImg1} alt="social-media-img" />
                          </div>
                          <div className="checkout-second">
                            <div className="checkout-second-wrap">
                              <div className="checkout-design">
                                <p>Development</p>
                              </div>
                              <div className="checkout-bookmark">
                                <div className="checkout-bookmark-sec">
                                  <a
                                    href=""
                                    className={`item-bookmark ${
                                      isBookmarked ? "active" : ""
                                    }`}
                                    onClick={toggleBookmark}
                                    tabIndex="0"
                                  >
                                    <img
                                      src={BookmarkUnfillSvg}
                                      alt="bookmark-icon"
                                    />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="mt-12">
                              <h1 className="check-txt1">
                                The Complete 2023 Fullstack Web Developer Course
                              </h1>
                            </div>
                            <div className="checkout-second-third mt-12">
                              <div>
                                <span className="check-txt2">$170.00</span>
                              </div>
                              <div>
                                <span>
                                  <img src={TimeIcon} alt="time-icon" />
                                </span>
                                <span className="check-txt4">3h 30m</span>
                              </div>
                            </div>
                            <div className="checkout-second-fourth">
                              <div>
                                <span>
                                  <img src={FillStar} alt="star-img" />
                                </span>
                                <span className="check-txt5">
                                  4.3 (3.7k ratings) | 104.2k students
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="checkout-screen-top mt-16">
                          <div className="checkout-first">
                            <img src={CourseImg2} alt="social-media-img" />
                          </div>
                          <div className="checkout-second">
                            <div className="checkout-second-wrap">
                              <div className="checkout-design">
                                <p>Development</p>
                              </div>
                              <div className="checkout-bookmark">
                                <div className="checkout-bookmark-sec">
                                  <a
                                    href=""
                                    className={`item-bookmark ${
                                      isBookmarkedIcon ? "active" : ""
                                    }`}
                                    onClick={toggleBookmarkedIcon}
                                    tabIndex="0"
                                  >
                                    <img
                                      src={BookmarkUnfillSvg}
                                      alt="bookmark-icon"
                                    />
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="mt-12">
                              <h1 className="check-txt1">
                                Kids Coding - Introduction to HTML, CSS and
                                JavaScript!
                              </h1>
                            </div>
                            <div className="checkout-second-third mt-12">
                              <div>
                                <span className="check-txt2">$210.00</span>
                              </div>
                              <div>
                                <span>
                                  <img src={TimeIcon} alt="time-icon" />
                                </span>
                                <span className="check-txt4">6h 40m</span>
                              </div>
                            </div>
                            <div className="checkout-second-fourth">
                              <div>
                                <span>
                                  <img src={FillStar} alt="star-img" />
                                </span>
                                <span className="check-txt5">
                                  4.6 (2.1k ratings) | 86.7k students
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <div className="tab-content" id="course-tab-btn">
                    <div
                      className="tab-pane fade show active mt-16"
                      id="course-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      {userData?.workExperience?.map((work, index) => {
                        const startDate = new Date(
                          work.startdate.seconds * 1000
                        );
                        const startDateFormatted = startDate.toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        );

                        return (
                          <div
                            className="mentor-course-tab-wrap"
                            key={work.role + work.companyname}
                          >
                            <div className="checkout-screen-top mt-16">
                              <div className="checkout-first d-flex justify-content-center align-items-center">
                                <img
                                  src={work.logo || CourseImg1}
                                  alt={`${work.companyname}-img`}
                                  className="img-fluid rounded" // Ensures the image scales nicely
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                  }} // Controls the size
                                />
                              </div>

                              <div className="checkout-second">
                                <div className="checkout-second-wrap">
                                  <div className="checkout-design">
                                    <p>{work.companyname}</p>
                                  </div>
                                  <div className="checkout-bookmark">
                                    {/* <div className="checkout-bookmark-sec">
                                      <a
                                        href=""
                                        className={`item-bookmark ${
                                          work.isBookmarked ? "active" : ""
                                        }`}
                                        onClick={() => toggleBookmark(index)}
                                        tabIndex="0"
                                      >
                                        <img
                                          src={BookmarkUnfillSvg}
                                          alt="bookmark-icon"
                                        />
                                      </a>
                                    </div> */}
                                  </div>
                                </div>
                                <div className="mt-12">
                                  <h1 className="check-txt1">{work.role}</h1>
                                </div>
                                <div className="checkout-second-third mt-12">
                                  <div>
                                    <button
                                      className="desc-btn mt-12"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapse-${index}`}
                                      aria-expanded="false"
                                      aria-controls={`collapse-${index}`}
                                    >
                                      View Description
                                    </button>
                                  </div>
                                  <div>
                                    <span>
                                      <img src={TimeIcon} alt="time-icon" />
                                    </span>
                                    <span className="check-txt4">
                                      {startDateFormatted} - August 2022
                                    </span>
                                  </div>
                                </div>
                                {/* <div className="checkout-second-fourth">
                                  <Link to={project.link} className="link-btn">
                                    Live Link
                                  </Link>
                                </div> */}

                                <div
                                  style={{ marginTop: "10px" }}
                                  id={`collapse-${index}`}
                                  className="collapse"
                                  aria-labelledby={`collapse-${index}`}
                                >
                                  <div className="card card-body">
                                    {work.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="tab-content" id="student-tabContent">
                    <div
                      className="tab-pane fade show"
                      id="student-content"
                      role="tabpanel"
                      tabIndex="0"
                    >
                      <div className="mentor-student-wrap">
                        {userData?.projectDetails.map((project, index) => {
                          return (
                            <div
                              className="mentor-course-tab-wrap mt-16"
                              key={`${
                                project.projectname || "Project"
                              }-${index}`}
                            >
                              <div className="checkout-screen-top mt-16 ">
                                <div className="checkout-first d-flex justify-content-center align-items-center">
                                  <img
                                    src={project.logo || CourseImg1} // Assume CourseImg1 is a placeholder image
                                    alt={`${
                                      project.projectname || "Project"
                                    }-img`}
                                    className="img-fluid rounded border border-secondary"
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                    }}
                                  />
                                </div>

                                <div className="checkout-second">
                                  <div className="checkout-second-wrap ">
                                    <div className="checkout-design d-flex gap-3 ">
                                      {project.techstack &&
                                      project.techstack.length > 0 ? (
                                        project.techstack.map(
                                          (tech, techIndex) => (
                                            <p className="mr-2" key={techIndex}>
                                              {tech}
                                            </p>
                                          )
                                        )
                                      ) : (
                                        <span>Skills not specified</span>
                                      )}
                                    </div>

                                    <div className="checkout-bookmark">
                                      <Link
                                        to={project.link}
                                        className="link-btn"
                                      >
                                        Live Link
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="mt-12">
                                    <h1 className="check-txt1">
                                      {project.projectname ||
                                        "Name Not Specified"}
                                    </h1>
                                  </div>
                                  {/* <div className="checkout-second-fourth ">
                                    <p
                                      onClick={() => navigate(project.link)}
                                      className="text-primary"
                                    >
                                      Live Link
                                    </p>
                                  </div> */}
                                  <div className="checkout-second-third mt-12">
                                    <div>
                                      <button
                                        className="desc-btn mt-12"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${index}`}
                                      >
                                        View Description
                                      </button>
                                    </div>
                                    <div>
                                      <span>
                                        <img src={TimeIcon} alt="time-icon" />
                                      </span>
                                      <span className="check-txt4">
                                        {project.startYear ||
                                          "Start Year Unknown"}{" "}
                                        - {project.endYear || "Present"}
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    style={{ marginTop: "10px" }}
                                    id={`collapse-${index}`}
                                    className="collapse"
                                    aria-labelledby={`collapse-${index}`}
                                  >
                                    <div className="card card-body">
                                      {project.description ||
                                        "No description available"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                      {userData?.educationDetails.map((educ, index) => (
                        <div className="mentor-course-tab-wrap" key={index}>
                          <div className="checkout-screen-top mt-16">
                            <div className="checkout-first d-flex justify-content-center align-items-center">
                              <img
                                src={educ.logo || CourseImg1} // Assume CourseImg1 as placeholder for institution logo
                                alt={`${educ.collegename || "Institution"}-img`}
                                className="img-fluid"
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                }}
                              />
                            </div>

                            <div className="checkout-second">
                              <div className="checkout-second-wrap">
                                <div className="checkout-design">
                                  <p>{educ.degree || "Institution Name"}</p>
                                </div>
                              </div>
                              <div className="mt-12">
                                <h1 className="check-txt1">
                                  {educ.collegename || "Degree Not Specified"}
                                </h1>
                              </div>
                              <div className="checkout-second-third mt-12">
                                <div>
                                  <span>
                                    Stream: {educ.branch || "Not Specified"}
                                  </span>
                                </div>
                                <div>
                                  <span>
                                    <img src={TimeIcon} alt="time-icon" />
                                  </span>
                                  <span className="check-txt4">
                                    Batch: {educ.startyear || "N/A"} -{" "}
                                    {educ.endyear || "Present"}
                                  </span>
                                </div>
                              </div>

                              <div
                                style={{ marginTop: "10px" }}
                                id={`collapse-${index}`}
                                className="collapse"
                                aria-labelledby={`collapse-${index}`}
                              >
                                <div className="card card-body">
                                  {educ.description ||
                                    "No additional information available"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
