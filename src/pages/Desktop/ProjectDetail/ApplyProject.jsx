import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MdVideocam, MdLink } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import TimeIcon from "../../../assets/images/single-courses/time-icon.svg";
import FillStar from "../../../assets/images/single-courses/orange-fill-star.svg";
import StudentIcon from "../../../assets/images/single-courses/student-icon.svg";
import useSubmitProject from "../../../hooks/Auth/useSubmitProject"; // Import the custom hook
import Loading from "../../../components/Loading";
import useFetchProjectData from "../../../hooks/Auth/useFetchProjectData";

const ApplyProject = () => {
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [videoDemoUrl, setVideoDemoUrl] = useState("");
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projectData, loading, error } = useFetchProjectData(projectId);
  const { submitProject, loading: submitLoading } = useSubmitProject(); // Use the custom hook

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the hook's submit function and handle the response
    const success = await submitProject(
      deploymentUrl,
      githubUrl,
      videoDemoUrl,
      projectData?.realref
    );

    if (success) {
      navigate("/homescreen"); // Redirect on success
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="apply-project-conatainer">
   
   <div
                id="steps-section"
                className="des-steps-section bg-light p-4 rounded"
                style={{ marginBottom: "100px" }}
              >
                <p>
                  <strong>Step 1:</strong> Enter the{" "}
                  <strong>Deployment Link</strong> for the completed project.
                </p>
                <p>
                  <strong>Step 2:</strong> Provide the{" "}
                  <strong>GitHub Repository URL</strong> with the project code.
                </p>
                <p>
                  <strong>Step 3:</strong> Upload a <strong>Video Demo</strong>{" "}
                  showcasing the project and enter the URL.
                </p>
                <p>
                  <strong>Step 4:</strong> Click the submit button below to
                  complete your application.
                </p>
              </div>

   <div
   className="skill-project-section"
   >
       {/* Skill and Project Details Section */}
       <section id="project-details-section" className="mt-8 mb-8">
        <div className="container">
          <div className="skills-left-sec">
            <div className="first-left-sec">
              <div>{projectData?.skill || "Design"}</div>
            </div>
            <div className="first-left-sec">
              <div>{projectData?.skill || "UI/UX"}</div>
            </div>
            <div className="first-left-sec">
              <div>{projectData?.skill || "Figma"}</div>
            </div>
          </div>

          <div className="second-decs-sec-bottom">
            <div className="second-decs-sec-bottom-wrap">
              <div className="mt-12">
                <span className="student-img mr-8">
                  <img src={StudentIcon} alt="student-icon" />
                </span>
                <span className="second-txt2">
                  {projectData?.applications || "104.2k Applications"}
                </span>
              </div>
              <div className="mt-12">
                <span className="student-img mr-8 fillStar">
                  <img src={FillStar} alt="star-icon" />
                </span>
                <span className="second-txt2">
                  Level: {projectData?.level || "Medium"}
                </span>
              </div>
              <div className="mt-12">
                <span className="student-img mr-8">
                  <img src={TimeIcon} alt="time-icon" />
                </span>
                <span className="second-txt2">
                  {projectData?.time || "41h 30m"}
                </span>
              </div>
              <div className="mt-12">
                <span className="student-img mr-8">
                  <img src={TimeIcon} alt="due-date-icon" />
                </span>
                <span className="second-txt2">
                  Due: {projectData?.dueDate || "25-09-2024"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Project Form */}
      <section id="apply-project-content">
        <div className="container">
          <div className="sign-up-login-form mt-24">
            <form onSubmit={handleSubmit}>
              {/* Deployment Link Input */}
              <div className="apply-form-details mb-4">
                <span>
                  <MdLink size={24} /> {/* Deployment link icon */}
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

              {/* GitHub Repository URL Input */}
              <div className="apply-form-details mb-4">
                <span>
                  <FaGithub size={24} /> {/* GitHub icon */}
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

              {/* Video Demo URL Input */}
              <div className="apply-form-details mb-4">
                <span>
                  <MdVideocam size={24} /> {/* Video camera icon */}
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
             

              <div className="sumbit-project-description">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Project"}
                </button>
              </div>
              {/* Steps Section */}
          

              {/* Error Handling */}
              {error && <p className="error-message">{error}</p>}
              {loading && <p>Submitting...</p>}

              {/* Submit Button */}

             
            </form>
          </div>
        </div>
      </section>
   </div>
    </div>
  );
};

export default ApplyProject;
