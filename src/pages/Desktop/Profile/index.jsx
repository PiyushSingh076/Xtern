// Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import code from '../../../assets/svg/code.svg'
import { useSelector } from "react-redux";
import Slider from "react-slick"
import schedule from '../../../assets/svg/schedule.svg'
import medal from '../../../assets/svg/medal.png'
import './Profile.css'

// Component definition
const SingleMentor = () => {
    // State declarations
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkedIcon, setIsBookmarkedIcon] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const navigate = useNavigate();
    
    // Slider settings
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // schedule interview modal
    const handleScheduleInterview = () => {
        alert('Schedule interview: ' + interviewDate);
    }
    

    // Hooks
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
        navigate(-1); // This will navigate to the previous page in the history stack
    };

 
    return (
        <div className="desktop-profile-container">
            {/* Profile details section */}
            <section id="profile-details-section">
                <div className="profile-details">
                    <div className="profile-details-wrap mt-32">
                        {/* Profile image and basic info */}
                        <div className="profile-details-first-wrap">
                            <div className="mentor-img-sec">
                                <div className="mentor-medal-sec">
                                    <img src={medal} className="mentor-medal" width={'24px'} alt="medal" />
                                    <span>Bronze</span>
                                </div>
                                <img src={userData?.profilePicture} alt="client-img" width={96} height={96}/>
                            </div>
                            <div className="profile-details-details">
                                <h1>{userData?.display_name}</h1>
                                <h4 className="mt-12">Graduation Year: {internInfo?.graduationYear}</h4>
                                <p className="mt-16">{internInfo?.internType}</p>
                            </div>
                        </div>
                        
                        {/* Skills section */}
                        <div className="profile-details-skill-sec">
                            <h3>Skills</h3>
                        </div>
                       
                        {/* Skills slider */}
                        <Slider {...settings}>
                            {internInfo?.skillSet.map((skill, index) => (
                                <div className="profile-details-second-wrap-sec" key={index}>
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
                        <div className="profile-details-third-sec">
                            <div className="fifth-decs-sec mt-32">
                                <div className="fifth-decs-sec-wrap">
                                    {/* Tab navigation */}
                                    <ul
                                        className="nav nav-pills profile-details-tab"
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
            {/* Similar profiles section */}
            <section id="similar-profiles-section">
                <div className="xtern-btn-sec">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#scheduleInterviewModal">
                        <img src={schedule} className="schedule-icon me-2" alt="schedule" width={20} height={20}/>
                        <span>Schedule an Interview</span>
                    </button>
                    <button className="btn btn-secondary ms-2">Subscribe Xtern+</button>
                </div>
                
                {/* Interview scheduling modal */}
                <div
                    style={{  marginTop: '40px'}} 
                    className="modal fade " id="scheduleInterviewModal" tabIndex="-1" aria-labelledby="scheduleInterviewModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="scheduleInterviewModalLabel">Schedule an Interview</h5>
                                <button  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <h6>Interview Date</h6>
                                    <input
                                    onChange={(e)=>setInterviewDate(e.target.value)}
                                    
                                     type="date" className="form-control mt-3" id="interviewDate" />
                                      <input type="time" className="form-control mb-3" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={handleScheduleInterview} type="button" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Similar profiles */}
                <div className="similar-profile-sec">
                    <h3>Other Similar Profiles</h3>
                    <div className="similar-profile-sec-wrap">
                        {[1,2,3,4,5].map((item) => (
                            <div key={item} className="similar-profile-sec-wrap-sec">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={userData?.profilePicture} alt="client-img" width={70} height={70} style={{ marginRight: '20px' }}/>
                                    <div>
                                        <h3>{userData?.display_name}</h3>
                                        <p>Graduation Year: {internInfo?.graduationYear}</p>
                                        <p>Intern Type: {internInfo?.internType}</p>
                                    </div>
                                </div>
                                <div className="view-profile-btn-sec">
                                    <button className="view-profile-btn"> + Connect</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleMentor;
