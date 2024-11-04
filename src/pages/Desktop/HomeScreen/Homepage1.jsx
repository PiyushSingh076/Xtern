import React, {useEffect , useState} from 'react'
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import './HomeScreen.css'
import { AiOutlineSearch , AiOutlinePlus } from 'react-icons/ai';
import banner from '../../../assets/images/sample.png'
import useFetchUserData from '../../../hooks/Auth/useFetchUserData';

export default function Home() {

  const {userData} = useFetchUserData();

    const CompanySettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        swipeToSlide: true,
        infinite: true,
        variableWidth: true,
        autoplaySpeed: 2000,
        dots: false,
        arrows: false,
      };
  return (
    <div className='home-landing-page-container'>

        <img src={banner} className='banner-img' width={'50%'}/>
      
      <div className='home-landing-page-text-container'>
           <span className='greeting-text'>Hey, {userData?.display_name || 'User'}</span>
           <span className='greeting-info'>Find match you want</span>
           <div className='landing-page-button-container'>
            <button className='find-job-button'>Find Jobs</button>
            <button className='post-job-button'>
            <AiOutlinePlus className="add-icon" />
                Post Jobs</button>
           </div>
      </div>
      <div className='company-partner-slider'>
        <div className='company-slider-heading-container'>
            Our Partner Companies
        </div>
      <div className="home-mentor-bottom">
            <Link to="/single-mentor">
            <Slider {...CompanySettings}>
                <div className="home-mentor-sec-wrap ">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/StudentDiwanLogo.8fcd85d1ecdb3d8b889a.png"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
               
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/edobo-logo-800x293-2.jpg"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
                
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/fundly.png"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
      
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/65114d62c0c8b53ff6b1b01b_color_transparent-1.png"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
               
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/nido_automation_in_logo.jpeg"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
                   
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/images-1.png"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
              
                  </div>
                </div>

                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://xpert.works/wp-content/uploads/2024/10/images.png"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
           
                  </div>
                </div>

                
              </Slider>
            </Link>
          </div>
      </div>
    </div>
  )
}
