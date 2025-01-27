import React from "react";
import "./MobHomeScreen.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import AddA_Subheading1 from "../../assets/images/homescreen/Add-a-subheading-1.png";
import AddA_Subheading2 from "../../assets/images/homescreen/Add-a-subheading-2.png";
import ProductManager from "../../assets/images/homescreen/Product-Manager.png";
import RaviSharma1 from "../../assets/images/homescreen/Ravi-Sharma-1.png";
import RaviSharma from "../../assets/images/homescreen/Ravi-Sharma.png";
import RaviSharma2 from "../../assets/images/homescreen/Ravi-Sharma-2.png";
import RithvikShah2 from "../../assets/images/homescreen/Rithvik-Shah-2.png";
import RithvikShah5 from "../../assets/images/homescreen/Rithvik-Shah-5.png";
import RithvikShah from "../../assets/images/homescreen/Rithvik-Shah.png";
import SameerGupta1 from "../../assets/images/homescreen/Sameer-Gupta-1.png";
import SameerGupta2 from "../../assets/images/homescreen/Sameer-Gupta-2.png";

export default function LandingPage() {
  // images

  const navigate = useNavigate();

  const images1 = [
    AddA_Subheading2,
    AddA_Subheading1,
    SameerGupta1,
    RithvikShah,
    RaviSharma1,
  ];

  const images2 = [
    SameerGupta2, // If Sameer-Gupta-2.png exists, import and use it instead
    RithvikShah5,
    RithvikShah2,
    RaviSharma2, // Make sure to import Ravi-Sharma-2.png if it exists
    ProductManager,
    RaviSharma,
  ];

  return (
    <div className="mob-landing-container">
      <div className="mob-slider-container">
        <div className="slider-up">
          <div className="slider-track-up">
            {images1.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`mentor-${index}`}
                className="slider-image"
              />
            ))}
            {/* Duplicate images for seamless looping */}
            {images1.map((item, index) => (
              <img
                key={images1.length + index}
                src={item}
                alt={`mentor-${index}-duplicate`}
                className="slider-image"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mob-landing-text-container">
        <h2>Find the Right</h2>
        <h1 className="domains-title">Xpert</h1>

        {/* <button 
               onClick={()=>navigate(ROUTES.USER_TYPE)}
               style={{ marginTop: '20px' , marginBottom: '10px' ,  width: '250px' , height: '60px' }} className="become-xpert-btn"><h4 className="become-xpert-title">Become Xpert</h4> <span className="become-xpert-subtitle">Become Top Quality Xperts</span></button> */}

        <button
          onClick={() => navigate(ROUTES.SIGN_IN)}
          style={{
            marginBottom: "5px",
            width: "250px",
            height: "60px",
            marginTop: "20px",
          }}
          className="hire-xperts-btn"
        >
          <h4 className="hire-xpert-title">Hire Expert</h4>{" "}
          <span className="hire-xpert-subtitle">Top Quality Xperts</span>
        </button>

        <div className="mob-expert-count-section">
          <span>3K</span>
          <span>Expert Experts</span>
        </div>

        <div className="mob-project-count-section">
          <span>300</span>
          <span>Project Completed</span>
        </div>
      </div>

      <div className="mob-slider-container">
        <div className="slider-down">
          <div className="slider-track-down">
            {images2.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`mentor-${index}-down`}
                className="slider-image"
              />
            ))}
            {/* Duplicate images for seamless looping */}
            {images2.map((item, index) => (
              <img
                key={images1.length + index}
                src={item}
                alt={`mentor-${index}-down-duplicate`}
                className="slider-image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
