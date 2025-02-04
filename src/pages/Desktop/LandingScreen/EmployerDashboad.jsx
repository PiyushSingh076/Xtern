import React from 'react'
import { Link } from 'react-router-dom'

export default function Org({data}) {


  return (
 
       <div className='organsationDashboard'>
        <div className='organsation-profile-section'>
             <div className='organsation-profile-card'>
                     <img src={data?.photo_url} className='org-dp'/>

                     <div className='org-profile-info'>
                      
                        <h2>{data?.display_name}</h2>
                        <b>{data?.email}</b>
                        <span>Type: {data?.organization ? 'Organization': 'Xpert'}</span>
                        <span>Role: {data?.role}</span>

                     </div>
             </div>
        </div>

        <div className='organsation-control-btn-section'>
             <Link to='teams/shortlisted' className='control-btn'>ShortListed Interns</Link>
             <Link to='teams/xtern' className='control-btn'>Xtern</Link>
             <Link to='teams/colleagues' className='control-btn'>Teams</Link>
             <Link to='teams/payments' className='control-btn'>Payments</Link>

        </div>
    </div>

  )
}
