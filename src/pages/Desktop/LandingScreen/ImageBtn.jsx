import React from "react";
import "./Homescreen.css";
import image1 from "../../../assets/images/homescreen/Rectangle-3392.webp";
import image2 from "../../../assets/images/homescreen/Rectangle-3392-1.webp";

export default function ImageBtn() {
  return (
    <div className="image-btn-container">
      <div className="image1">
        <div className="image1-container">
          <img src={image1} />
          <div className="become-inside-xpert-container">
            <h2>Become an Xpert</h2>
            <span>
              Seasoned Professional looking to help Organization across the
              globe
            </span>
            <button>Become Xpert Now</button>
          </div>
        </div>
      </div>
      <div className="image2">
        <div className="image2-container">
          <img src={image2} />
          <div className="hire-inside-xpert-container">
            <h2>Hire an Xpert</h2>
            <span>
              Experienced Professional ready to support organizations worldwide
            </span>
            <button>Hire Xpert Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
