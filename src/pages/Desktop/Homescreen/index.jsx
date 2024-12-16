import React from 'react'
import './HomeScreen.css'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import Categories from '../../Desktop/LandingScreen/AllCategories'
import devops from '../../../assets/svg/devopicon.svg'
import dev from '../../../assets/svg/web-programming.png'
import ui_dev from '../../../assets/svg/ui.png'
import project_manager from '../../../assets/svg/closure.png'
import product_manager from '../../../assets/svg/owner.png'
import intern from '../../../assets/svg/internship.png'
import content_creator from '../../../assets/svg/content-creator.png'
import digital_marketing from '../../../assets/svg/digital-marketing.png'
import hr from '../../../assets/svg/hr.png'
import lawyer from '../../../assets/svg/lawyer.png'
import accountant from '../../../assets/svg/accountant.png'
import useFetchUserData from '../../../hooks/Auth/useFetchUserData'

export default function HomeScreen() {

    const {userData} = useFetchUserData()

   const categories = [

     {
        title: 'Yoga Instructor',
        icon: 'https://cdn-icons-png.flaticon.com/512/3773/3773928.png', // Replace this with the correct path to your Yoga icon SVG/image
        description: 'Certified yoga instructors offering personalized sessions for physical fitness, mental well-being, and stress management.'
    },

    {
        title: 'Developer',
        icon: dev,
        description: 'Seasoned software engineers, coders, and architects with expertise across hundreds of technologies.'
    },
    {
        title: 'DevOps',
        icon: devops,
        description: 'Expert cloud architects to help you scale & an optimised cost & high performance.'
    },
    // {
    //     title: 'UI/UX Developer',
    //     icon: ui_dev,
    //     description: 'Expert UI, UX, Visual, and Interaction designers as well as a wide range of illustrators, animators, and more.'
    // },
    {
        title: 'Product Manager',
        icon: product_manager,
        description: 'Digital product managers, scrum product owners with expertise in numerous industries like banking, healthcare, ecommerce, and more.'
    },
    {
        title: 'Intern',
        icon: intern,
        description: 'Grab top coders from Tier 1 Universities helping you with the best of code quality & least technologies.'
    },
    {
        title: 'Content Creator',
        icon: content_creator,
        description: 'Talented content creators specializing in blogs, social media, video production, and compelling storytelling across multiple platforms.'
    },
    {
        title: 'Digital Marketing',
        icon: digital_marketing,
        description: 'Expert digital marketers skilled in SEO, social media marketing, PPC, content strategy, and data-driven marketing techniques.'
    },
    {
        title: 'HR',
        icon: hr,
        description: 'Experienced HR professionals adept at talent acquisition, employee relations, performance management, and organizational development.'
    },
    {
        title: 'Lawyer',
        icon: lawyer,
        description: 'Specialized legal professionals with expertise in various domains including corporate law, intellectual property, and contract management.'
    },
    {
        title: 'Accountant',
        icon: accountant,
        description: 'Skilled accountants proficient in financial reporting, tax planning, auditing, and providing strategic financial guidance.'
    },
   
];

    const navigate = useNavigate()
  return (
    <div className='main-Home-Screen-container'>
      
  
 { !userData?.linkedInProfile &&   <div 
  onClick={() => navigate('/userdetail')}
  className="become-xpert-banner">
  <h1 className="title">
    Become <span className="domains-title">Xpert</span>
  </h1>
  <p className="subtitle">Join a community of world-class professionals</p>
</div>}
       
      <div className="categories-container">
      <h2 className="categories-title">Unlock <span style={{color: '#0A65FC'}}>X</span>pert Services,</h2>
      <h4>For Every Need</h4>
   

   <div className='explore-all-container'>
    
   </div>

      <div className="categories-card-container">
        {categories.map((category, index) => (
          <div 
          onClick={()=>navigate(`/filterscreen/${category.title}`)}
          key={category.title} className="categories-card">
            <div className="catedories-card-icon-title">
              <img src={category.icon} width={"60px"} className='xpert-icon'/>
              <span className="categories-card-title">{category.title}</span>
            </div>

            <div>
              <p className="categories-desc">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    </div>
  )
}