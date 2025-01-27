// import React, { useState } from "react";
// import EditIcon from "@mui/icons-material/Edit";
// import "./editServiceForm.css";

// const EditServiceForm = ({ initialDetails, onSave, onCancel }) => {
//   const [serviceDetails, setServiceDetails] = useState(initialDetails);
//   const [isEditing, setIsEditing] = useState(true);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setServiceDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     onSave(serviceDetails);
//     setIsEditing(false);
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="modal-content">
//         <h4>Update Service Details</h4>
//         {isEditing && (
//           <div>
//             <input
//               type="text"
//               name="serviceName"
//               value={serviceDetails.serviceName}
//               onChange={handleInputChange}
//               placeholder="Service Name"
//               className="modal-input"
//             />
//             <input
//               type="number"
//               name="servicePrice"
//               value={serviceDetails.servicePrice}
//               onChange={handleInputChange}
//               placeholder="Service Price"
//               className="modal-input"
//             />
//             <select
//               name="serviceLevel"
//               value={serviceDetails.serviceLevel}
//               onChange={handleInputChange}
//               className="modal-input"
//             >
//               <option value="Easy">Easy</option>
//               <option value="Medium">Medium</option>
//               <option value="Hard">Hard</option>
//             </select>
//             <input
//               type="number"
//               name="serviceDuration"
//               value={serviceDetails.serviceDuration}
//               onChange={handleInputChange}
//               placeholder="Duration (in minutes)"
//               className="modal-input"
//             />
//             <div className="modal-buttons">
//               <button onClick={handleSave} className="modal-save-btn">
//                 Save
//               </button>
//               <button onClick={onCancel} className="modal-cancel-btn">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditServiceForm;

import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import "./editServiceForm.css";

const EditServiceForm = ({ initialDetails, onSave, onCancel }) => {
  const [serviceDetails, setServiceDetails] = useState(initialDetails);
  const [isEditing, setIsEditing] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(serviceDetails);
    setIsEditing(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>Update Service Details</h4>
        {isEditing && (
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="serviceName">Service Name:</label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={serviceDetails.serviceName}
                onChange={handleInputChange}
                placeholder="Service Name"
                className="modal-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="servicePrice">Service Price:</label>
              <input
                type="number"
                id="servicePrice"
                name="servicePrice"
                value={serviceDetails.servicePrice}
                onChange={handleInputChange}
                placeholder="Service Price"
                className="modal-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceLevel">Service Level:</label>
              <select
                id="serviceLevel"
                name="serviceLevel"
                value={serviceDetails.serviceLevel}
                onChange={handleInputChange}
                className="modal-input"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="serviceDuration">Service Duration:</label>
              <input
                type="number"
                id="serviceDuration"
                name="serviceDuration"
                value={serviceDetails.serviceDuration}
                onChange={handleInputChange}
                placeholder="Duration (in minutes)"
                className="modal-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceDescription">Description:</label>
              <textarea
                id="serviceDescription"
                name="serviceDescription"
                value={serviceDetails.serviceDescription}
                onChange={handleInputChange}
                placeholder="Enter service description"
                className="modal-input"
              />
            </div>
            <div className="modal-buttons">
              <button className="modal-save-btn">Save</button>
              <button onClick={onCancel} className="modal-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditServiceForm;
