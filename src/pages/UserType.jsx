import React from 'react'
import newuser from '../assets/svg/newUser.jpg'
import existingUser from '../assets/svg/xpert.jpg'
import { useNavigate } from 'react-router-dom'
import {ROUTES} from '../constants/routes'

export default function UserType() {

    const navigate = useNavigate()

  return (
    <div className='mob-usertype-container'>
        <div 
        onClick={()=> navigate(ROUTES.INTERN)}
        className='mob-usertype'>
            <img src={newuser} width={'120px'}/>
               New Xpert
        </div>

        <div
        onClick={()=> navigate(ROUTES.SIGN_IN)}
         className='mob-usertype'>
        <img src={existingUser} width={'120px'}/>
            Existing Xpert
        </div>
    </div>
  )
}