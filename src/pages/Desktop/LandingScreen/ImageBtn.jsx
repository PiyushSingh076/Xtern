import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homescreen.css";
import image1 from "../../../assets/images/homescreen/Aman1.png";
import image2 from "../../../assets/images/homescreen/Aman2.png";

export default function ImageBtn() {
  const navigate = useNavigate();

  return (
    <div className="image-btn-container">
      <div className="image1">
        <div className="image1-container">
          <img src={image1} alt="Become Xpert" />
          <div className="become-inside-xpert-container">
            <h2>Become an Xpert</h2>
            <span>
              Seasoned Professional looking to help organizations across the
              globe
            </span>
            <button onClick={() => navigate("/signup")}>Become Xpert Now</button>
          </div>
        </div>
      </div>
      <div className="image2">
        <div className="image2-container">
          <img src={image2} alt="Hire Xpert" />
          <div className="hire-inside-xpert-container">
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
