// src/Components/Admin/Prefference/XpertRole.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addXpertType } from "../../../Store/Slice/UserDetail";

// 1) Import from your config

import "./Prefference.css";
import { professionalsConfig } from "../../../constants/Roles/professionals";

export default function XpertRole({ next }) {
  const dispatch = useDispatch();
  const currentXpertType = useSelector((state) => state.user.XpertType);

  const setXpertType = (type) => {
    dispatch(addXpertType(type));
    next();
  };

  return (
    <div className="xpert-role-selection-container">
      <h2>Choose Your Type</h2>
      <div className="xpert-role-selection">
        {professionalsConfig.map((prof) => (
          <div
            onClick={() => setXpertType(prof.name)}
            key={prof.id}
            className={`xpert-role-selection-card ${
              currentXpertType === prof.name ? "selected" : ""
            }`}
          >
            <div className="xpert-icon-select">{prof.icon}</div>
            <span>{prof.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
