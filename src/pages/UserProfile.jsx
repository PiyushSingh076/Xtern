import React, { useEffect, useState } from 'react';
import { Card, Tabs, Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';
import { collection, doc, getDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ProfileImg from "../assets/images/courses/profile-img.png";
import { FaBuilding } from "react-icons/fa6";

const UserProfile = () => {

    const [workExperiences, setWorkExperiences] = useState([]);
    const [userData, setUserData] = useState([]);

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate.seconds * 1000);
        const end = endDate ? new Date(endDate.seconds * 1000) : new Date();

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years > 0 ? `${years} year${years > 1 ? 's' : ''}` : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`.trim();
    };

    useEffect(() => {
        const fetchUserAndWorkerData = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                toast.error("User not authenticated");
                return;
            }
            const userUid = currentUser.uid;

            try {

                const userDocRef = doc(db, "users", userUid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data()); // Store user data in state
                } else {
                    toast.error("No user profile found.");
                }

                // Fetch the user document using the UID
                const userQuery = query(collection(db, "users"), where('uid', '==', userUid));
                const querySnapshot = await getDocs(userQuery);

                if (querySnapshot.empty) {
                    toast.warn("No user found."); // Using react-hot-toast for better UX
                    return;
                }

                querySnapshot.forEach(async (doc) => {
                    const userRef = doc.ref; // This is the user reference

                    // Now query the 'worker' collection where 'work' is equal to userRef
                    const workerQuery = query(collection(db, "worker"), where('work', '==', userRef));
                    const workerSnapshot = await getDocs(workerQuery);

                    const experiences = workerSnapshot.docs.map((workerDoc) => workerDoc.data());
                    setWorkExperiences(experiences);
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to retrieve user/worker data");
            }
        };

        fetchUserAndWorkerData(); // Call the async function

    }, []);

    const navigate = useNavigate();

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
                            <p>User Profile</p>
                        </div>
                    </div>
                </div>
                <div className="navbar-boder"></div>
            </header>
            {/* <!-- Header end --> */}

            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {/* Profile Card */}
                        <Card className="shadow-sm p-3 bg-white rounded-lg">
                            <Card.Body className="text-center">
                                <img src={ProfileImg}
                                    alt={userData.display_name || "profile image"}
                                />
                                <h4
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: "0.5rem",
                                        color: "#4a4a4a",
                                    }}
                                >
                                    {userData?.display_name}
                                </h4>
                                <p className="text-muted" style={{ fontSize: "1rem" }}>
                                    {userData?.typeUser}
                                </p>
                            </Card.Body>
                        </Card>
                        {/* Tabs Section */}
                        <Tabs defaultActiveKey="workExperience"
                            className="mt-5 mb-4"
                            fill
                            variant="pills"
                            style={{
                                backgroundColor: "#f8f9fa",
                                padding: "10px",
                                borderRadius: "10px",
                            }}>
                            {/* Work Experience Tab */}
                            <Tab eventKey="workExperience" title="Work Experience">
                                {workExperiences.length > 0 ? (
                                    workExperiences.map((experience, index) => (
                                        <Card className="mt-3 shadow-sm" key={index}>
                                            <Card.Body>
                                                <div className="d-flex align-items-center mb-2">
                                                    <FaBuilding style={{ fontSize: "1.5rem", color: "#0d6efd" }} />
                                                    <h6
                                                        className="mb-0 ms-2"
                                                        style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#0d6efd" }}
                                                    >
                                                        {experience.companyname || 'Company Name'}
                                                    </h6>
                                                </div>
                                                <p className="text-muted" style={{ fontSize: "1rem", fontWeight: "bolder" }}>
                                                    {experience.role || 'Job Title'}
                                                </p>
                                                <p style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                                                    {experience.description || 'Job Description'}
                                                </p>
                                                <p style={{ fontSize: "1rem", color: "#0d6efd" }}>
                                                    <small>
                                                        {experience.startdate
                                                            ? calculateDuration(experience.startdate, experience.enddate)
                                                            : 'Duration Unavailable'}
                                                    </small>
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No work experiences available.</p>
                                )}
                            </Tab>


                            {/* Education Tab */}
                            <Tab eventKey="education" title="Education">
                                <Card className="mt-3 shadow-sm">
                                    <Card.Body>
                                        <h6
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "1.2rem",
                                                color: "#4a4a4a",
                                            }}
                                        >
                                            Education details go here.
                                        </h6>
                                    </Card.Body>
                                </Card>
                            </Tab>

                            {/* Projects Tab */}
                            <Tab eventKey="projects" title="Projects">
                                <Card className="mt-3 shadow-sm">
                                    <Card.Body>
                                        <h6
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "1.2rem",
                                                color: "#4a4a4a",
                                            }}
                                        >
                                            Project details go here.
                                        </h6>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );

};

export default UserProfile;
