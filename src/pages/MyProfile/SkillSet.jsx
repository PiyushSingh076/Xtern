import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import useUserProfileData from "../../hooks/Profile/useUserProfileData";
import { useParams } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import code from '../../assets/svg/code.svg';
import { useSelector } from "react-redux";


export default function SkillSet({ skill , skillloading }) {
 
    const { uid } = useParams();
    


console.log('skill',skillloading)

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    if (skillloading) {
        return (
            <div className="skillset-container">
                {Array(4).fill(0).map((_, index) => (
                    <div className="profile-details-second-wrap-sec" key={index}>
                        <Skeleton variant={'circular'} width={80} height={80} />
                        <Skeleton width={"80%"} height={20} style={{ marginTop: 10 }} />
                        <Skeleton width={"60%"} height={15} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="profile-details-skill-sec">
                <h3>Skills</h3>
            </div>

            {/* Skills slider */}
            <div className="skillset-container">
                {skill.map((skillItem, index) => (
                    <div className="profile-details-second-wrap-sec" key={index}>
                        <div
                            className={`mentor-icon ${
                                ["purple-bg", "green-bg", "pink-bg", "orange-bg"][index % 4]
                            }`}
                            style={{ position: "relative", width: "80px", height: "80px" }}
                        >
                          
                            <img
                                src={code}
                                alt={`${skillItem.skill}-icon`}
                                style={{
                                    padding: '5px',
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "40px"
                                }}
                            />
                        </div>
                        <div className="mentor-content-single mt-12">
                            <h3>{skillItem}</h3>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
