import React from "react";
import "./MobHomeScreen.css";
import image1 from "../../assets/images/homescreen/Aman1.png";
import image2 from "../../assets/images/homescreen/Aman2.png";
import { useNavigate } from "react-router-dom";


export default function ImageBtn() {
  const navigate = useNavigate();

  return (
    <div className="mob-image-btn-container">
      <div className="mob-image1">
        <div className="mob-image1-container">
          <img src={image1} />
          <div className="mob-become-inside-xpert-container">
            <h2>Become an Xpert</h2>
            <span>
              Seasoned Professional looking to help Organization across the
              globe
            </span>
            <button onClick={() => navigate("/signup")}>Become Xpert Now</button>
          </div>
        </div>
      </div>
      <div className="mob-image2">
        <div className="mob-image2-container">
          <img src={image2} />

          <div className="mob-hire-inside-xpert-container">
            <h2>Hire an Xpert</h2>
            <span>
              Experienced Professional ready to support organizations worldwide
            </span>
            <button onClick={() => navigate("/filterscreen/Intern")}>
              Hire Xpert Now
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}
