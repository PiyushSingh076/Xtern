import React, { useState } from 'react'
import menu from '../assets/svg/menu.svg'
import close from '../assets/svg/close.png'
import { Link } from 'react-router-dom'
import useFetchUserData from '../hooks/Auth/useFetchUserData'
import useOAuthLogout from '../hooks/Auth/useOAuthLogout'

export default function MobHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const {userData} = useFetchUserData()
  const {handleLogout} = useOAuthLogout()

  const handleMenuClick = () => {
    setIsOpen(!isOpen)

 
  }

  return (
    <div className='mob-header-container' style={{border: isOpen && 'none' }}>
      <div className='back-btn-container'></div>
      <div className='Logo-container'><span style={{color: '#0d6efd' , fontSize: '22px'}}>X</span>pert</div>
      <div className='menu-btn-container'>
        <button className='menu-btn' onClick={handleMenuClick}>
          <img src={isOpen ? close : menu} width={'20px'}/>
        </button>
      </div>
      {isOpen && (
        <div className='side-menu'>
             <div>
              <Link className='menu-items' to={'/'}>Home</Link>
             </div>
             <div>
              <Link className='menu-items' to={'/about'}>About</Link>
             </div>
             <div>
              <Link className='menu-items' to={'/contact'}>Contact</Link>
             </div>
             {userData &&   <div >
               <Link className='menu-items' to={`profile/${userData.uid}`} >Profile</Link>
             </div>}
      {userData &&       <div className='log-out'>
                <button onClick={handleLogout}>Log Out</button>
             </div>}
        </div>
      )}
    </div>
  )
}