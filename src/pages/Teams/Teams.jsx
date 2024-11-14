import React, { useState, useEffect } from 'react';
import Shortlisted from './Shortlisted';
import Xtern from './Xtern';
import Colleagues from './Colleagues';
import Payments from './Payments';
import { useParams, useNavigate } from 'react-router-dom';

export default function Teams() {
  const { options } = useParams();
  const navigate = useNavigate();

  const [index, setIndex] = useState(
    options === 'shortlisted' ? 0 :
    options === 'xtern' ? 1 :
    options === 'colleagues' ? 2 :
    options === 'payments' ? 3 :
    0
  );


  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page in the history stack
};

  // Update URL when tab changes
  useEffect(() => {
    const paths = ['shortlisted', 'xtern', 'colleagues', 'payments'];
    navigate(`/teams/${paths[index]}`, { replace: true });
  }, [index, navigate]);

  return (
    <div className='teams-container'>
      {/* Header */}
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
          <div className="back-btn">
                            <svg
                                onClick={handleBackClick}
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <mask
                                    id="mask0_330_7385"
                                    style={{ maskType: "alpha" }}
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="24"
                                    height="24"
                                >
                                    <rect width="24" height="24" fill="black" />
                                </mask>
                                <g mask="url(#mask0_330_7385)">
                                    <path
                                        d="M15 18L9 12L15 6"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </g>
                            </svg>
                        </div>
            <div className="top-navbar-title">
              <p>Teams</p>
            </div>
            <div className="skip-btn-goal">
              {/* Skip button content */}
            </div>
          </div>
        </div>
        <div className="navbar-boder"></div>
      </header>

      {/* Main content */}
      <section>
        <div className='container'>
          {/* Navigation tabs */}
          <ul className="nav-tabs-container" id="mentor-tab" role="tablist">
            {/* ShortListed tab */}
            <li className={`nav-items ${index === 0 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(0)}
                className={`nav-link-btn ${index === 0 ? "active" : ""}`}
                id="mentor-course-tab-btn"
                type="button"
                role="tab"
                aria-controls="course-content"
                aria-selected={index === 0}
              >
                ShortListed
              </button>
            </li>
            {/* Xtern tab */}
            <li className={`nav-items ${index === 1 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(1)}
                className={`nav-link-btn ${index === 1 ? "active" : ""}`}
                id="student-tab-btn"
                type="button"
                role="tab"
                aria-controls="student-content"
                aria-selected={index === 1}
              >
                Xtern
              </button>
            </li>
            {/* Colleagues tab */}
            <li className={`nav-items ${index === 2 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(2)}
                className={`nav-link-btn ${index === 2 ? "active" : ""}`}
                id="reviews-tab-btn"
                type="button"
                role="tab"
                aria-controls="reviews-content"
                aria-selected={index === 2}
              >
                Colleagues
              </button>
            </li>
            {/* Payments tab */}
            <li className={`nav-items ${index === 3 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(3)}
                className={`nav-link-btn ${index === 3 ? "active" : ""}`}
                id="payments-tab-btn"
                type="button"
                role="tab"
                aria-controls="payments-content"
                aria-selected={index === 3}
              >
                Payments
              </button>
            </li>
          </ul>

          {/* Tab content */}
          <div className="tab-content">
            {/* ShortListed tab */}
            <div 
              className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
              id="course-content"
              role="tabpanel"
              aria-labelledby="mentor-course-tab-btn"
            >
              <Shortlisted/>
            </div>

            {/* Xtern tab */}
            <div 
              className={`tab-pane fade ${index === 1 ? "show active" : ""}`}
              id="student-content"
              role="tabpanel"
              aria-labelledby="student-tab-btn"
            >
              <Xtern/>
            </div>

            {/* Colleagues tab */}
            <div 
              className={`tab-pane fade ${index === 2 ? "show active" : ""}`}
              id="reviews-content"
              role="tabpanel"
              aria-labelledby="reviews-tab-btn"
            >
              <Colleagues/>
            </div>

            {/* Payments tab */}
            <div 
              className={`tab-pane fade ${index === 3 ? "show active" : ""}`}
              id="payments-content"
              role="tabpanel"
              aria-labelledby="payments-tab-btn"
            >
              <Payments/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
