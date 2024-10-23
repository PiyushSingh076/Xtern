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
           <span className='greeting-text'>Hey, {userData?.display_name || 'Guest'}</span>
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
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://media.licdn.com/dms/image/v2/D4D0BAQHWliOH_HLw_g/company-logo_200_200/company-logo_200_200/0/1706646202518/s_treasury_logo?e=1735171200&v=beta&t=F970-7FqWdc0Gjp8BOyNRDsNU-jnr_9VRyNRq3-T8HE"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
                    <p>Student Diwan</p>
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://media.licdn.com/dms/image/v2/D4D0BAQEssJxvVzhW2Q/company-logo_200_200/company-logo_200_200/0/1716271857252/edobo_logo?e=1735171200&v=beta&t=iB0IIYE5FEwVPu5vKYElTPY_p7CXidpow_equn1a-LQ"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
                    <p>Edobo</p>
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://media.licdn.com/dms/image/v2/C4D0BAQHiNSL4Or29cg/company-logo_200_200/company-logo_200_200/0/1631311446380?e=1735171200&v=beta&t=Za_-RfpybNMYSuC3QtnukL8SarqJJfYbK-h88BjWnDY"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
                    <p>Google</p>
                  </div>
                </div>
                <div className="home-mentor-sec-wrap redirect-mentor">
                  <div className="home-mentor-sec">
                    <div>
                      <img
                        height="80"
                        width="80"
                        src="https://media.licdn.com/dms/image/v2/C560BAQE88xCsONDULQ/company-logo_200_200/company-logo_200_200/0/1630652622688/microsoft_logo?e=1735171200&v=beta&t=MZPfpagCHCoPSFOmDIKwfxa71NKmdKrN4LOgDlNr9tw"
                        alt="mentor-img"
                      />
                    </div>
                  </div>
                  <div className="home-mentor-name">
                    <p>Microsoft</p>
                  </div>
                </div>
              </Slider>
            </Link>
          </div>
      </div>
    </div>
  )
}
