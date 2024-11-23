// src/components/StepperForm/StepNavigation.js
import React from "react";

const StepNavigation = ({ step, setStep }) => {
  return (
    <div className="stepper-navigation-container">
      <div className="step-no-title-container">
        <div
          onClick={() => setStep(1)}
          className={
            step === 1 ? "step-no-container-active" : "step-no-container"
          }
        >
          1
        </div>
        Profile
      </div>

      <div className="line-bar"></div>

      <div onClick={() => setStep(2)} className="step-no-title-container">
        <div
          className={
            step === 2 ? "step-no-container-active" : "step-no-container"
          }
        >
          2
        </div>
        Offering
      </div>
    </div>
  );
};

export default StepNavigation;
