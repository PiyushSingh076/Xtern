import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import code from '../../assets/svg/code.svg';
import { useSelector } from "react-redux";
import Slider from "react-slick";

export default function SkillSet({ skill }) {
    const internInfo = useSelector((state) => state.internInfo);
    console.log(internInfo);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

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
                            <CircularProgressbar
                                value={skillItem.rating == 'High'  ? 90 : skillItem.rating == 'Medium' ? 60 : 30}
                              
                              styles={buildStyles({
    pathColor: skillItem.rating == 'High' ? 'green' : skillItem.rating == 'Medium' ? 'orange' : 'red',
    trailColor: "#f0f0f0"
})}
                            />
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
                            <h3>{skillItem.skill}</h3>
                            <p>{skillItem.rating}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
