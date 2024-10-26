import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profile from '../assets/images/banner/mentor.png';
import medal from '../assets/svg/medal.png';
import share from '../assets/svg/share.svg';
import chat from '../assets/svg/chat.png';

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
              <div className='info-card-container'>
                <div className='info-card-container-inner'>
                  <div className='info-card-shortlisted'>
                    <div className='share-icon'>
                      <img src={share} alt="share" width={'20px'} />
                    </div>
                    <div className='info-card-img-section'>
                      <img src={profile} alt="profile" width={'70px'} />
                    </div>      
                    <div className='info-card-content'>
                      <div className='info-card-name-section'>
                        <h4>Anirudh</h4>
                        <div className='chat-icon'>
                          <img src={chat} alt="chat" width={'15px'} />
                          <span>Chat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='info-card-action-section'>
                    <button className='subscribe-btn'>Subscribe xtern</button>
                    <button className='replace-btn'>Schedule Interview</button>
                    <button className='unsubscribe-btn'>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Xtern tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 1 ? "active show" : ""}`} id="student-content" role="tabpanel" aria-labelledby="student-tab-btn">
              <div className='info-card-container'>
                {
                  Array.from({length: 10}).map((item, index) => (
                    <div className='info-card-xtern' key={index}>
                      <div className='info-card-img-section'>
                        <img src={profile} className='info-card-img' alt="profile" />
                      </div>
                      <div className='info-card-content'>
                        <div className='info-card-name-section'>
                          <h4>Anirudh</h4>
                          <div className='medal-section'>
                            <img src={medal} alt="medal" width={'15px'}/> Brown
                          </div>
                        </div>
                        <span className='subscribed-tag'>Subscribed</span>
                        <div className='info-card-action-section'>
                          <button className='replace-btn'>Replace</button>
                          <button className='unsubscribe-btn'>Unsubscribe</button>
                        </div>
                        <span className='info-card-phone-number'>Phone Number: 9812345678</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Colleagues tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 2 ? "active show" : ""}`} id="reviews-content" role="tabpanel" aria-labelledby="reviews-tab-btn">
                <div className='colleague-btn-section'>
                    <button  className=''>My Team</button>
                    <button className=''>Invites</button>
                </div>

             <div className='info-card-container'>
                  
             </div>
            </div>
          </div>

          {/* Payments tab */}
          <div className="tab-content">
            <div className={`tab-pane fade ${index === 3 ? "active show" : ""}`} id="payments-content" role="tabpanel" aria-labelledby="payments-tab-btn">
              Payments
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
