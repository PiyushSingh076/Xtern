import { Button } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { db } from "../../../firebaseConfig";
import { Building } from "lucide-react";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState();
  const [loading, setLoading] = useState();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const jobs = await getDocs(collection(db, "jobPosting"), { limit: 20 });
      const jobData = jobs.docs.map((doc) => doc.data());
      setJobs(jobs.docs.map((doc) => {
        return {
          ...doc.data(),
          jobId: doc.id
        }
      }));
      setLoading(false);
    };
    fetchJobs();
  }, []);
  return (
    <div className="h-[80vh]  mt-2 items-start justify-start shrink-0 w-full flex flex-col ">
      <div className="w-full h-fit flex">
        <div className="h-fit w-1/2 px-12 flex items-center justify-start">
          <div className="w-fit flex flex-col  size-full">
            <h1>Opportunities</h1>
            {/* <h5 className="font-normal">Jobs for you</h5> */}
          </div>
        </div>
        <div className="ml-auto px-12 w-1/2 flex justify-end items-center shrink-0">
          <Button
            onClick={() => navigate("/jobs")}
            sx={{ borderRadius: "50px" }}
            className="h-fit rounded-full"
            variant="contained"
          >
            View all
          </Button>
        </div>
      </div>
      <div className=" w-full h-full px-12 py-6">
        {loading ? (
          <></>
        ) : (
          <>
            <Slider className="my-auto" gap {...settings}>
              {jobs &&
                jobs.map((job) => {
                  return (
                    <div  className="h-[50vh] p-2">
                      <div className="rounded-lg size-full overflow-hidden border border-black/20 flex flex-col">
                        <div className="relative h-1/2 w-full ">
                          <img
                            src={job.image || ""}
                            className="object-cover absolute left-0 top-0 size-full"
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col p-4 gap-1" >
                          <h1 className="font-bold text-lg">{job.title}</h1>
                          
                          <h5 className="font-normal flex gap-1 items-center text-sm"> {job.companyName}</h5>
                          <h5 className="font-normal text-sm">{job.location}</h5>
                          <Button variant="contained" onClick={() => navigate(`/jobs/${job.jobId}`)} >View</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
