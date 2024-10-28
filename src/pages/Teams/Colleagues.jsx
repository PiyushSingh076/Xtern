// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import MyTeam from "./MyTeam";
// import Invites from "./Invites";
// import plusIcon from "../../assets/svg/plus-icon.svg";
// import closeIcon from "../../assets/svg/cancel-icon.svg";

// export default function Colleagues() {
//   const [index, setIndex] = useState(0);

//   return (
//     <div className="colleagues-container">
//       <div className="add-colleague-btn-section">
//         <button
//           className="add-colleague-btn"
//           data-bs-toggle="modal"
//           data-bs-target="#inviteModal"
//         >
//           <img
//             src={plusIcon}
//             alt="plus-icon"
//             className="add-colleague-btn-icon"
//             width={"30px"}
//           />
//         </button>
//       </div>

//       <div
//         className="modal fade"
//         id="inviteModal"
//         tabIndex="-1"
//         aria-labelledby="inviteModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content invite-modal">
//             <div className="modal-header invite-modal-header">
//               <h5
//                 className="modal-title invite-modal-title"
//                 id="inviteModalLabel"
//               >
//                 Send Invite
//               </h5>
//               <button
//                 type="button"
//                 className="invite-btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <img
//                   src={closeIcon}
//                   alt="close-icon"
//                   width={"30px"}
//                   className="invite-modal-close-icon"
//                 />
//               </button>
//             </div>
//             <div className="modal-body invite-modal-body">
//               <input
//                 type="text"
//                 placeholder="Enter phone number"
//                 className="invite-modal-input"
//               />
//               <input
//                 type="text"
//                 placeholder="Role of the member"
//                 className="invite-modal-input"
//               />
//               <button type="button" className="invite-modal-btn">
//                 Send invite
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="colleague-btn-section">
//         <button
//           onClick={() => setIndex(0)}
//           className={`colleagues-btn ${index === 0 ? "active" : ""}`}
//         >
//           My Team
//         </button>
//         <button
//           onClick={() => setIndex(1)}
//           className={`colleagues-btn ${index === 1 ? "active" : ""}`}
//         >
//           Invites
//         </button>
//       </div>

//       {index === 0 && <MyTeam />}
//       {index === 1 && <Invites />}
//     </div>
//   );
// }
import React, { useState } from "react";
import MyTeam from "./MyTeam";
import Invites from "./Invites";
import plusIcon from "../../assets/svg/plus-icon.svg";
import closeIcon from "../../assets/svg/cancel-icon.svg";
import useSendInvite from "../../hooks/Teams/useSendInvite";

export default function Colleagues() {
  const [index, setIndex] = useState(0);
  const [invitedPhone, setInvitedPhone] = useState("");
  const [role, setRole] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const countryCodes = ["+91", "+92", "+93", "+94", "+95"];

  const { sendInvite, loading, error } = useSendInvite();

  const handleInviteSend = async () => {
    if (!invitedPhone || !role) {
      alert("Please enter both phone number and role.");
      return;
    }

    // Remove any existing country code from phone number
    const phoneWithoutCode = invitedPhone.replace(/^\+\d{2}/, '');
    const fullPhoneNumber = countryCode + phoneWithoutCode;

    await sendInvite(fullPhoneNumber, role);
    if (!error) {
      setInvitedPhone("");
      setRole("");
    }
  };

  return (
    <div className="colleagues-container">
      <div className="add-colleague-btn-section">
        <button
          className="add-colleague-btn"
          data-bs-toggle="modal"
          data-bs-target="#inviteModal"
        >
          <img
            src={plusIcon}
            alt="plus-icon"
            className="add-colleague-btn-icon"
            width={"30px"}
          />
        </button>
      </div>

      <div
        className="modal fade"
        id="inviteModal"
        tabIndex="-1"
        aria-labelledby="inviteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content invite-modal">
            <div className="modal-header invite-modal-header">
              <h5
                className="modal-title invite-modal-title"
                id="inviteModalLabel"
              >
                Send Invite
              </h5>
              <button
                type="button"
                className="invite-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <img
                  src={closeIcon}
                  alt="close-icon"
                  width={"30px"}
                  className="invite-modal-close-icon"
                />
              </button>
            </div>
            <div className="modal-body invite-modal-body">
              <div className="phone-input-container">
                <select 
                  className="phone-input-select" 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {countryCodes.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="invite-modal-input"
                  value={invitedPhone}
                  style={{border: "none", backgroundColor: 'transparent'}}
                  onChange={(e) => setInvitedPhone(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Role of the member"
                  className="invite-modal-input"
                  style={{border: "1px solid #E0E0E0", borderRadius: "10px"}}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="invite-modal-btn"
                onClick={handleInviteSend}
                disabled={loading}
                data-bs-dismiss={!error && !loading ? "modal" : ""}
              >
                {loading ? "Sending..." : "Send invite"}
              </button>
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="colleague-btn-section">
        <button
          onClick={() => setIndex(0)}
          className={`colleagues-btn ${index === 0 ? "active" : ""}`}
        >
          My Team
        </button>
        <button
          onClick={() => setIndex(1)}
          className={`colleagues-btn ${index === 1 ? "active" : ""}`}
        >
          Invites
        </button>
      </div>

      {index === 0 && <MyTeam />}
      {index === 1 && <Invites />}
    </div>
  );
}
