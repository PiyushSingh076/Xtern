import React from 'react'
import './MobHomeScreen.css'
import useFetchUserData from '../../hooks/Auth/useFetchUserData'
import { Link } from 'react-router-dom'

export default function Dashboard() {

    const { userData } = useFetchUserData()
    console.log(userData)

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
               <Link className='mob-control-btns'>Shortlisted</Link>
               <Link className='mob-control-btns'>Xtern</Link>
               <Link className='mob-control-btns'>Collegues</Link>
               <Link className='mob-control-btns'>Payments</Link>
         </div>

    </div>
  )
}
