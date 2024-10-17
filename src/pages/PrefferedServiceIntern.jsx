import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInternInfo } from '../Store/Slice/InternInfo';
import { useNavigate } from 'react-router-dom';

export default function PrefferedService() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [potential, setPotential] = useState(null);
    const [skillset, setSkillset] = useState('');
    const [rating, setRating] = useState('');
    const [SkillsetArray, setSkillsetArray] = useState([]);
    const [availability, setAvailability] = useState({ from: '', to: '' });
    const [currentlyStudying, setCurrentlyStudying] = useState('');
    const [graduationYear, setGraduationYear] = useState('');

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
                alert('This skill has already been added.');
            } else {
                setSkillsetArray((prevArray) => [
                    ...prevArray,
                    { skillset, rating },
                ]);
                setSkillset('');
                setRating('');
            }
        }
    };

    const handleSubmit = () => {
        if (SkillsetArray.length < 2) {
            alert('Please add at least two skill.');
            return;
        }

        dispatch(setInternInfo({
            internType: potential,
            skillSet: SkillsetArray,
            availability: availability,
            currentlyStudying: currentlyStudying,
            graduationYear: graduationYear
        }));
        alert('Intern Info Submitted');
        navigate('/profile');
    };

    return (
        <div className='preffered-role-container'>
            <span className='hey-txt'>Hey, <span style={{ color: '#3374AE' }}>Intern</span></span>
        
            <div className="select-lang-sec">
                <span className='select-lang'>
                    Your potential in:
                </span>
            </div>
        
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
        
            <div className='select-skill-sec'>
                <span className='select-lang'>Your SkillSet:</span>
            
                <div className='skill-card-container'>
                    {SkillsetArray.map((skills, index) => (
                        <div className='skill-card' key={index}>
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
                <div className='availability-container'>
                    <div className="from">
                        <label htmlFor='From'>From:</label>
                        <input 
                            id='From' 
                            type='date' 
                            className='date-input'
                            onChange={(e) => setAvailability(prev => ({...prev, from: e.target.value}))}
                        />
                    </div>
                    <div className="to">
                        <label htmlFor='To'>To:</label>
                        <input 
                            id='To' 
                            type='date' 
                            className='date-input'
                            onChange={(e) => setAvailability(prev => ({...prev, to: e.target.value}))}
                        />
                    </div>
                </div>
            </div>

            <div className='basic-info-container'>
                <span className='select-lang'>Basic Information:</span>
                <div className='basic-info-options'>
                    <div>
                        <label htmlFor="studying-status">Still studying:</label>
                        <select 
                            id="studying-status"
                            onChange={(e) => setCurrentlyStudying(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div>
                        <label>Graduation Year:</label>
                        <select onChange={(e) => setGraduationYear(e.target.value)}>
                            <option value="">Select</option>
                            { [2024, 2023, 2022, 2021].map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            )) }
                        </select>
                    </div>
                </div>
            </div>
        
            <button className="select-btn" onClick={handleSubmit}>Next</button>
        </div>
    );
}
