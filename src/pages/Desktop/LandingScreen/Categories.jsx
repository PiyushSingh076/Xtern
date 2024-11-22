import React from "react";
import devops from "../../../assets/svg/devopicon.svg";
import dev from "../../../assets/svg/web-programming.png";
import ui_dev from "../../../assets/svg/ui.png";
import project_manager from "../../../assets/svg/closure.png";
import product_manager from "../../../assets/svg/owner.png";
import intern from "../../../assets/svg/internship.png";

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

export default function Categories() {
  return (
    <div className="categories-container">
      <h2 className="categories-title">Leverage World-Class Talent</h2>
      <span className="categories-subtitle">
        We are the largest, globally-distributed network of top business,
        design, and technology talent, ready to tackle your most important
        initiatives.
      </span>

      <div className="categories-card-container">
        {catogories.map((category, index) => (
          <div key={index} className="categories-card">
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
