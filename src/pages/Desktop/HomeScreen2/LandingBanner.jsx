import React from 'react'
import './Homescreen.css'



export default function LandingBanner({pop , setRole}) {

  // images

    const images1 = [
        'https://xpert.works/wp-content/uploads/2024/10/Add-a-subheading-2.png',
        'https://xpert.works/wp-content/uploads/2024/10/Add-a-subheading-1.png',
        'https://xpert.works/wp-content/uploads/2024/10/Sameer-Gupta-1.png',
        'https://xpert.works/wp-content/uploads/2024/10/Rithvik-Shah.png',
        'https://xpert.works/wp-content/uploads/2024/10/Ravi-Sharma-1.png'
    ];

    const images2 = [
        'https://xpert.works/wp-content/uploads/2024/10/Sameer-Gupta-2.png',
        'https://xpert.works/wp-content/uploads/2024/10/Rithvik-Shah-5.png',
        'https://xpert.works/wp-content/uploads/2024/10/Rithvik-Shah-2.png',
        'https://xpert.works/wp-content/uploads/2024/10/Ravi-Sharma-2.png',
        'https://xpert.works/wp-content/uploads/2024/10/Product-Manager.png',
        'https://xpert.works/wp-content/uploads/2024/10/Ravi-Sharma.png'
    ]


  return (
    <div className="landing-banner-container">
      <div className="content-container">
        <div className="main-container">
          <span className="subheading">Find the right</span>
          <h1 className='domains-title'>Xpert</h1>

          <div className="hire-btns-container">
            <button onClick={() => { pop(true); setRole('Bxpert') }} className="become-xpert-btn"><h4 className="become-xpert-title">Become Xpert</h4> <span className="become-xpert-subtitle">Become Top Quality Xperts</span></button>
            <button onClick={() => { pop(true); setRole('Hxpert') }} className="hire-xperts-btn"><h4 className="hire-xpert-title">Organization</h4> <span className="hire-xpert-subtitle">Hire Top Quality Xperts</span></button>
          </div>

          <span className="xpert-count">Over 3000+ expect Xpert are waiting for you</span>
          <div className='counts-section'>
            <div className='expert-count-section'>
                 <span>3K</span>
                <span>Expert Experts</span>
            </div>
            <div className='bar'></div>
            <div className='project-count-section'>
            <span>300</span>
            <span>Project Completed</span> 
            </div>
          </div>
        </div>
      </div>

      <div className="image-slider-container">
  {/* First slider scrolling up */}
  <div className="slider-up">
    <div className="slider-track-up">
      {images1.map((item, index) => (
        <img key={index} src={item} alt={`mentor-${index}`} className="slider-image" />
      ))}
      {/* Duplicate images for seamless looping */}
      {images1.map((item, index) => (
        <img key={images1.length + index} src={item} alt={`mentor-${index}-duplicate`} className="slider-image" />
      ))}
    </div>
  </div>

  {/* Second slider scrolling down */}
  <div className="slider-down">
    <div className="slider-track-down">
      {images2.map((item, index) => (
        <img key={index} src={item} alt={`mentor-${index}-down`} className="slider-image" />
      ))}
      {/* Duplicate images for seamless looping */}
      {images2.map((item, index) => (
        <img key={images1.length + index} src={item} alt={`mentor-${index}-down-duplicate`} className="slider-image" />
      ))}
    </div>
  </div>
</div>
    </div>
  )
}