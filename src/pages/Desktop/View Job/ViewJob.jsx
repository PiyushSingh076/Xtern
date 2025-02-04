import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Box,
  Skeleton,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Layout from "../../../components/SEO/Layout";
import HeaderImg from "../../../assets/images/single-courses/header-img.png";

import StudentIcon from "../../../assets/images/single-courses/student-icon.svg";
import TimeIcon from "../../../assets/images/single-courses/time-icon.svg";

import AccessTime from "@mui/icons-material/AccessTime";
import Schedule from "@mui/icons-material/Schedule";
import { LocationSearchingRounded } from "@mui/icons-material";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import toast from "react-hot-toast";

const SingleJob = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userData } = useFetchUserData();

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      try {
        const jobDoc = await getDoc(doc(db, "jobPosting", jobId));
        if (jobDoc.exists()) {
          if (jobDoc.data().createdBy !== userData.uid) {
            toast.error("Page does not exist");
            navigate("/homescreen");
          }
          setJob(jobDoc.data());
        } else {
          toast.error("Job not found.");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchJob();
    }
  }, [jobId, userData]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Job not found</Typography>
      </Container>
    );
  }

  return (
    <>
    <Layout
     title={"Viewjob"}
         description={"Browse and Explore Job Opportunities"}
         keywords={"View Jobs, Job Listings, Career Opportunities, Employment, Hiring"}/>
      <section id="single-description-screen">
        <div className="container !shadow-none !border-none !bg-white !max-w-full mx-8">
          <Grid container spacing={2}>
            <div className="flex flex-col px-4 !items-center">
              <div className="hero-img-desc !w-full md:!w-fit !flex-row !flex !items-center !justify-center">
                <img
                  src={job.image || HeaderImg}
                  alt="social-media-img"
                  height="350"
                  width="350"
                  className="img-fluid"
                />
              </div>
              <div className="second-decs-sec-bottom-wrap !grid !grid-cols-2 w-full">
                <div className="mt-12 flex items-center">
                  <span className="student-img mr-8">
                    <img src={StudentIcon} alt="student-icon" />
                  </span>
                  <span className="second-txt2">
                    {job.applicants.length}{" "}
                    <span className="hidden sm:inline">Applicants</span>
                  </span>
                </div>
                <div className="mt-12 flex items-center">
                  <span className="student-img mr-8 fillStar">
                    <LocationSearchingRounded fontSize="small"></LocationSearchingRounded>
                  </span>
                  <span className="second-txt2">{job.location}</span>
                </div>
                <div className="mt-12 flex items-center">
                  <span className="student-img mr-8">
                    <img src={TimeIcon} alt="student-icon" />
                  </span>
                  <span className="second-txt2">
                    Assessment: {job.assessmentDuration} days
                  </span>
                </div>
                <div className="mt-12 flex items-center">
                  <span className="student-img mr-8">
                    <img src={TimeIcon} alt="student-icon" />
                  </span>
                  <span className="second-txt2">Duration: {job.duration} months</span>
                </div>
              </div>
            </div>
            <Grid item xs={12} md={8}>
              <div className="single-courses-description">
                <div className="first-decs-sec mt-1  sm:mt-16">
                  <div className="first-decs-sec-wrap"></div>
                </div>
                <div className="second-decs-sec mt-2 sm:mt-16">
                  <div className="second-decs-sec-wrap">
                    <div className="second-decs-sec-top">
                      <h1 className="second-txt1">
                        {job.title} <span className="font-normal">at</span>{" "}
                        {job.companyName}
                      </h1>
                    </div>
                    <div className="skills-left-sec !flex !flex-wrap my-2">
                      {job.skills && job.skills.length > 0 ? (
                        <>
                          {job.skills.map((skill, index) => (
                            <Chip key={index + "view-job-skill"} label={skill}>
                              {skill}
                            </Chip>
                          ))}
                        </>
                      ) : (
                        <div>No skills available</div>
                      )}
                    </div>

                    <div className="second-decs-sec-bottom"></div>
                  </div>
                </div>
                <div className="third-decs-sec mt-32">
                  <div className="third-decs-sec-wrap"></div>
                </div>

                <div className="fifth-decs-sec mt-32 min-h-[50vh]">
                  <div className="fifth-decs-sec-wrap">
                    <ul
                      className="nav nav-pills single-courses-tab"
                      id="description-tab"
                      role="tablist"
                    >
                      <li className="nav-item !w-1/2" role="presentation">
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
                      <li className="nav-item !w-1/2" role="presentation">
                        <button
                          className="nav-link"
                          id="lessons-tab-btn"
                          data-bs-toggle="pill"
                          data-bs-target="#lesson-content"
                          type="button"
                          role="tab"
                          aria-selected="false"
                        >
                          Assessment
                        </button>
                      </li>
                      <li className="nav-item" role="presentation"></li>
                    </ul>
                    <div className="tab-content" id="description-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="description-content"
                        role="tabpanel"
                        tabIndex="0"
                      >
                        <div className="description-content-wrap mt-24">
                          <div className="description-first-content">
                            <h3 className="des-con-txt1">Details</h3>
                            <div>{job.description}</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="lesson-content"
                        role="tabpanel"
                        tabIndex="0"
                      >
                        <div className="lesson-content-wrap mt-24">
                          <div className="lesson-first-content">
                            <div className="lesson-first-content-top">
                              <div className="lesson-first-content-wrap">
                                <div className="lesson-course">
                                  <h3 className="des-con-txt1">
                                    Assessment Details
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <div className="lesson-second-content">
                              <div className="lesson-second-content-bottom">
                                <Typography variant="body1">
                                  <AccessTime
                                    sx={{ mr: 1, verticalAlign: "middle" }}
                                  />
                                  {job.assessmentDetail}
                                </Typography>
                                <Typography variant="body1">
                                  <AccessTime
                                    sx={{ mr: 1, verticalAlign: "middle" }}
                                  />
                                  Assessment Duration: {job.assessmentDuration}
                                </Typography>
                                {/* <Typography variant="body1">
                                  <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                                  Assessment Type: {job.assessmentType}
                                </Typography>
                                <Typography variant="body1">
                                  <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                                  Assessment Date: {job.assessmentDate}
                                </Typography> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="buy-now-description text-center mt-4 flex gap-2 flex-col sm:flex-row">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/editjob/${jobId}`)}
          >
            Edit Job
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/jobstats/${jobId}`)}
          >
            View Applicants
          </Button>
        </div>
      </section>
    </>
  );
};

export default SingleJob;
