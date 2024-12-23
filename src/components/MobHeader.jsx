import React, { useState } from 'react'
import menu from '../assets/svg/menu.svg'
import close from '../assets/svg/close.png'
import { Link } from 'react-router-dom'
import useFetchUserData from '../hooks/Auth/useFetchUserData'
import useOAuthLogout from '../hooks/Auth/useOAuthLogout'
import { useNavigate } from 'react-router-dom'
import { AiOutlineUser, AiOutlineWallet, AiOutlineQuestionCircle, AiOutlineLogout } from 'react-icons/ai';

export default function MobHeader() {
  
  const [isOpen, setIsOpen] = useState(false)
  const [profileMenu , setProfileMenu] = useState(false)
  const {userData} = useFetchUserData()
  const {handleLogout} = useOAuthLogout()

  const navigate = useNavigate()

  const handleMenuClick = () => {
    setIsOpen(!isOpen)

 
  }

  const handleMenuToggle = () => {
  
    setProfileMenu((prev) => !prev);
   
  };

  const handleMenuOptionClick = (route) => {
    setProfileMenu(false); 
    navigate(route);
  };

  return (
    <div className='mob-header-container' style={{border: isOpen && 'none' }}>
     
      <div className='menu-btn-container'>
        <button className='menu-btn' onClick={handleMenuClick}>
          <img src={isOpen ? close : menu} width={'20px'}/>
        </button>
      </div>
      <div
      onClick={()=> navigate('/homescreen')}
       className='Logo-container'><span style={{color: '#0d6efd' , fontSize: '22px'}}>X</span>pert</div>

      <div className='back-btn-container'>
        <img 
        onClick={handleMenuToggle}
        src={userData?.photo_url} width={'25px'} style={{borderRadius: '50%'}}/>
      </div>

      { 
         profileMenu && (
          <div 
          className='dropdown-menu'
          style={{
            position: 'absolute',
            top: '50px',
            right: '0px',
            backgroundColor: '#fff',
            width: '100px',
            height: 'auto',
            border: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
  
          }}
          >
         <div 
              className="dropdown-item" 
              onClick={() => handleMenuOptionClick(`profile/${userData?.uid}`)}
            >
              <AiOutlineUser className="menu-icon" />
              Profile
            </div>
            <div 
              className="dropdown-item" 
              onClick={() => handleMenuOptionClick('/wallet')}
            >
              <AiOutlineWallet className="menu-icon" />
              Wallet
            </div>
            <div 
              className="dropdown-item" 
              onClick={() => handleMenuOptionClick('/support')}
            >
              <AiOutlineQuestionCircle className="menu-icon" />
              Support
            </div>
            <div 
              className="dropdown-item" 
              onClick={() => handleMenuOptionClick('/support')}
            >
              <AiOutlineQuestionCircle className="menu-icon" />
              My Schedule
            </div>
            <div 
              className="dropdown-item logout" 
              onClick={()=>{ handleLogout(); setProfileMenu(false) }}
            >
              <AiOutlineLogout className="menu-icon" />
              Log Out
            </div>
          </div>
        )
      }
   
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