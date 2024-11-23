// src/components/StepperForm/PersonalInfo.js
import React from "react";
import { State, City } from "country-state-city";

const PersonalInfo = ({
  FirstName,
  setFirstName,
  LastName,
  setLastName,
  Xpert,
  setXpert,
  Experience,
  setExperience,
  selectedState,
  handleStateChange,
  selectedCity,
  setSelectedCity,
  indiaStates,
  cities,
  xpertOptions,
  experienceOptions,
}) => {
  return (
    <div className="personal-info-section">
      <div className="name-section">
        <input
          type="text"
          placeholder="First Name"
          className="input-name"
          value={FirstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="input-name"
          value={LastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <span className="label-title">Location: </span>
      <div className="location-section">
        {/* State Dropdown */}
        <select onChange={(e) => handleStateChange(e.target.value)} value={selectedState}>
          <option value="">Select a State</option>
          {indiaStates.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          value={selectedCity}
        >
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
          style={{ width: "100%" }}
          value={Xpert}
        >
          <option value="">Select a Xpert Type</option>
          {xpertOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <span className="label-title">Years Of Experience:</span>
      <div className="xpert-type-section">
        <select
          onChange={(e) => setExperience(e.target.value)}
          style={{ width: "100%" }}
          value={Experience}
        >
          <option value="">Select Year of Experience</option>
          {experienceOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PersonalInfo;
