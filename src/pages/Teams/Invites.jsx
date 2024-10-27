import React from "react";
import { FaRegEnvelopeOpen } from "react-icons/fa"; // Using react-icons for an envelope icon

export default function Invites() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-muted">
      <FaRegEnvelopeOpen size={50} className="mb-3" />
      <h4>No invites yet</h4>
    </div>
  );
}
