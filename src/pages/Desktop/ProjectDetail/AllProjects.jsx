
import './projectDetail.css'
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BookmarkSvg from "../../../assets/svg/black-bookmark.svg";
import GreayTimeIcon from "../../../assets/images/result-found/grey-time-icon.svg";
import PlaceholderImage from "../../../assets/images/new-course/cousre1.png"; // Add a placeholder image
import { db } from "../../../firebaseConfig"; // Adjust the path as necessary
import { collection, query, getDocs } from "firebase/firestore";
import BookmarkFillSvg from "../../../assets/images/single-courses/bookmark-fill.svg";
import Loading from "../../../components/Loading";

export default function AllProjects() {
    const [isFixed, setIsFixed] = useState(false);
    const [projects, setProjects] = useState([]);
    const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const handleScroll = () => {
        setIsFixed(window.scrollY >= 20);
      };
  
      window.addEventListener("scroll", handleScroll);
  
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    // Fetch projects from Firebase
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          // Replace 'Projects' with your actual collection name in Firestore
          const q = query(collection(db, "RealWorldTask"));
          const querySnapshot = await getDocs(q);
          const projectsData = [];
          querySnapshot.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() });
          });
          setProjects(projectsData);
        } catch (error) {
          console.error("Error fetching projects: ", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProjects();
    }, []);
  
    const toggleBookmark = (projectId) => {
      setBookmarkedProjects((prevState) =>
        prevState.includes(projectId)
          ? prevState.filter((id) => id !== projectId)
          : [...prevState, projectId]
      );
    };

  return (
    <div className='des-all-projects-container'>
       <section id="project-list">
        <div className="container">
          <h1 className="d-none">Projects</h1>
          <h2 className="d-none">Hidden</h2>
          <div className="des-new-courses-wrap ">
            {projects.map((project) => (
              <div className="des-new-courses-sec single-course" key={project.id}>
                <div className="des-new-courses">
                  <Link
                    to={`/project/${project.id}`}
                    className="item-bookmark"
                    tabIndex="0"
                  >
                    <img
                      src={project.imageUrl || PlaceholderImage}
                      alt="project-img"
                    />
                  </Link>
                  <div className="trending-bookmark" role="button">
                    <a
                      className="item-bookmark"
                      onClick={() => toggleBookmark(project.id)}
                      aria-label="Bookmark"
                    >
                      <img
                        src={
                          bookmarkedProjects.includes(project.id)
                            ? BookmarkFillSvg
                            : BookmarkSvg
                        }
                        alt="bookmark-icon"
                      />
                    </a>
                  </div>
                  {/* {project.category && ( */}
                  <div className="new-courses-txt">
                    <p>{project.category || "App Development"}</p>
                  </div>
                  {/* )} */}
                </div>
                <div className="trending-course-bottom mt-12">
                  <div>
                    <p className="new-courses-txt1">
                      {project.title || "Untitled Project"}
                    </p>
                  </div>
                  <div className="trending-course-price">
                    {project.price ? (
                      <div>
                        <span className="new-courses-txt3">
                          {project.price}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="new-courses-txt3">$0.00</span>
                      </div>
                    )}
                    {/* {project.time && ( */}
                    <div>
                      <span className="new-courses-txt4">
                        <img src={GreayTimeIcon} alt="time-icon" />
                      </span>
                      <span className="new-courses-txt5">
                        {project.time || "5h 20m"}
                      </span>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
