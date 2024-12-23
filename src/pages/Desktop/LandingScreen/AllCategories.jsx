import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

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

export default function DesktopAllCategories() {
  const navigate = useNavigate(); // Initialize useNavigate

  const categories = [
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
  ];

  // Handler to navigate to the filter screen with the category title
  const handleCategoryClick = (title) => {
    // Encode the title to make it URL-safe
    const encodedTitle = encodeURIComponent(title);
    navigate(`/filterscreen/${encodedTitle}`);
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">Leverage World-Class Talent</h2>
      <span className="categories-subtitle">
        We are the largest, globally-distributed network of top business,
        design, and technology talent, ready to tackle your most important
        initiatives.
      </span>

      <div className="categories-card-container">
        {categories.map((category) => (
          <div
            key={category.title}
            className="categories-card"
            onClick={() => handleCategoryClick(category.title)}
            role="button" // Makes the div accessible as a button
            tabIndex={0} // Makes the div focusable
            onKeyPress={(e) => {
              if (e.key === "Enter") handleCategoryClick(category.title);
            }}
            aria-label={`Explore ${category.title} services`}
          >
            <div className="catedories-card-icon-title">
              <img
                src={category.icon}
                width={"60px"}
                className="xpert-icon"
                alt={`${category.title} icon`}
              />
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
