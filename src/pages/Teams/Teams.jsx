import React, { useState } from 'react';
import Shortlisted from './Shortlisted';
import Xtern from './Xtern';
import Colleagues from './Colleagues';
import Payments from './Payments';

export default function Teams() {
  const [index, setIndex] = useState(0);

  return (
    <>
      {/* Header */}
      <header id="top-navbar" className="top-navbar">
        <div className="container">
          <div className="top-navbar_full">
            <div className="back-btn">
              {/* Back button content */}
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
                className="nav-link-btn active"
                id="mentor-course-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#course-content"
                type="button"
                role="tab"
                aria-selected="true"
              >
                ShortListed
              </button>
            </li>
            {/* Xtern tab */}
            <li className={`nav-items ${index === 1 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(1)}
                className="nav-link-btn"
                id="student-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#student-content"
                type="button"
                role="tab"
                aria-selected="false"
                tabIndex="-1"
              >
                Xtern
              </button>
            </li>
            {/* Colleagues tab */}
            <li className={`nav-items ${index === 2 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(2)}
                className="nav-link-btn"
                id="reviews-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#reviews-content"
                type="button"
                role="tab"
                aria-selected="false"
                tabIndex="-1"
              >
                Colleagues
              </button>
            </li>
            {/* Payments tab */}
            <li className={`nav-items ${index === 3 ? "active" : ""}`} role="presentation">
              <button
                onClick={() => setIndex(3)}
                className="nav-link-btn"
                id="payments-tab-btn"
                data-bs-toggle="pill"
                data-bs-target="#payments-content"
                type="button"
                role="tab"
                aria-selected="false"
                tabIndex="-1"
              >
                Payments
              </button>
            </li>
          </ul>

          {/* Tab content */}
          {/* ShortListed tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 0 ? "active show" : ""}`} id="course-content" role="tabpanel" aria-labelledby="mentor-course-tab-btn">
             <Shortlisted/>
            </div>
          </div>

          {/* Xtern tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 1 ? "active show" : ""}`} id="student-content" role="tabpanel" aria-labelledby="student-tab-btn">
              <Xtern/>
            </div>
          </div>

          {/* Colleagues tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 2 ? "active show" : ""}`} id="reviews-content" role="tabpanel" aria-labelledby="reviews-tab-btn">
             <Colleagues/>
            </div>
          </div>

          {/* Payments tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 3 ? "active show" : ""}`} id="payments-content" role="tabpanel" aria-labelledby="payments-tab-btn">
             <Payments/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
