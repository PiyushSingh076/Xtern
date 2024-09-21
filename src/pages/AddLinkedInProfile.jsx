import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";

const AddLinkedInProfile = () => {
    const navigate = useNavigate();

    const [linkedinURL, setLinkedinURL] = useState(
        ''
    );

    const handleContinue = () => {
        // Handle the Continue button click
        console.log('LinkedIn URL Submitted:', linkedinURL);
    };

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page in the history stack
    };
    return (
        <>
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
                            <p>Add LinkedIn Profile</p>
                        </div>
                    </div>
                </div>
                <div className="navbar-boder"></div>
            </header>
            <div className="container mt-4">
                {/* Step Indicator */}
                <div className="d-flex justify-content-between mb-3">
                    <div className="text-center">
                        <span className="badge bg-success rounded-pill">1</span>
                        <p>Match Preference</p>
                    </div>
                    <div className="text-center">
                        <span className="badge bg-primary rounded-pill">2</span>
                        <p>Profile Details</p>
                    </div>
                </div>

                {/* Instruction Section */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">
                            Automatic <span className="text-primary">LinkedIn</span> Import
                        </h5>
                        <p>
                            1. Please navigate to your LinkedIn profile page. <br />
                            2. Click on 'Share Profile' to copy the link. <br />
                            3. Please paste your profile ID in the URL.
                        </p>
                        <p className="text-danger">This cannot be changed later</p>

                        {/* Image Placeholder for LinkedIn Screenshot */}
                        <div className="mb-3">
                            <img
                                src="https://via.placeholder.com/400x150"
                                alt="LinkedIn Profile Example"
                                className="img-fluid rounded"
                            />
                            <p className="text-center">Step 1</p>
                        </div>

                        {/* Input Field for LinkedIn URL */}
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={linkedinURL}
                                onChange={(e) => setLinkedinURL(e.target.value)}
                                placeholder="https://www.linkedin.com/in/your-profile-id"
                            />
                        </div>

                        {/* Continue Button */}
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddLinkedInProfile;
