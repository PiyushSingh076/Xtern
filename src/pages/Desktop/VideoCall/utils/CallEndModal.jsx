import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneOff } from "lucide-react";
import "./CallEndModal.css";

export function CallEndModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
    navigate("/");
  };

  return (
    <div >
      sdklgjladjsfllkaj Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Quidem libero officiis soluta obcaecati ratione beatae, inventore neque.
      Aspernatur, distinctio. Inventore eius aspernatur maxime nobis, architecto
      eveniet, error nemo possimus aliquid nulla odit voluptatibus voluptate id.
    </div>
  );
}
