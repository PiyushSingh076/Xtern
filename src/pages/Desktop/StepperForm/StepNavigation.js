import React from "react";

const StepNavigation = ({ step, setStep }) => {
  return (
    <div className="stepper-navigation-container">
      {/* Step 1: Profile */}
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

      {/* Step 2: Offering */}
      <div className="step-no-title-container">
        <div
          onClick={() => setStep(2)}
          className={
            step === 2 ? "step-no-container-active" : "step-no-container"
          }
        >
          2
        </div>
        Offering
      </div>

      <div className="line-bar"></div>

      {/* Step 3: Summary */}
      <div className="step-no-title-container">
        <div
          onClick={() => setStep(3)}
          className={
            step === 3 ? "step-no-container-active" : "step-no-container"
          }
        >
          3
        </div>
        Summary
      </div>
    </div>
  );
};

export default StepNavigation;
