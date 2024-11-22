import React, { useState } from "react";
import "./Form.css";
import { FiTrash } from "react-icons/fi";
import { State, City } from "country-state-city";
import { useDispatch } from "react-redux";
import { setDetail } from "../../../Store/Slice/UserDetail";
import { Route, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

export default function StepperForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

  
    //Form Detail Elements

   
    const [FirstName , setFirstName] = useState('')
    const [LastName , setLastName] = useState('')
    const [Xpert , setXpert] = useState(null)
    const [Experience , setExperience] = useState(null)
    const [profileImg , setProfileImg] = useState(null)
    const [selectedState, setSelectedState] = useState(""); 
    const [cities, setCities] = useState([]); 
    const [selectedCity, setSelectedCity] = useState('')
    const[Education , setEducation] = useState([])
    const[Work , setWork] = useState([])
    const[Skills , setSkills] = useState([])
    const[Projects , setProjects] = useState([])
    const [Services , setServices] = useState([])
    const [ConsultingPrice , setConsultingPrice] = useState(null)
    const [ConsultingDuration , setConsultingDuration] = useState(null)
    const [ConsultingDurationType , setConsultingDeurationType] = useState(null)

    console.log(Work ,'Work')



   //Flow control

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [step, setStep] = useState(1);

    const handleProfileImage = (event) =>{
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setProfileImg(reader.result);
          reader.readAsDataURL(file);
        }
    }


    const handleSubmitInfo = () => {
       
        if (FirstName && LastName && Xpert && Experience && selectedState && profileImg && cities) {
            alert('clicked')
           let data = {
                "firstName": FirstName
                , "lastName": LastName
                , "expertise": Xpert
                , "experience": Experience
                , "profileImage": profileImg
                , "state": selectedState
                , "city": selectedCity
                , 'education' : Education
                , 'work' : Work
                , 'skills' : Skills
                , 'projects' : Projects
                , 'services' : Services
                , 'consultingPrice' : ConsultingPrice
                , 'consultingDuration' : ConsultingDuration
                , 'consultingDurationType' : ConsultingDurationType

                
            }

            console.log('excute here...')
            console.log(data)
            dispatch(setDetail(data))
            navigate(ROUTES.HOME_SCREEN)
        
        }

        else{
        
       
{FirstName === '' && alert('First Name is required')}
{LastName === '' && alert('Last Name is required')}
{Xpert === null && alert('Xpert Type is required')}
{Experience === null && alert('Years of Experience is required')}
{selectedState === '' && alert('State is required')}
{profileImg === null && alert('Profile Image is required')}
{cities.length === 0 && alert('City is required')}


            
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
    
        console.log(data, 'data');
        console.log(modalType , 'type')
       
        saveDetail(modalType.toLowerCase(), data); 
        closeModal(); 
    };

    const saveDetail = (type, data) => {
        switch (type) {
            case 'education':
                setEducation([...Education, data]);
                break;
            case 'work':
                setWork([...Work, data]);
                break;
            case 'skill':
                setSkills([...Skills, data]);
                break;
            case 'project':
                setProjects([...Projects, data]);
                break;
            case 'service':
                setServices([...Services, data]);
            default:
                console.error("Invalid type");
        }
    };


    const deleteDetail = (type, index) => {
        switch (type) {
            case 'education':
                setEducation(Education.filter((_, i) => i !== index));
                break;
            case 'work':
                setWork(Work.filter((_, i) => i !== index));
                break;
            case 'skill':
                setSkills(Skills.filter((_, i) => i !== index));
                break;
            case 'project':
                setProjects(Projects.filter((_, i) => i !== index));
                break;
            case 'service':
                setServices(Services.filter((_, i) => i !== index));
            default:
                console.error("Invalid type");
        }
    };

    // Fetch all Indian states
    const indiaStates = State.getAllStates().filter(
        (items) => items.countryCode === "IN"
    );

    const handleStateChange = (stateCode) => {
        setSelectedState(stateCode);
 
        const stateCities = City.getCitiesOfState("IN", stateCode);
        setCities(stateCities);
    };



    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType("");
    };


const xpert = [
  "Developer",
  "Designer",
  "Cloud Devops",
  "Content Creator",
  "Digital Marketing",
  "Lawyer",
  "HR",
  "Accountant"
]

