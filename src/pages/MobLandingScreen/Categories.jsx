import React from "react";
import "./MobHomeScreen.css";
import devops from "../../assets/svg/devopicon.svg";
import dev from "../../assets/svg/web-programming.png";
import ui_dev from "../../assets/svg/ui.png";
import project_manager from "../../assets/svg/closure.png";
import product_manager from "../../assets/svg/owner.png";
import intern from "../../assets/svg/internship.png";
import dietician from "../../assets/images/homescreen/diet.png";
import phonics_english from "../../assets/images/homescreen/book.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function Categories() {
  const navigate = useNavigate(); // Initialize useNavigate

  const catogories = [
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
        "Expert cloud architects to help you scale & an optimised cost & high performance.",
    },
    {
      title: "UI/UX Developer",
      icon: ui_dev,
      description:
        "Expert UI, UX, Visual, and Interaction designers as well as a wide range of illustrators, animators, and more.",
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
      title: "Yoga",
      icon: "https://cdn-icons-png.flaticon.com/512/3773/3773928.png",
      description:
        "Certified yoga instructors offering personalized sessions for physical fitness, mental well-being, and stress management.",
    },
    {
      title: "Project Manager",
      icon: project_manager,
      description:
        "Digital and technical project managers, scrum masters, and more with expertise in numerous PM tools, frameworks, and styles.",
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
        "Grab top coders from Tier 1 Universities helping you with the best of code quality & least technologies. ",
    },
  ];

  const handleCategoryClick = (title) => {
    // Encode the title to make it URL-safe
    const encodedTitle = encodeURIComponent(title);
    navigate(`/filterscreen/${encodedTitle}`);
  };

  return (
    <div className="mob-categories-container">
      <h2 className="mob-categories-title">Leverage World-Class Talent</h2>
      <span className="mob-categories-subtitle">
        We are the largest, globally-distributed network of top business,
        design, and technology talent, ready to tackle your most important
        initiatives.
      </span>

      <div className="mob-categories-card-container">
        {catogories.map((category, index) => (
          <div
            key={index}
            className="categories-card"
            onClick={() => handleCategoryClick(category.title)} // Attach click handler
            role="button" // Indicates the div behaves like a button
          >
            <div className="catedories-card-icon-title">
              <img src={category.icon} width={"60px"} />
              <span className="categories-card-title">{category.title}</span>
            </div>

            <div>
              <p className="categories-desc">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
