// Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserData from "../hooks/Auth/useFetchUserData";
import code from '../assets/svg/code.svg';
import { useSelector } from "react-redux";
import Slider from "react-slick";
import schedule from '../assets/svg/schedule.svg';
import medal from '../assets/svg/medal.png';
import dollar from '../assets/svg/dollar.svg';

const SingleMentor = () => {
    // State declarations
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
    const navigate = useNavigate();

    // Slider settings for the skills carousel
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Custom hooks and Redux state
    const { userData, loading, error } = useFetchUserData();
    const internInfo = useSelector((state) => state.internInfo);
    console.log(internInfo);

    // Event handlers
    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const toggleBookmarkedIcon = () => {
        setIsBookmarkedIcon(!isBookmarkedIcon);
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page in the history stack
    };

    return (
        <>
            {/* Header section */}
            <header id="top-header">
                <div className="container">
                    <div className="top-header-full">
                        {/* Back button */}
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
                        {/* Header title */}
                        <div className="header-title">
                            <p>Profile</p>
                        </div>
                    </div>
                </div>
                <div className="navbar-boder"></div>
            </header>

            {/* Main content section */}
            <section id="single-mentor-sec">
                <div className="container">
                    <h1 className="d-none">Hidden</h1>
                    <h2 className="d-none">Mentor</h2>
                    <div className="single-mentor-sec-wrap mt-32">
                        {/* Profile information */}
                        <div className="single-mentor-first-wrap">
                            <div className="mentor-img-sec">
                                {/* Medal section */}
                                <div className="mentor-medal-sec">
                                    <img src={medal} className="mentor-medal" width={'24px'} alt="medal" />
                                    <span>Bronze</span>
                                </div>
                                {/* Profile picture */}
                                <img src={userData?.profilePicture} alt="client-img" width={96} height={96}/>
                            </div>
                            {/* User details */}
                            <div className="single-mentor-details">
                                <h3>{userData?.display_name}</h3>
                                <h4 className="mt-12">Graduation Year: {internInfo?.graduationYear}</h4>
                                <p className="mt-16">{internInfo?.internType}</p>
                            </div>
                            {/* Action buttons */}
                            <div className="mentor-follow-sec">
                                {/* Schedule button */}
                                <div className="mentor-follow-btn" data-bs-toggle="modal" data-bs-target="#scheduleModal">
                                    <img src={schedule} width={'24px'} alt="schedule" />
                                </div>
              
                                {/* Schedule modal */}
                                <div className="modal fade" id="scheduleModal" tabIndex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="false">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="scheduleModalLabel">Schedule Interview</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <input type="date" className="form-control mb-3" />
                                                <input type="time" className="form-control mb-3" />
                                             
                                                <textarea className="form-control mb-3" placeholder="Additional Notes"></textarea>
                                                <button className="btn btn-primary">Schedule Interview</button>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment button */}
                                <div className="mentor-comment">
                                    <img src={dollar} width={'24px'} alt="dollar" />
                                </div>
                            </div>
                        </div>
                        <div className="navbar-boder mt-24"></div>

                        {/* Skills section */}
                        <div className="mentor-skill-sec">
                            <h3>Skills</h3>
                            <span>View all</span>
                        </div>
                       
                        {/* Skills carousel */}
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
             
                        {/* Tabs section */}
                        <div className="single-mentor-third-sec">
                            <div className="fifth-decs-sec mt-32">
                                <div className="fifth-decs-sec-wrap">
                                    {/* Tab navigation */}
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
                                                Education
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
                                    {/* Tab content */}
                                    <div className="tab-content" id="course-tab-btn">
                                        {/* Work Experience tab */}
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
                                        {/* Education tab */}
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
                                        {/* Projects tab */}
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
            {/* End of main content section */}
        </>
    );
};

export default SingleMentor;