const degrees = [
    'High-School',
    'Bachelor',
    'Master',
    'PhD'

]

    return (
        <div className="stepper-form-container">
                <div className='stepper-naigation-container'>
          <div className='step-no-title-container'>
            <div 
            onClick={()=>setStep(1)}
            className={step == 1 ? 'step-no-container-active' : 'step-no-container'}>
                1
            </div>
            Profile
          </div>

          <div className='line-bar'></div>


          <div 
          onClick={()=>setStep(2)}
          className='step-no-title-container'>
          
            <div className={step == 2 ? 'step-no-container-active' : 'step-no-container'}>
                2
            </div>
            Offering
          </div>
   </div>

            <div className="profile-step-container">
                <div className="profile-picture-section">
             
          <input
            className="file-input"
            type="file"
            id="hiddenFileInput"
            style={{ display: 'none' }}
            onChange={handleProfileImage} 
          />
                    <img
                         onClick={() => document.getElementById('hiddenFileInput').click()}
                        width={"200px"}
                        className="dp"
                        src={profileImg ? profileImg : 'https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg'}
                        alt="Profile"
                    />
                    <div className="personal-info-section">
                        <div className="name-section">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input-name"
                                value={FirstName}
                              onChange={(e)=>setFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input-name"
                                value={LastName}
                             onChange={(e)=>setLastName(e.target.value)}
                            />
                        </div>

                        <span className="label-title">Location: </span>
                        <div className="location-section">
                            {/* State Dropdown */}
                            <select
                                onChange={(e) =>
                                    handleStateChange(e.target.value)
                                }
                            >
                                <option value="">Select a State</option>
                                {indiaStates.map((state) => (
                                    <option
                                        key={state.isoCode}
                                        value={state.isoCode}
                                    >
                                        {state.name}
                                    </option>
                                ))}
                            </select>

                            {/* City Dropdown */}
                            <select 
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedState}>
                                <option value="">Select a City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <span className="label-title">Xpert Type: </span>
                        <div className="xpert-type-section">
                           <select 
                          onChange={(e) => setXpert(e.target.value)}
                           style={{width: '100%'}}>
                            <option value="">Select a Xpert Type</option>
                            {xpert.map((items)=>(
                              <option key={items.id} value={items.name}>{items}</option>
                            ))}
                           </select>
                        </div>

                        <span className="label-title">Years Of Experience:</span>
                        <div className="xpert-type-section">
                           <select
                           onChange={(e) => setExperience(e.target.value)}
                            style={{width: '100%'}}>
                            <option value="">Select Year of Experience</option>
                            {[1,2,3,4,5,6,7,8,9,10].map((items)=>(
                              <option key={items.id} value={items.name}>{items}</option>
                            ))}
                           </select>
                        </div>

                    </div>
                </div>
               {step == 1 && <div className="detail-section">
                    <button
                    className="next-step-btn"
                    onClick={()=>setStep(2)}
                    >
                        Next Step
                    </button>
                      <div className="acadamic-section">
                   
                        <div className="education-section">
                            <div className="title-section">
                                <span className="label-title">Education</span>
                            </div>

                            <div className="add-detail-section">
                                 <div className="card-list-container">
                                {
                                    Education.map((item, index) => (
                                        <div className="details-card">
                                        <FiTrash 
                                        onClick={()=>deleteDetail('education' , index)}
                                        size={20} color="red" className="trash-icon"/>
                                              <span><b>{item.degree},{item.stream}</b></span>
                                              <span>{item.college}</span>
                                              <span>{new Date(item.startDate).toLocaleString('default', { month: 'short', year: 'numeric' })}-{new Date(item.endDate).toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                                              <span>CGPA: {item.cgpa}</span>
                                          </div>
                                    ))
                                }
 
                                 </div>
                                  <button
                                    onClick={() => openModal("Education")}
                                   className="add-detail-btn">+ Add Eduction</button>
                            </div>
                        </div>

                        <div className="education-section">
                            <div className="title-section">
                                <span className="label-title">Skills</span>
                            </div>
                          

                            <div className="add-detail-section">
                            <div className="card-list-container">
                                {
                                    Skills.map((item, index) => (
                                        <div className="details-card">
                                        <FiTrash
                                        onClick={()=>deleteDetail('skill' , index)}
                                         size={20} color="red" className="trash-icon"/>
                                         <span>{item.skill}</span>
                                          </div>
                                    ))
                                }
                            </div>
                                  <button
                                     onClick={() => openModal("Skill")}
                                   className="add-detail-btn">+ Add Skill</button>
                            </div>
                        </div>

                        <div className="education-section">
                            <div className="title-section">
                                <span className="label-title">Work Experience</span>
                            </div>

                            <div className="add-detail-section">
                            <div className="card-list-container">
                                {
                                    Work.map((item, index) => (
                                        <div className="details-card">
                                        <FiTrash
                                        onClick={()=>deleteDetail('work' , index)}
                                         size={20} color="red" className="trash-icon"/>
                                              <span><b>{item.position}</b></span>
                                              <span>{item.company}</span>
                                              <span>{new Date(item.startDate).toLocaleString('default', { month: 'short', year: 'numeric' })}-{new Date(item.endDate).toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                                          
                                          </div>
        
                                    ))
                                }
                                 </div>
                                  <button 
                                  onClick={() => openModal("Work")}
                                  className="add-detail-btn">+ Add Work Experience</button>
                            </div>
                        </div>


                        <div className="education-section">
                            <div className="title-section">
                                <span className="label-title">projects/Assignments</span>
                            </div>

                            <div className="add-detail-section">
                            <div className="card-list-container">
                   {
                                Projects.map((item, index) => (
                                    <div className="details-card" key={index}>
                                        <FiTrash
                                        onClick={()=>deleteDetail('project' , index)}
                                         size={20} color="red" className="trash-icon"/>
                                        <span><b>{item.projectName}</b></span>
                                        <span>{item.duration}</span>
                                        <span>{item.liveLink}</span>
                                        <span>{item.description}</span>
                                    </div>
                                ))
                            }
                            
                                 </div>
                                  <button 
                                  onClick={() => openModal("Project")}
                                  className="add-detail-btn">+ Add Project/Assignment</button>
                            </div>
                        </div>

                      </div>
                 
                </div>}

                {step == 2 && <div className="offering-container">
                  <div className="offering-section">
                  <div className="title-section">
                        <span className="label-title">Consulting Charges</span>
                   </div>
                    <div className="add-offering-section">
                        <input
                        value={ConsultingPrice}
                        onChange={(e) => setConsultingPrice(e.target.value)}
                         type="text" placeholder="Price in Rs." className="input-price"/>
                        <span style={{width: '40px', textAlign: 'center'}}>For </span>

                        <input
                        value={ConsultingDuration}
                        onChange={(e) => setConsultingDuration(e.target.value)}
                         type="text" placeholder="time" />
                         <select
                         value={ConsultingDurationType}
                         onChange={(e) => setConsultingDeurationType(e.target.value)}
                          style={{marginLeft: '3px'}}>
                            <option value="per hour">per hour</option>
                            <option value="per day">per day</option>
                            <option value="per week">per week</option>
                            <option value="per month">per month</option>

                         </select>
                    </div>
                   
                  </div>


                  <div className="education-section">
                            <div className="title-section">
                                <span className="label-title">Services</span>
                            </div>

                            <div className="add-detail-section">
                                 <div className="card-list-container">
                                {
                                    Services.map((item, index) => (
                                        <div className="details-card">
                                        <FiTrash 
                                        onClick={()=>deleteDetail('service' , index)}
                                        size={20} color="red" className="trash-icon"/>
                                              <span><b>{item.serviceName}</b></span>
                                              <span>{item.serviceDescription}</span>
                                              <span>Price: ₹{item.servicePrice}</span>
                                          </div>
                                    ))
                                }
 
                                 </div>
                                  <button
                                    onClick={() => openModal("Service")}
                                   className="add-detail-btn">+ Add Services</button>
                            </div>
                        </div>




                     <button
                    className="next-step-btn"
                    onClick={handleSubmitInfo}
                    >
                        Submit
                    </button>
            </div>}
            </div>


          

              {/* Modal Component */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h4>Add {modalType}</h4>
                        <br/>
                        <form onSubmit={handleSubmit}>
    {modalType === "Education" && (
        <>  
            <label>Degree:</label>
            <input type="text" name="degree" placeholder="Degree" required />
            <label>Stream:</label>
            <input type="text" name="stream" placeholder="Stream" required />
            <label>College:</label>
            <input type="text" name="college" placeholder="College" required />
            <div className="main-date-container">
                <div className="date-container">
                    <span>Start</span>
                    <input type="date" name="startDate" className="input-date" required />
                </div>
                <div  className="date-container" >
                    <span>End</span>
                    <input type="date" name="endDate" className="input-date" required />
                </div>
            </div>
            <label>CGPA:</label>
            <input type="number" name="cgpa" placeholder="CGPA" step="0.1" required />
        </>
    )}
    {modalType === "Skill" && (
        <>
            <input type="text" name="skill" placeholder="Skill Name" required />
        </>
    )}
    {modalType === "Work" && (
        <>
            <label>Position:</label>
            <input type="text" name="position" placeholder="Job Title" required />
            <label>Company:</label>
            <input type="text" name="company" placeholder="Company Name" required />
            <div className="main-date-container">
                <div className="date-container">
                    <span>Start</span>
                    <input type="date" name="startDate" className="input-date" required />
                </div>
                <div  className="date-container" >
                    <span>End</span>
                    <input type="date" name="endDate" className="input-date" required />
                </div>
            </div>
        </>
    )}
    {modalType === "Project" && (
        <>
            <label>Project Name:</label>
            <input type="text" name="projectName" placeholder="Project Name" required />
            <label>Duration:</label>
            <input type="text" name="duration" placeholder="Duration" required />
            <label>Live Link:</label>
            <input type="text" name="liveLink" placeholder="Link" />
            <label>Description:</label>
            <textarea name="description" placeholder="Description" required></textarea>
        </>
    )}

    {
        modalType ==='Service' && (
           <>
           <label>Service Name:</label>
           <input type="text" name="serviceName" placeholder="Service Name" required />
           <label>Service Description:</label>
           <textarea name="serviceDescription" placeholder="Service Description" required></textarea>
           <label>Service Price:</label>
           <input type="number" name="servicePrice" placeholder="Service Price" required />

           </>
        )
    }
    <div className="modal-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={closeModal}>Cancel</button>
    </div>
</form>
                    </div>
                </div>
            )}
        </div>
    );
}