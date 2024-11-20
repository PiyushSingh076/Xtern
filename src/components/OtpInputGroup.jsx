// OtpInputGroup.js
import React, { useEffect, useRef, useState } from "react";

const OtpInputGroup = ({ length = 6, onComplete }) => {
  const [otpValues, setOtpValues] = useState(Array(length).fill("")); // OTP values
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus(); // Focus the first input on component mount
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Focus the next input
      if (index < length - 1) {
        inputsRef.current[index + 1].focus();
      }

      // Check if all inputs are filled
      if (newOtpValues.every((val) => val !== "")) {
        onComplete(newOtpValues.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const { key } = e;
    if (key === "Backspace" || key === "Delete") {
      if (otpValues[index] === "") {
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      }
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d+$/.test(pasteData) && pasteData.length === length) {
      const pasteValues = pasteData.split("");
      setOtpValues(pasteValues);

      // Update each input's value
      pasteValues.forEach((digit, idx) => {
        if (inputsRef.current[idx]) {
          inputsRef.current[idx].value = digit;
        }
      });

      onComplete(pasteData);

      // Optionally, focus the last input
      inputsRef.current[length - 1]?.focus();
    } else {
      // Optionally, you can handle invalid paste data here
      console.error("Invalid OTP pasted");
    }
  };

  return (
    <div
      className="digit-group otp-section"
      onPaste={handlePaste} // Attach onPaste handler to the container
    >
      {otpValues.map((value, index) => (
        <input
          key={index}
          className="form-control otp"
          type="text"
          maxLength="1"
          value={value}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

export default OtpInputGroup;
