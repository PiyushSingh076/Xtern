import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchInternshipData from "../hooks/Auth/useFetchInternshipData";

const SingleJobDescription = () => {
    const [isBookmarked, setIsBookmarked] = useState(true);
    const [isBookmarkIcon, setIsBookmarkIcon] = useState(false);
    const navigate = useNavigate();
    const { internshipId } = useParams();
    const { internshipData, loading, error } = useFetchInternshipData(internshipId);
    const [activeTab, setActiveTab] = useState("description");
    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-danger text-center">Error loading internship details</div>;
    }

    if (!internshipData) {
        return <div className="text-center">No data available</div>;
    }


    return (
        <>
            {/* <!-- Header start --> */}
            <header id="top-header">
                <div className="container">
                    <div className="row align-items-center my-3">
                        <div className="col-2">
                            <button className="btn btn-light" onClick={handleBackClick}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15 18L9 12L15 6"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="col-8 text-center">
                            <h3>Internship Details</h3>
                        </div>
                    </div>
                </div>
                <div className="border-bottom mb-3"></div>
            </header>
            {/* <!-- Header end --> */}

            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4">
                        <div className="card h-100 shadow-sm">
                            {internshipData?.image && (
                                <img
                                    src={internshipData?.image}
                                    className="card-img-top"
                                    alt={internshipData?.companyName}
                                    style={{ height: "250px", objectFit: "cover" }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{internshipData?.companyName}</h5>
                                <p className="card-text">
                                    <strong>Location:</strong> {internshipData?.location}
                                </p>
                                <p className="card-text">
                                    <strong>Duration:</strong> {internshipData?.duration}
                                </p>

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
                                            id="assessment-tab-btn"
                                            data-bs-toggle="pill"
                                            data-bs-target="#assessment-content"
                                            type="button"
                                            role="tab"
                                            aria-selected="false"
                                        >
                                            Assessment
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content mt-3">
                                    <div className="tab-pane fade show active" id="description-content" role="tabpanel" aria-labelledby="description-tab-btn">
                                        <p className="card-text">{internshipData?.description}</p>
                                        <div className="mb-3">
                                            <h6 style={{ fontWeight: "bold" }}>Required Skills:</h6>
                                            <ul className="list-inline">
                                                {internshipData?.skills?.map((skill, index) => (
                                                    <li key={index} className="list-inline-item badge bg-secondary">
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="assessment-content" role="tabpanel" aria-labelledby="assessment-tab-btn">
                                        <h6>Assessment Details:</h6>
                                        <p>{internshipData?.assessmentDetail}</p>
                                        <p>
                                            <strong>Assessment Duration:</strong> {internshipData?.assessmentDuration}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="buy-now-description text-center mt-4">
                    <Link to={`/applyinternship/${internshipId}`} className="btn btn-primary btn-lg">
                        Apply Now
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SingleJobDescription;
