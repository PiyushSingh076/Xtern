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


export default function Homepage() {
  const  [show, setShow] = useState(false);

  return (
    <div className='homescreen-container'>
      <LandingBanner pop={setShow}/>
     {!show && <div>
      <Categories/>
      <Xperts/>
      <Xterns/>
      <TrustedComoany/>
      <ImageBtn/>
      <BlogSection/>
      <Footer/>
      </div>}

      {

         show && <div className='popup-container'>
                <Become setShow={setShow}/>
         </div>
      }
    </div>
  )
}
