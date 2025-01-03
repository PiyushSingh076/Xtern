import React from "react";
import "./Homescreen.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import AddA_Subheading1 from "../../../assets/images/homescreen/Add-a-subheading-1.png";
import AddA_Subheading2 from "../../../assets/images/homescreen/Add-a-subheading-2.png";
import ProductManager from "../../../assets/images/homescreen/Product-Manager.png";
import RaviSharma1 from "../../../assets/images/homescreen/Ravi-Sharma-1.png";
import RaviSharma from "../../../assets/images/homescreen/Ravi-Sharma.png";
import RaviSharma2 from "../../../assets/images/homescreen/Ravi-Sharma-2.png";
import RithvikShah2 from "../../../assets/images/homescreen/Rithvik-Shah-2.png";
import RithvikShah5 from "../../../assets/images/homescreen/Rithvik-Shah-5.png";
import RithvikShah from "../../../assets/images/homescreen/Rithvik-Shah.png";
import SameerGupta1 from "../../../assets/images/homescreen/Sameer-Gupta-1.png";
import SameerGupta2 from "../../../assets/images/homescreen/Sameer-Gupta-2.png";
export default function LandingBanner({ pop, setRole }) {
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
    <div className="landing-banner-container">
      <div className="content-container">
        <div className="main-container">
          <span className="subheading">Find the right</span>
          <h1 className="domains-title">Xpert</h1>

          <div className="hire-btns-container">
            {/* <button
              onClick={() => {
                pop(true);
                setRole("Bxpert");
              }}
              className="become-xpert-btn"
            >
              <h4 className="become-xpert-title">Become Xpert</h4>{" "}
              <span className="become-xpert-subtitle">
                Become Top Quality Xperts
              </span>
            </button> */}
            <button
              onClick={() => {
                navigate(ROUTES.SIGN_UP);
              }}
              className="hire-xperts-btn"
            >
              <h4 className="hire-xpert-title">Get Started</h4>{" "}
              <span className="hire-xpert-subtitle">Top Quality Xperts</span>
            </button>
          </div>

          <span className="xpert-count">
            Over 3000+ Xpert are waiting for you
          </span>
          <div className="counts-section">
            <div className="expert-count-section">
              <span>3K</span>
              <span>Experts</span>
            </div>
            <div className="bar"></div>
            <div className="project-count-section">
              <span>300</span>
              <span>Project Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="image-slider-container">
        {/* First slider scrolling up */}
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

        {/* Second slider scrolling down */}
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