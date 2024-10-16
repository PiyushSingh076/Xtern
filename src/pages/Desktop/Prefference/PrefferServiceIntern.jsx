import React, { useState } from 'react';
import './Prefference.css'


export default function PrefferedService() {
  const [potential, setPotential] = useState(null);
  const [skillset, setSkillset] = useState(''); // Store selected skillset
  const [rating, setRating] = useState(''); // Store selected rating
  const [SkillsetArray, setSkillsetArray] = useState([]); // Store the array of skillset and rating

  const programmingLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 
    'Kotlin', 'Swift', 'PHP', 'C#', 'Go', 
    'Rust', 'TypeScript', 'Dart', 'R', 'Perl', 
    'Scala', 'Elixir', 'Haskell', 'Lua', 'Objective-C'
  ];

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setPotential(selectedRole);
  };

  // Function to handle adding new skillset and rating
  const handleAddSkill = () => {
    if (skillset && rating) {
      setSkillsetArray((prevArray) => [
        ...prevArray,
        { skillset, rating }, // Add the new skillset and rating to the array
      ]);
      setSkillset(''); // Clear the selected skillset after adding
      setRating(''); // Clear the rating after adding
    }
  };

  return (
    <div className='des-preffered-intern-container'>
      <span className='hey-txt'>Hey, <span style={{ color: '#3374AE' }}>Intern</span></span>
  
   
        <span className='select-lang'>
          Your potential in:
        </span>

  
      <div className="lang-sec">
        <input
          type="radio"
          id="developer-intern"
          name="role"
          value="Developer Intern"
          onChange={handleRoleChange}
          checked={potential === 'Developer Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="developer-intern">
          Developer Intern
        </label>
  
        <input
          type="radio"
          id="generalist-intern"
          name="role"
          value="Generalist Intern"
          onChange={handleRoleChange}
          checked={potential === 'Generalist Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="generalist-intern">
          Generalist Intern
        </label>
  
        <input
          type="radio"
          id="marketing-intern"
          name="role"
          value="Marketing Intern"
          onChange={handleRoleChange}
          checked={potential === 'Marketing Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="marketing-intern">
          Marketing Intern
        </label>
  
        <input
          type="radio"
          id="design-intern"
          name="role"
          value="Design Intern"
          onChange={handleRoleChange}
          checked={potential === 'Design Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="design-intern">
          Design Intern
        </label>
  
        <input
          type="radio"
          id="sales-intern"
          name="role"
          value="Sales Intern"
          onChange={handleRoleChange}
          checked={potential === 'Sales Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="sales-intern">
          Sales Intern
        </label>
      </div>
  
      <div className='des-select-skill-sec'>
        <span className='select-lang'>Your SkillSet:</span>
  
        <div className='skill-card-container'>
          {SkillsetArray.map((skills, index) => (
            <div className='des-skill-card' key={index}>
              <span><b>{skills.skillset}</b> ({skills.rating})</span>
            </div>
          ))}
        </div>
  
        <div className='select-option-container'>
          <select
            className='select-option-input-skill'
            value={skillset}
            onChange={(e) => setSkillset(e.target.value)}
          >
            <option value="">Skillset</option>
            {
              programmingLanguages.map((items, index) => 
                <option key={index} value={items}>{items}</option>
              )
            }
          </select>
  
          <select
            className='select-option-input-rating'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Rating</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
  
          <button className='add-btn' onClick={handleAddSkill}>
            Add
          </button>
        </div>
      </div>
  
      <div>
        <span className='select-lang'>Availability:</span>
        <div className='des-availability-container'>
          <div className="from">
            <label htmlFor='From'>From:</label>
            <input id='From' type='date' className='des-date-input' />
          </div>
          <div className="to">
            <label htmlFor='To'>To:</label>
            <input id='To' type='date' className='des-date-input' />
          </div>
        </div>
      </div>

      <div className='des-basic-info-container'>
        <span className='select-lang'>Basic Information:</span>
        <div className='des-basic-info-options'>
          <div className='des-basic-option'>
            <label htmlFor="studying-status">Still studying:</label>
            <select id="studying-status">
              <option>Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            
          </div>

          <div  className='des-basic-option'>
            <label>Graduation Year:</label>
            <select>
              {[2024, 2023, 2022, 2021].map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
  
      <button className="select-btn">Next</button>
    </div>
  );
}
