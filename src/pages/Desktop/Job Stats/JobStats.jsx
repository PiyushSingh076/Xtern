import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  Box,
  Button,
  Chip,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Table,
  Skeleton,
} from "@mui/material";

import dayjs from "dayjs";
import { useFetchJob } from "../../../hooks/Jobs/useFetchJob";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import { Book, Bookmark, Building, MapPin, Save, User } from "lucide-react";
import { useSubscriptions } from "../../../hooks/Profile/useSubscriptions";
import {
  AccessTimeRounded,
  BookmarkAdded,
  LocationOn,
  WorkspacePremiumRounded,
} from "@mui/icons-material";

const JobStats = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { jobId } = useParams();
  const { jobData, loading, fetchApplicantDetails, fetchApplications } =
    useFetchJob(jobId);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { toggleSubscribeToXpert, isSubscribed, subLoading } =
    useSubscriptions();
  const openModal = async (applicant) => {
    setSelectedUser(applicant);
    setShowModal(true);

    setLoadingDetails(true);
    const user = await fetchApplicantDetails(applicant.uid);
    console.log("User", user);
    console.log("Applicant", applicant);
    const subscribed = await isSubscribed(applicant.uid);
    setSelectedUser({ ...applicant, user: user, subscribed: subscribed });
    setLoadingDetails(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const navigate = useNavigate()

  const handleSubscribe = async () => {
    setSelectedUser((prev) => ({
      ...selectedUser,
      subscribed: !prev.subscribed,
    }));
    const s = await toggleSubscribeToXpert(selectedUser.uid);
    console.log("Subscribed", s);
    setSelectedUser({ ...selectedUser, subscribed: s });
  };

  return (
    <div id="job-stats-container" className="!px-[80px] !py-[20px]">
      {loading == false && (
        <>
          <div
            id="job-stats-details"
            className="flex flex-col border border-[#e5e5e5] rounded-xl relative"
          >
            <div className="h-[80px] gap-2 w-full flex">
              <div className="size-[80px] relative flex items-center justify-center  rounded-lg overflow-hidden  mb-2">
                <img
                  src={jobData.image}
                  className="absolute top-0 left-0 size-[80px] object-cover rounded-lg"
                  alt=""
                />
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-normal flex gap-1 text-zinc-800 items-center">
                  <User opacity={0.8} size="20"></User> {jobData.title}
                </div>
                <div className="text-lg font-normal flex gap-1 text-zinc-800 items-center">
                  <Building size="20" opacity={0.8}></Building>
                  {jobData.companyName}
                </div>
                <div className=" text-lg flex gap-1 text-zinc-800 items-center">
                  <MapPin size="20" opacity={0.8}></MapPin>
                  {jobData.location}
                </div>
              </div>
            </div>

            <div className="h-fit w-full flex gap-2 items-stretch shrink-0"></div>
            <div className="font-medium text-black/70 mt-2">Details</div>
            <div className="flex gap-1 mb-2">
              <WorkspacePremiumRounded></WorkspacePremiumRounded>{" "}
              {jobData.experienceLevel}
            </div>
            <div className=" shrink-0 min-h-0 text-left border border-[#e5e5e5] max-h-[200px] overflow-y-auto rounded-xl p-2 bg-zinc-50 ">
              {jobData.description}
            </div>
            <div className="shrink-0 h-fit my-2">
              <div id="job-stats-skills">
                {jobData.skills.map((skill, index) => {
                  return (
                    <Chip
                      label={skill}
                      sx={{
                        borderRadius: "10px",
                      }}
                      key={index + skill + "job-stat-skill"}
                    ></Chip>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-black/70">Assesment Details</div>
              <div className="border border-[#e5e5e5] max-h-[200px] overflow-y-auto rounded-xl p-2 bg-zinc-50 ">
                {jobData.assessmentDetail}
              </div>
              <div className="flex gap-1 mt-2">
                <AccessTimeRounded></AccessTimeRounded>
                <span>{jobData.assessmentDuration}</span>
              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <Button variant="contained" onClick={() => navigate("/editjob/"+jobId)}>Edit Job</Button>
            </div>
          </div>
          <div className="flex flex-col border border-[#e5e5e5] rounded-xl size-full relative overflow-hidden">
            <TableContainer sx={{ height: "100%" }} component={Box}>
              <Table hover="true" stickyHeader>
                <TableHead id="jobstats-table-head">
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date Applied</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Assesment Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData.applicants.map((applicant, index) => (
                    <TableRow
                      hover="true"
                      sx={{
                        "&:hover": {
                          backgroundColor: "primary.main",
                        },
                        padding: "10px",
                      }}
                      key={index}
                    >
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell>
                        {dayjs(
                          new Timestamp(
                            applicant.appliedAt.seconds,
                            applicant.appliedAt.nanoseconds
                          ).toDate()
                        ).format("MM/DD/YYYY")}
                      </TableCell>
                      <TableCell>{applicant.status.toUpperCase()}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          color="red"
                          sx={{
                            borderRadius: "100px",
                            width: "50%",
                            height: "5vh",
                            padding: "5px",
                            color: "#176cc7",
                          }}
                          onClick={() => openModal(applicant)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {showModal && selectedUser && (
            <div
              className="modal show d-block  modal-overlay"
              tabIndex="-1"
              role="dialog"
            >
              <div className="modal-dialog m-7 !max-w-fit" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title !h-[1.5em]">
                      {loadingDetails ? (
                        <div className="h-[1.5em] w-[200px] rounded-lg overflow-hidden">
                          <Skeleton variant="rectangular" width="100%" height="100%" ></Skeleton>
                        </div>
                      ) : (
                        <>
                          {selectedUser?.user?.firstName}{" "}
                          {selectedUser?.user?.lastName}
                        </>
                      )}
                    </h5>
                  </div>
                  <div className="modal-body">
                    <div className="flex size-full gap-4 items-stretch h-[250px]">
                      {loadingDetails ? (
                        <div className="w-[150px] h-full rounded-lg overflow-hidden">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                          ></Skeleton>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col w-fit shrink-0">
                            <div className="w-full h-[150px] mb-2 flex items-center justify-center">
                              <img
                                src={selectedUser?.user?.photo_url}
                                className="size-[150px] rounded-full  border-2 border-black/10"
                                alt=""
                              />
                            </div>
                            <div className="w-full text-center  text-lg">
                              {selectedUser?.user?.firstName}{" "}
                              {selectedUser?.user?.lastName}
                            </div>
                            <div className="text-black/70 w-full text-center font-medium flex justify-center items-center mb-1">
                              <LocationOn></LocationOn>
                              {selectedUser?.user?.city}
                            </div>
                            <div className="w-full flex justify-center items-center">
                              <div className="h-fit w-full flex flex-wrap gap-2 justify-center items-center">
                                <>
                                  {selectedUser?.user?.skillSet.map(
                                    (skill, index) => (
                                      <Chip
                                        label={skill.skill}
                                        key={index + skill + "job-stat-skill"}
                                      ></Chip>
                                    )
                                  )}
                                </>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="w-fit h-full flex items-stretch  flex-col shrink-0">
                        <div className="h-fit w-full flex gap-2">
                          <Button
                            disableElevation
                            onClick={() =>
                              window.open(selectedUser.deploymentUrl, "_blank")
                            }
                            variant="contained"
                            sx={{ borderRadius: "100px" }}
                          >
                            Live Link
                          </Button>
                          <Button
                            disableElevation
                            onClick={() =>
                              window.open(selectedUser.githubUrl, "_blank")
                            }
                            variant="contained"
                            sx={{ borderRadius: "100px" }}
                          >
                            Repository
                          </Button>
                          <Button
                            disableElevation
                            onClick={() =>
                              window.open(selectedUser.videoDemoUrl, "_blank")
                            }
                            variant="contained"
                            sx={{ borderRadius: "100px" }}
                          >
                            Demo Video
                          </Button>
                        </div>
                        <div className="mt-2 font-medium text-black/70">
                          Description
                        </div>
                        <div className="h-full border border-gray-200 rounded-xl overflow-y-auto p-2 bg-gray-50">
                          {selectedUser.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer gap-2">
                    <Chip
                      className="!mr-auto"
                      label={selectedUser.status.toUpperCase()}
                    ></Chip>
                    <Button variant="contained">Approve</Button>
                    <Button
                      disabled={subLoading}
                      onClick={handleSubscribe}
                      variant="contained"
                      className=" !flex  gap-2"
                    >
                      <>
                        {selectedUser?.subscribed ? "Unsubscribe" : "Subscribe"}
                      </>

                      {subLoading ? (
                        <Spinner size="sm"></Spinner>
                      ) : selectedUser.subscribed == false ? (
                        <Bookmark></Bookmark>
                      ) : (
                        <BookmarkAdded></BookmarkAdded>
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      className=""
                      sx={{ bgcolor: "#FF6D6DFF" }}
                      onClick={closeModal}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobStats;
