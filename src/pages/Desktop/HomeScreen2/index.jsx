import React ,{ useState} from 'react'
import './Homescreen.css'
import LandingBanner from './LandingBanner'
import Categories from './Categories'
import Xperts from './Xperts'
import Xterns from './Xterns'
import TrustedComoany from './TrustedComoany'
import ImageBtn from './ImageBtn'
import BlogSection from './BlogSection'
import Footer from '../Footer/Footer'
import Hire from './Popup/Hire'
import Become from './Popup/Become'
import Org from './EmployerDashboad'
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useUserProfileData from '../../../hooks/Profile/useUserProfileData'
import Loading from '../../../components/Loading'


export default function Homepage() {
  const  [show, setShow] = useState(false);
  const [Role , setRole] = useState('')

  const { userData, loading, error } = useFetchUserData();


  const {
    userData: profileData,
    loading: profileLoading,
    error: profileError,
  } = useUserProfileData(userData?.uid);
  console.log("profileData", profileData, profileError);

  console.log(Role)


  return (
    <div className='homescreen-container'>
  {!userData &&     <LandingBanner pop={setShow} setRole={setRole}/>}
     {profileData?.organization ? <Org data={profileData}/> : <div style={{width: '100%' , height: '100vh' , display: 'flex', alignItems: 'center' , justifyContent: 'center'} }> Loading...  </div>}
     {!show && <div>
  {!userData &&  <div>
    <Categories/>
      <Xperts/>
      <Xterns/>
      <TrustedComoany/>
      <ImageBtn/>
      <BlogSection/>
    </div>
    }
      <Footer/>
      </div>}

      {

         show && <div className='popup-container'>
                {Role == 'Bxpert' && <Become setShow={setShow}/>}
                {Role == 'Hxpert' && <Hire setShow={setShow}/>}
         </div>
      }
    </div>
  )
}
