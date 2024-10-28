import React, { useState } from "react";


import code from '../../assets/svg/code.svg';
import { useSelector } from "react-redux";
import Slider from "react-slick";


export default function SkillSet() {
   
    const internInfo = useSelector((state) => state.internInfo);
    console.log(internInfo)


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

  return (
    <div>
          <div className="mentor-skill-sec">
                            <h3>Skills</h3>
                            <span>View all</span>
                        </div>
                       
                        {/* Skills carousel */}
                        <Slider {...settings}>
                            {internInfo?.skillSet.map((skill, index) => (
                                <div className="single-mentor-second-wrap-sec" key={index}>
                                    <div className={`mentor-icon ${['purple-bg', 'green-bg', 'pink-bg', 'orange-bg'][index % 4]}`}>
                                        <img width={'30px'} src={code} alt={`${skill.skillset}-icon`} />
                                    </div>
                                    <div className="mentor-content-single mt-12">
                                        <h3>{skill.skillset}</h3>
                                        <p>{skill.rating}</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
    </div>
  )
}
