import React from 'react'
import profile from '../../assets/images/banner/mentor.png';

export default function MyTeam() {

    const team = [
        {
            name: 'Rajesh Kumar',
            position: 'CEO'
        },
        {
            name: 'Priya Sharma',
            position: 'CTO'
        },
        {
            name: 'Amit Patel',
            position: 'COO'
        },
        {
            name: 'Neha Gupta',
            position: 'CFO'
        },
        {
            name: 'Vikram Singh',
            position: 'Head of Marketing'
        },
        {
            name: 'Ananya Reddy',
            position: 'HR Manager'
        },
        {
            name: 'Sanjay Mehta',
            position: 'Product Manager'
        },
        {
            name: 'Deepa Verma',
            position: 'Lead Developer'
        }
    ]

  return (
    <div style={{marginTop: '20px'}} className='info-card-container'>
      {team.map((item, index) => (
        <div key={index} className='info-card-myteam'>
          <img src={profile} alt="profile" width={'80px'}/>
          <div className='info-card-myteam-content'>
            <h4>{item.name}</h4>
            <span className='position-tag'>{item.position}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
