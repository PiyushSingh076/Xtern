import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setInternInfo } from '../../../Store/Slice/InternInfo';
import './Prefference.css';

export default function PrefferedService() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [potential, setPotential] = useState(null);
  const [skillset, setSkillset] = useState('');
  const [rating, setRating] = useState('');
  const [SkillsetArray, setSkillsetArray] = useState([]);
  const [availability, setAvailability] = useState({ from: '', to: '' });
  const [studyingStatus, setStudyingStatus] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [error, setError] = useState('');

  const programmingLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 
    'Kotlin', 'Swift', 'PHP', 'C#', 'Go', 
    'Rust', 'TypeScript', 'Dart', 'R', 'Perl', 
    'Scala', 'Elixir', 'Haskell', 'Lua', 'Objective-C'
  ];

  const handleRoleChange = (event) => {
    setPotential(event.target.value);
  };

  const handleAddSkill = () => {
    if (skillset && rating) {
      const skillExists = SkillsetArray.some(skill => skill.skillset.toLowerCase() === skillset.toLowerCase());
      if (skillExists) {
        setError('This skill has already been added.');
      } else {
        setSkillsetArray((prevArray) => [
          ...prevArray,
          { skillset, rating },
        ]);
        setSkillset('');
        setRating('');
        setError('');
      }
    } else {
      setError('Please select both a skillset and a rating.');
    }
  };

  const handleSubmit = () => {
    if (!potential) {
      setError('Please select your potential role.');
      return;
    }

    if (SkillsetArray.length < 2) {
      setError('Please add at least two skills.');
      return;
    }

    if (!availability.from || !availability.to) {
      setError('Please select both start and end dates for availability.');
      return;
    }

    if (!studyingStatus) {
      setError('Please select your studying status.');
      return;
    }

    if (!graduationYear) {
      setError('Please select your graduation year.');
      return;
    }

    dispatch(setInternInfo({
      internType: potential,
      skillSet: SkillsetArray,
      availability: availability,
      currentlyStudying: studyingStatus,
      graduationYear: graduationYear
    }));
    alert('Intern Info Submitted');
    navigate('/profile');
  };

  return (
    <div className='des-preffered-intern-container'>
      <span className='hey-txt'>Hey, <span style={{ color: '#3374AE' }}>Intern</span></span>
  
      <span className='select-lang'>
        Your potential in:
      </span>

      <div className="lang-sec">
        {['Developer Intern', 'Generalist Intern', 'Marketing Intern', 'Design Intern', 'Sales Intern'].map((role) => (
          <React.Fragment key={role}>
            <input
              type="radio"
              id={role.toLowerCase().replace(' ', '-')}
              name="role"
              value={role}
              onChange={handleRoleChange}
              checked={potential === role}
            />
            <label className="custom-radio-sel-lang" htmlFor={role.toLowerCase().replace(' ', '-')}>
              {role}
            </label>
          </React.Fragment>
        ))}
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
            {programmingLanguages.map((item, index) => 
              <option key={index} value={item}>{item}</option>
            )}
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
            <input 
              id='From' 
              type='date' 
              className='des-date-input'
              value={availability.from}
              onChange={(e) => setAvailability({...availability, from: e.target.value})}
            />
          </div>
          <div className="to">
            <label htmlFor='To'>To:</label>
            <input 
              id='To' 
              type='date' 
              className='des-date-input'
              value={availability.to}
              onChange={(e) => setAvailability({...availability, to: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className='des-basic-info-container'>
        <span className='select-lang'>Basic Information:</span>
        <div className='des-basic-info-options'>
          <div className='des-basic-option'>
            <label htmlFor="studying-status">Still studying:</label>
            <select 
              id="studying-status"
              value={studyingStatus}
              onChange={(e) => setStudyingStatus(e.target.value)}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className='des-basic-option'>
            <label>Graduation Year:</label>
            <select
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
            >
              <option value="">Select</option>
              {[2024, 2023, 2022, 2021].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
  
      {error && <p className="error-message">{error}</p>}
      <button className="select-btn" onClick={handleSubmit}>Next</button>
    </div>
  );
}
