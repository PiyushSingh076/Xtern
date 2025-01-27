import { Lightbulb, WorkspacePremium } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"
import { Tooltip } from "@mui/material";

const ChooseType = () => {
  return (
    <div className="size-full h-[calc(100vh-90px)] flex items-center justify-center flex-col gap-2 relative">
      <div className="text-2xl font-medium text-black/70 h-[100px] shrink-0 flex items-center absolute top-0">Who are you?</div>
      <div className="flex size-full items-center justify-center gap-4 flex-col sm:flex-row">
        <ChooseCard title="You want to hire experts from around the world" href="/entrepreneurdetails" icon={<Lightbulb fontSize="large"  ></Lightbulb>} >Entrepreneur</ChooseCard>
        <ChooseCard  title="You want to find job opportunities" href="/userdetail" icon={<WorkspacePremium ></WorkspacePremium>} >Expert</ChooseCard>
      </div>
    </div>
  );
};

const ChooseCard = ({ children, icon, href, title }) => {
    const navigate = useNavigate();
  return (
    <Tooltip title={title}><button onClick={() => navigate(href)} className={`size-[250px] hover:scale-[1.01] relative group hover:text-blue-500 flex items-center justify-center rounded-lg hover:shadow-md hover:ring-2 ring-blue-500 hover:border-transparent transition-all border-2 hover:border-blue-500 flex-col shadow-black/20`}>
    <div className="text-3xl choose-card-icon" >{icon}</div>
    <div className="mb-2 absolute bottom-0 text-xl font-medium text-black/70 group-hover:text-blue-500" >{children}</div>
  </button></Tooltip>
  );
};

export default ChooseType;
