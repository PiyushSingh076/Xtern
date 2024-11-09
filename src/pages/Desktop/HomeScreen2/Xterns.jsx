import React from 'react'
import './Homescreen.css'

export default function Xterns() {
    const quality = [
        { id: 1, name: 'Top Universities', description: 'Interns from top universities are trained with real world projects to deliver the best of tech.'},
        { id: 2, name: 'Best Coders', description: 'Rimberio specializes in resilient strategies, tackling difficulties with tenacity and flexiblity. '},
        { id: 3, name: 'AI Assessments', description: 'Xterns are thoroughly assessed and ranked based on AI backed assessments.'},
        { id: 4, name: 'Real World Projects', description: 'Xterns have extensive experience working on real-world projects and a history of notable achievements in tech.'}
      ]
  return (
    <div className="Xterns-container">
    <div className="Xperts-content-section">
      <div className="Xpert-text-area">
        <h1 className="Xpert-text">Xperts</h1>
        <span>Hire Industry Expert Consultants</span>
        <div className="xpert-quality-card-container">
          {quality.map((item) => (
            <div key={item.id} className="xpert-quality-card">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="Xtren-img-section">
      <div className='img-vector'>
      <img className='xtern-vector' src='https://xpert.works/wp-content/uploads/2024/05/Rectangle-3586-min.png'/>
      <img className='xtern-img' src='https://xpert.works/wp-content/uploads/2024/05/Mask-group-1-min-1.png' />
      </div>
      <button className="hire-xterns-btn"><h4 className="hire-xpert-title">Hire Xpert</h4> <span className="hire-xpert-subtitle">Industry Expert Consultants</span></button>
    </div>
  </div>
  )
}
