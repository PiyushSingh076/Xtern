import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profile from '../../assets/images/banner/mentor.png';
import medal from '../../assets/svg/medal.png';


export default function Xtern() {
    return (
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

            
    )
}