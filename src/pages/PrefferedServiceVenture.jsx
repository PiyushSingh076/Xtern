import React, { useState } from 'react';

export default function PrefferedServiceVenture() {
  const [ventureRole, setVentureRole] = useState(null);
  const [potential, setPotential] = useState(null);

  const handleRoleChange = (event) => {
    setVentureRole(event.target.value); // For venture roles like CEO, CTO, etc.
  };

  const handleRoleChangeIntern = (event) => {
    setPotential(event.target.value); // For potential intern roles
  };

  return (
    <div className='preffered-role-container'>
      <span className='hey-txt'>
        Hey, <span style={{ color: '#3374AE' }}>Venture</span>
      </span>

      <div className="select-lang-sec">
        <span className='select-lang'>You are:</span>
      </div>

      <div className='lang-sec'>
        <input
          type="radio"
          id="ceo"
          name="role"
          value="CEO"
          onChange={handleRoleChange}
          checked={ventureRole === 'CEO'}
        />
        <label className="custom-radio-sel-lang" htmlFor="ceo">
          CEO
        </label>

        <input
          type="radio"
          id="cto"
          name="role"
          value="CTO"
          onChange={handleRoleChange}
          checked={ventureRole === 'CTO'}
        />
        <label className="custom-radio-sel-lang" htmlFor="cto">
          CTO
        </label>

        <input
          type="radio"
          id="co-founder"
          name="role"
          value="Co-founder"
          onChange={handleRoleChange}
          checked={ventureRole === 'Co-founder'}
        />
        <label className="custom-radio-sel-lang" htmlFor="co-founder">
          Co-founder
        </label>

        <input
          type="radio"
          id="investor"
          name="role"
          value="Investor"
          onChange={handleRoleChange}
          checked={ventureRole === 'Investor'}
        />
        <label className="custom-radio-sel-lang" htmlFor="investor">
          Investor
        </label>
      </div>

      <div className="select-lang-sec">
        <span className='select-lang'>You are Looking for:</span>
      </div>

      <div className="lang-sec">
        <input
          type="radio"
          id="developer-intern"
          name="potential"
          value="Developer Intern"
          onChange={handleRoleChangeIntern}
          checked={potential === 'Developer Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="developer-intern">
          Developer Intern
        </label>

        <input
          type="radio"
          id="generalist-intern"
          name="potential"
          value="Generalist Intern"
          onChange={handleRoleChangeIntern}
          checked={potential === 'Generalist Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="generalist-intern">
          Generalist Intern
        </label>

        <input
          type="radio"
          id="marketing-intern"
          name="potential"
          value="Marketing Intern"
          onChange={handleRoleChangeIntern}
          checked={potential === 'Marketing Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="marketing-intern">
          Marketing Intern
        </label>

        <input
          type="radio"
          id="design-intern"
          name="potential"
          value="Design Intern"
          onChange={handleRoleChangeIntern}
          checked={potential === 'Design Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="design-intern">
          Design Intern
        </label>

        <input
          type="radio"
          id="sales-intern"
          name="potential"
          value="Sales Intern"
          onChange={handleRoleChangeIntern}
          checked={potential === 'Sales Intern'}
        />
        <label className="custom-radio-sel-lang" htmlFor="sales-intern">
          Sales Intern
        </label>

       
      </div>
      <button className='continue-btn'>Continue</button>
    </div>
  );
}
