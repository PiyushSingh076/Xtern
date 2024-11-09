import React, {useState} from 'react'
import close  from '../../../../assets/svg/cancel-icon.svg'
import types from  '../../../../assets/svg/type.jpg'
import skill from '../../../../assets/svg/domain.jpg'
import available from '../../../../assets/svg/to.jpg'
import student from '../../../../assets/svg/student.jpg'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box } from '@mui/material';



export default function Become({setShow}) {
  const [Role , setRole] = useState(null);
  const [SkillsetArray, setSkillsetArray] = useState([]);
  const [AvailablityTo, setAvailablityTo] = useState(null)
  const [AvailablityFrom, setAvailablityFrom] = useState(null)
  const [studyingStatus, setStudyingStatus] = useState('');
  const [graduationYear, setGraduationYear] = useState('');


  const roles = [
    'Developer',
    'Digital marketer',
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Cyber Security Specialist',
    'Artificial Intelligence Engineer',
    'Full Stack Developer'
  ]


  const [skillset, setSkillset] = useState('');
  const [ratindDone , setRatingDone] = useState(false)
const [rating, setRating] = useState('');

const [programmingLanguages, setProgrammingLanguages] = useState([
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Swift',
  'PHP',
  'Go',
  'Rust',
]);

const handleAddSkill = () => {
  if (skillset && rating) {
    const newSkill = { skillset, rating };
    setSkillsetArray([...SkillsetArray, newSkill]);
    setSkillset('');
    setRating('');
  }
};

  const handleRoleChange =(event)=>{
    setRole(event.target.value)

  }

  const handleNextRating=()=>{
    if(SkillsetArray.length <=2){
        alert("Add atleast 3 skills")
    }
    else{
        setRatingDone(true)
        }
  }

  console.log(Role)

  return (
    <div className='pop-card'>
      <img onClick={()=>setShow(false)} src={close} className='close-icon' />
      <div className='pop-image-container'>
        <span>Become Xpert</span>
      {!Role &&  <img src={types} width={'90%'}/>}
       {Role && !ratindDone && <img src={skill} width={'90%'}/>}
       {Role && ratindDone && AvailablityTo==null && <img src={available} width={'100%'}/>}
       {Role && ratindDone && !graduationYear && !studyingStatus &&  AvailablityFrom && AvailablityTo && <img src={student} width={'90%'}/>}
      </div>
      <div className='xpert-info-input'>
       {!Role && <div className='info-input-section'>
          <div className='info-input-header'>
            <h2>You are Xpert in:</h2>
          </div>
          <div className='xpert-roles-options'>
          <div className="lang-sec">
            {
                roles.map((items)=>(
                    <div>
                    <input
                         type="radio"
                         id={items}
                         name="role"
                         value={items}
                         onChange={handleRoleChange}
             
                     />
                     <label className="custom-radio-sel-lang" htmlFor={items}>
                       {items}
                     </label>
                    </div>
                ))
            }
            
                
            </div>
          </div>
        </div>}

        {  Role && !ratindDone && <div className='des-select-skill-sec'>
            <span className='select-lang'>Your SkillSet:</span>
      
            <div className='skill-card-container'>
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
              {SkillsetArray.map((skills, index) => (
                <div className='des-skill-card' key={index}>
                  <span><b>{skills.skillset}</b> ({skills.rating})</span>
                </div>
              ))}
            </div>
      
             <button className='next-btn' onClick={handleNextRating}>Next</button>
          </div>
        }

        {
           ratindDone && AvailablityFrom == null && <div className='available-date-conrainer'>
               <span className='select-lang'>Availablity - From</span>
               <div>
  

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DateCalendar', 'DateCalendar']}>
    <DemoItem>
      <Box sx={{ width: '100%' , height: '400px' }}> {/* Adjust width as needed */}
        <DateCalendar value={AvailablityFrom} onChange={(newValue) => setAvailablityFrom(newValue)} />
      </Box>
    </DemoItem>
  </DemoContainer>
</LocalizationProvider>
  
               </div>
           </div>
        }

{
           AvailablityFrom !=null &&  AvailablityTo == null && <div className='available-date-conrainer'>
               <span className='select-lang'>Availablity - To</span>
               <div>
  

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DateCalendar', 'DateCalendar']}>
    <DemoItem>
      <Box sx={{ width: '100%' , height: '400px' }}> {/* Adjust width as needed */}
        <DateCalendar value={AvailablityTo} onChange={(newValue) => setAvailablityTo(newValue)} />
      </Box>
    </DemoItem>
  </DemoContainer>
</LocalizationProvider>
  
               </div>
           </div>
        }


        {
               AvailablityTo && 
               <div className='xpert-basic-info-container'>
               <span className='select-lang'>Basic Information:</span>
               <div  className='basic-info-options'>
                   <div>
                       <label htmlFor="studying-status">Still studying:</label>
                       <select 
                           className='xpert-studying'
                           id="studying-status"
                           onChange={(e) => setStudyingStatus(e.target.value)}
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
        }

     
      </div>
    </div>
  )
}