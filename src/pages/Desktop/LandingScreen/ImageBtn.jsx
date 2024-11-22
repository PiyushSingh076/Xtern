import React from 'react'
import './Homescreen.css'

export default function ImageBtn() {
  return (
    <div className='image-btn-container'>
        <div className='image1'>
          <div className='image1-container'>
          <img src='https://xpert.works/wp-content/uploads/2024/06/Rectangle-3392.webp'/>
          <div className='become-inside-xpert-container'>
            <h2>Become an Xpert</h2>
            <span>Seasoned Professional looking to help Organization across the globe</span>
            <button>Become Xpert Now</button>
          </div>
          </div>
        </div>
        <div className='image2'>
    <div className='image2-container'>
    <img src='https://xpert.works/wp-content/uploads/2024/06/Rectangle-3392-1.webp'/>
    <div className='hire-inside-xpert-container'>
            <h2>Hire an Xpert</h2>
            <span>Experienced Professional ready to support organizations worldwide</span>
            <button>Hire Xpert Now</button>
          </div>
    </div>
        </div>
         
    </div>
  )
}
