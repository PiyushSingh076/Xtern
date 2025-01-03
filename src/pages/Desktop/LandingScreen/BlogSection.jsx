import React from "react";
import "./Homescreen.css";
import { Link } from "react-router-dom";
import images from "../../../assets/images/homescreen/Aman3.png";

export default function BlogSection() {
  return (
    <div className="blog-section-container">
      <div className="blog-header">
        <div>
          <h3>Latest From Our Blog</h3>
          <span>Get interesting insights, articles, and news</span>
        </div>

        <Link>Explore All Blogs</Link>
      </div>

      <div className="content-area-container">
        <div className="main-blog-area">
          <div className="blog-card">
            <img src={images} width={"100%"} />
            <div className="data-type-area">
              <span className="blog-type">Speaking</span>
              <span className="blog-date">July,10 2024</span>
            </div>
            <span className="blog-title">
              20 Companies with Location-Agnostic Pay in 2024
            </span>
          </div>
        </div>
        <div className="blog-list-area">
          {[1, 2, 3, 4, 5].map((items) => (
            <div className="blog-list-card">
              <img src={images} />
              <div>
                <div className="data-type-area">
                  <span className="blog-type">Speaking</span>
                  <span className="blog-date">July,10 2024</span>
                </div>
                <span className="title">
                  20 Companies with Location-Agnostic Pay in 2024
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
