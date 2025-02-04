import React from 'react'
import './MobHomeScreen.css'
import useFetchUserData from '../../hooks/Auth/useFetchUserData'
import { Link } from 'react-router-dom'
import payments from '../../assets/svg/payment.avif'
import Teams from '../../assets/svg/teams.jpg'
import shortlisted from '../../assets/svg/shorlisted.webp'
import xperts from '../../assets/svg/xperts.avif'



const orgMenu = [
  {
    title: 'Shortlisted',
    path: 'teams/shortlisted',
    icon: shortlisted
  },
  {
    title: 'Xperts',
    path: 'teams/xtern',
    icon: xperts
  },
  {
    title: 'Teams',
    path: 'teams/colleagues',
    icon: Teams
  },
  {
    title: 'Payments',
    path: 'teams/payments',
    icon: payments
  }
]


export default function Dashboard() {

    const { userData } = useFetchUserData()

  return (
    <div className='mob-dashboard-container'>
          <h1>Dashboard</h1>
         <div className='mob-profile-card'>
              <img src={userData?.photo_url} width={'150px'} style={{borderRadius: '50%'}}/>
              <span className='mob-name-title'>{userData?.display_name}</span>
              <span className='mob-email'>{userData?.email}</span>
              <span><b>Type:</b> {userData?.organization ? 'Organization': 'Xpert' }</span>
              <span>{userData?.role}</span>

         </div>
         
         <div className='mob-control-btn-container'>   
                {
                  orgMenu.map((options)=>(
                    <Link className='mob-control-btns' to={options.path}>
                    <span className='control-menu-title'>{options.title}</span>
                    <img 
                    className='control-menu-icon'
                    src={options.icon} />
                    </Link>
                  ))
                }
         </div>

    </div>
  )
}
