import React from 'react'
import './MobHomeScreen.css'
import { useNavigate } from 'react-router-dom';
import {ROUTES} from '../../constants/routes';

export default function LandingPage() {

  const navigate =  useNavigate()

    
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
    <div className='mob-landing-container'>
        <div className='mob-slider-container'>
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
        </div> 

        <div className='mob-landing-text-container'>
               <h2>Find the Right</h2>
               <h1 className='domains-title'>Xpert</h1>


               {/* <button 
               onClick={()=>navigate(ROUTES.USER_TYPE)}
               style={{ marginTop: '20px' , marginBottom: '10px' ,  width: '250px' , height: '60px' }} className="become-xpert-btn"><h4 className="become-xpert-title">Become Xpert</h4> <span className="become-xpert-subtitle">Become Top Quality Xperts</span></button> */}


               <button 
                onClick={()=>navigate(ROUTES.SIGN_IN)}
               style={{marginBottom: '5px' ,  width: '250px' , height: '60px' , marginTop: '20px'}}  className="hire-xperts-btn"><h4 className="hire-xpert-title">Get Started</h4> <span className="hire-xpert-subtitle">Top Quality Xperts</span></button>
           

               <div className='mob-expert-count-section'>
                 <span>3K</span>
                <span>Expert Experts</span>
                </div>

                <div className='mob-project-count-section'>
            <span>300</span>
            <span>Project Completed</span> 
            </div>
          
        </div>

        <div className='mob-slider-container'>
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
