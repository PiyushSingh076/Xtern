import React from 'react'
import './MobHomeScreen.css'

export default function ImageBtn() {
  return (
    <div className='mob-image-btn-container'>
      <div className='mob-image1'>
          <div className='mob-image1-container'>
          <img src='https://xpert.works/wp-content/uploads/2024/06/Rectangle-3392.webp'/>
          <div className='mob-become-inside-xpert-container'>
            <h2>Become an Xpert</h2>
            <span>Seasoned Professional looking to help Organization across the globe</span>
            <button>Become Xpert Now</button>
          </div>
          </div>
        </div>
        <div className='mob-image2'>
    <div className='mob-image2-container'>
    <img src='https://xpert.works/wp-content/uploads/2024/06/Rectangle-3392-1.webp'/>
    <div className='mob-hire-inside-xpert-container'>
            <h2>Hire an Xpert</h2>
            <span>Experienced Professional ready to support organizations worldwide</span>
            <button>Hire Xpert Now</button>
          </div>
    </div>
        </div>
    </div>
  )
}
