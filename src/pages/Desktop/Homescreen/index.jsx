import React from "react";
import "./HomeScreen.css";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import Categories from "../../Desktop/LandingScreen/AllCategories";
import devops from "../../../assets/svg/devopicon.svg";
import dev from "../../../assets/svg/web-programming.png";
import ui_dev from "../../../assets/svg/ui.png";
import project_manager from "../../../assets/svg/closure.png";
import product_manager from "../../../assets/svg/owner.png";
import intern from "../../../assets/svg/internship.png";
import content_creator from "../../../assets/svg/content-creator.png";
import digital_marketing from "../../../assets/svg/digital-marketing.png";
import hr from "../../../assets/svg/hr.png";
import lawyer from "../../../assets/svg/lawyer.png";
import accountant from "../../../assets/svg/accountant.png";
import financial from "../../../assets/images/homescreen/financial.png";
import astrologist from "../../../assets/images/homescreen/star.png";
import dietician from "../../../assets/images/homescreen/diet.png";
import phonics_english from "../../../assets/images/homescreen/book.png";

import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useAuthState from "../../../hooks/Authentication/useAuthState";

export default function HomeScreen() {
  const { userData } = useFetchUserData();
  const { user, loading } = useAuthState();

  const categories = [
    {
      title: "Yoga",
      icon: "https://cdn-icons-png.flaticon.com/512/3773/3773928.png",
      icon: "https://cdn-icons-png.flaticon.com/512/3773/3773928.png",
      description:
        "Certified yoga instructors offering personalized sessions for physical fitness, mental well-being, and stress management.",
    },
    {
      title: "Developer",
      icon: dev,
      description:
        "Seasoned software engineers, coders, and architects with expertise across hundreds of technologies.",
    },
    {
      title: "DevOps",
      icon: devops,
      description:
        "Expert cloud architects to help you scale & optimize costs & performance.",
        
    },
    {
      title: "Product Manager",
      icon: product_manager,
      description:
        "Digital product managers, scrum product owners with expertise in numerous industries like banking, healthcare, ecommerce, and more.",
    },
    {
      title: "Intern",
      icon: intern,
      description:
        "Grab top coders from Tier 1 Universities helping you with the best of code quality & least technologies.",
    },
    {
      title: "Content Creator",
      icon: content_creator,
      description:
        "Talented content creators specializing in blogs, social media, video production, and compelling storytelling across multiple platforms.",
    },
    {
      title: "Digital Marketing",
      icon: digital_marketing,
      description:
        "Expert digital marketers skilled in SEO, social media marketing, PPC, content strategy, and data-driven marketing techniques.",
    },
    {
      title: "HR",
      icon: hr,
      description:
        "Experienced HR professionals adept at talent acquisition, employee relations, performance management, and organizational development.",
    },
    {
      title: "Lawyer",
      icon: lawyer,
      description:
        "Specialized legal professionals with expertise in various domains including corporate law, intellectual property, and contract management.",
    },
    {
      title: "Accountant",
      icon: accountant,
      description:
        "Skilled accountants proficient in financial reporting, tax planning, auditing, and providing strategic financial guidance.",
    },
    {
      title: "Phonics English",
      icon: phonics_english, // Replace this with the correct icon path
      description:
        "Dedicated phonics instructors helping learners improve reading, writing, and pronunciation skills through fun and interactive sessions.",
    },
    {
      title: "Dietician",
      icon: dietician, // Replace this with the correct icon path
      description:
        "Certified dieticians offering personalized meal plans and expert advice for achieving health and wellness goals.",
    },
    {
      title: "Financial Analyst",
      icon: financial, // Replace this with the correct icon path
      description:
        "Financial analysts providing insights, forecasting, and data-driven strategies for informed financial decision-making.",
    },
    {
      title: "Astrologist",
      icon: astrologist, // Replace this with the correct icon path
      description:
        "Professional astrologists offering insights and guidance based on astrological charts and cosmic alignment.",
    },
    {
      title: "Phonics English",
      icon: phonics_english, // Replace this with the correct icon path
      description:
        "Dedicated phonics instructors helping learners improve reading, writing, and pronunciation skills through fun and interactive sessions.",
    },
    {
      title: "Dietician",
      icon: dietician, // Replace this with the correct icon path
      description:
        "Certified dieticians offering personalized meal plans and expert advice for achieving health and wellness goals.",
    },
    {
      title: "Financial Analyst",
      icon: financial, // Replace this with the correct icon path
      description:
        "Financial analysts providing insights, forecasting, and data-driven strategies for informed financial decision-making.",
    },
    {
      title: "Astrologist",
      icon: astrologist, // Replace this with the correct icon path
      description:
        "Professional astrologists offering insights and guidance based on astrological charts and cosmic alignment.",
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="main-Home-Screen-container">
      {!userData?.linkedInProfile && !user && (
        <>
          <div
            onClick={() => navigate("/userdetail")}
            className="become-xpert-banner"
          >
            <h1 className="title">
              Become <span className="domains-title">Xpert</span>
            </h1>
            <p className="subtitle">
              Join a community of world-class professionals
            </p>
          </div>
          {/* <div
            onClick={() => navigate("/entrepreneurdetails")}
            className="become-xpert-banner"
          >
            <h1 className="title">
              Hire <span className="domains-title">Xpert</span>
            </h1>
            <p className="subtitle">Hire a world-class professional</p>
          </div> */}
        </>
      )}

      <div className="categories-container">
        <h2 className="categories-title">
          Unlock <span style={{ color: "#0A65FC" }}>X</span>pert Services,
        </h2>
        <h4>For Every Need</h4>

        <div className="explore-all-container"></div>

        <div className="categories-card-container ">
          {categories.map((category, index) => (
            <div
              onClick={() => navigate(`/filterscreen/${category.title}`)}
              key={category.title}
              className="categories-card !w-[100%]  !h-full !min-h-fit sm:!w-[100%] "
            >
              <div className="catedories-card-icon-title flex !flex-col !items-center sm:!flex-row !w-full">
                <img
                  src={category.icon}
                  width={"60px"}
                  className="xpert-icon !m-0"
                />
                <span className="categories-card-title">{category.title}</span>
              </div>

              <div className="block sm:block h-fit !line-clamp-3 ">
                <p className="categories-desc">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
