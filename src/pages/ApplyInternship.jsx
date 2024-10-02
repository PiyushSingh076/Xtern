import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import useFetchInternshipData from '../hooks/Auth/useFetchInternshipData';
import StudentIcon from "../assets/images/single-courses/student-icon.svg";
import { MdVideocam, MdLink } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { Button } from "react-bootstrap";
import TimeIcon from "../assets/images/single-courses/time-icon.svg";
import FillStar from "../assets/images/single-courses/orange-fill-star.svg";
import useSubmitInternship from '../hooks/Auth/useSubmitInternship';

const ApplyInternship = () => {
    const [deploymentUrl, setDeploymentUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [videoDemoUrl, setVideoDemoUrl] = useState("");
    const navigate = useNavigate();
    const { internshipId } = useParams()
    const { internshipData, loading, error } = useFetchInternshipData(internshipId)
    const { submitInternship, loading: submitLoading } = useSubmitInternship();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call the hook's submit function and handle the response
        const success = await submitInternship(
            deploymentUrl,
            githubUrl,
            videoDemoUrl,
            internshipData?.jobref
        );

        if (success) {
            navigate("/homescreen"); // Redirect on success
        }
    };

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
                            <h3>Apply for Internship</h3>
                        </div>
                    </div>
                </div>
                <div className="border-bottom mb-3"></div>
            </header>
            {/* <!-- Header end --> */}


            {/* Skill and Internship Details Section */}
            <section id="project-details-section" className="mt-8 mb-8">
                <div className="container">
                    <div className="skills-left-sec">
                        {internshipData?.skills?.length > 0
                            ? internshipData.skills.map((skill, index) => (
                                <div key={index} className="first-left-sec">
                                    <div>{skill}</div>
                                </div>
                            ))
                            : ["Design", "UI/UX", "Figma"].map((defaultSkill, index) => (
                                <div key={index} className="first-left-sec">
                                    <div>{defaultSkill}</div>
                                </div>
                            ))}
                    </div>

                    <div className="second-decs-sec-bottom">
                        <div className="second-decs-sec-bottom-wrap">
                            <div className="mt-12">
                                <span className="student-img mr-8">
                                    <img src={StudentIcon} alt="student-icon" />
                                </span>
                                <span className="second-txt2">
                                    {internshipData?.applications || "104.2k Applications"}
                                </span>
                            </div>
                            <div className="mt-12">
                                <span className="student-img mr-8 fillStar">
                                    <img src={FillStar} alt="star-icon" />
                                </span>
                                <span className="second-txt2">
                                    Level: {internshipData?.level || "Medium"}
                                </span>
                            </div>
                            <div className="mt-12">
                                <span className="student-img mr-8">
                                    <img src={TimeIcon} alt="time-icon" />
                                </span>
                                <span className="second-txt2">
                                    {internshipData?.assessmentDuration || "41h 30m"}
                                </span>
                            </div>
                            <div className="mt-12">
                                <span className="student-img mr-8">
                                    <img src={TimeIcon} alt="due-date-icon" />
                                </span>
                                <span className="second-txt2">
                                    Due: {internshipData?.dueDate || "25-09-2024"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Apply Internship Form */}
            <section id="apply-project-content">
                <div className="container">
                    <div className="sign-up-login-form mt-24">
                        <form onSubmit={handleSubmit}>

                            <div className="apply-form-details mb-4">
                                <span>
                                    <MdLink size={24} />
                                </span>
                                <input
                                    type="text"
                                    id="deploymentUrl"
                                    value={deploymentUrl}
                                    onChange={(e) => setDeploymentUrl(e.target.value)}
                                    placeholder="Deployment Link (Output URL)"
                                    className="sign-in-custom-input"
                                />
                            </div>


                            <div className="apply-form-details mb-4">
                                <span>
                                    <FaGithub size={24} />
                                </span>
                                <input
                                    type="text"
                                    id="githubUrl"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="GitHub Repository URL"
                                    className="sign-in-custom-input"
                                />
                            </div>


                            <div className="apply-form-details mb-4">
                                <span>
                                    <MdVideocam size={24} />
                                </span>
                                <input
                                    type="text"
                                    id="videoDemoUrl"
                                    value={videoDemoUrl}
                                    onChange={(e) => setVideoDemoUrl(e.target.value)}
                                    placeholder="Video Demo URL"
                                    className="sign-in-custom-input"
                                />
                            </div>


                            <div
                                id="steps-section"
                                className="steps-section bg-light p-4 rounded mb-4"
                            >
                                <p>
                                    <strong>Step 1:</strong> Enter the{" "}
                                    <strong>Deployment Link</strong> for the completed assessment.
                                </p>
                                <p>
                                    <strong>Step 2:</strong> Provide the{" "}
                                    <strong>GitHub Repository URL</strong> with the assessment code.
                                </p>
                                <p>
                                    <strong>Step 3:</strong> Upload a <strong>Video Demo</strong>{" "}
                                    showcasing the assessment and enter the URL.
                                </p>
                                <p>
                                    <strong>Step 4:</strong> Click the submit button below to
                                    complete your application.
                                </p>
                            </div>


                            {error && <p className="error-message">{error}</p>}
                            {loading && <p>Submitting...</p>}


                            <div className="sign-up-btn mt-32">
                                <Button type="submit" className="px-5 py-3" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Internship"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ApplyInternship