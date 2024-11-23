import React from 'react'
import './MobHomeScreen.css'
import { Link } from 'react-router-dom'

export default function Blog() {
  return (
    <div className='mob-blog-container'>
        <div className='blog-header'>
             <div>
             <h3>Latest From Our Blog</h3>
             <span>
             Get interesting insights, articles, and news
             </span>
             </div>

        </div>

        <div className='mob-content-area-container'>
             <div className='mob-main-blog-area'>
                <div className='blog-card'>
                <img style={{marginLeft: '70px'}} src='https://xpert.works/wp-content/uploads/2024/07/bg-top-compressed-_2_.webp' width={'350px'}/>
                <div className='mob-data-type-area'>
                    <span className='blog-type'>Speaking</span>
                    <span className='blog-date'>July,10 2024</span>
                </div>
                <span className='mob-blog-title'>20 Companies with Location-Agnostic Pay in 2024</span>
                </div>
             </div>
             <div className='mob-blog-list-area'>
     {      [1,2,3,4,5].map( (items)=>   ( <div className='mob-blog-list-card'>
                    <img src='https://xpert.works/wp-content/uploads/2024/07/bg-top-compressed-_2_.webp' />
                 <div>
                 <div className='data-type-area'>
                    <span style={{fontSize: '12px'}}  className='blog-type'>Speaking</span>
                    <span style={{fontSize: '12px'}} className='blog-date'>July,10 2024</span>
                </div>
                <span style={{fontSize: '14px',  fontWeight :'600'}} className='title'>
                20 Companies with Location-Agnostic Pay in 2024
                </span>
                </div>
                 </div>))}
             </div>
        </div>


    </div>
  )
}
