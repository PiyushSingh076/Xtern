import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CardList from "../Card/CardList";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaLaptopCode,
  FaBrush,
  FaCloud,
  FaPen,
  FaChartLine,
  FaGavel,
  FaUserTie,
  FaCalculator,
  FaSpa,
  FaUserGraduate,
  FaAppleAlt,
  FaBookOpen,
  FaStar,
} from "react-icons/fa";

const FilterScreen = () => {
  const navigate = useNavigate();
  const type = useParams();

  useEffect(() => {
    if (type) {
      setSelectedProfession(type.type);
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef(null);

  const professionals = [
    { id: 1, name: "Dietician", icon: <FaAppleAlt /> },
    { id: 2, name: "Phonics English", icon: <FaBookOpen /> },
    { id: 3, name: "Intern", icon: <FaUserGraduate /> },
    { id: 4, name: "Developer", icon: <FaLaptopCode /> },
    { id: 5, name: "Yoga", icon: <FaSpa /> },
    { id: 6, name: "Designer", icon: <FaBrush /> },
    { id: 7, name: "Cloud DevOps", icon: <FaCloud /> },
    { id: 8, name: "Content Creator", icon: <FaPen /> },
    { id: 9, name: "Digital Marketing", icon: <FaChartLine /> },
    { id: 10, name: "Lawyer", icon: <FaGavel /> },
    { id: 11, name: "HR", icon: <FaUserTie /> },
    { id: 12, name: "Financial Analyst", icon: <FaCalculator /> },
    { id: 13, name: "Astrologist", icon: <FaStar /> },
    { id: 14, name: "Accountant", icon: <FaCalculator /> },
  ];

  useEffect(() => {
    const calculateVisibleCards = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = 160; // Approximate width of each card including margins
      const toggleButtonWidth = 50; // Width of the expand/collapse button
      const availableWidth = containerWidth - toggleButtonWidth;
      const calculatedCount = Math.floor(availableWidth / cardWidth);
      
      setVisibleCount(Math.max(2, calculatedCount));
    };

    calculateVisibleCards();
    window.addEventListener('resize', calculateVisibleCards);

    return () => window.removeEventListener('resize', calculateVisibleCards);
  }, []);

  const visibleProfessionals = professionals.slice(0, visibleCount);
  const hiddenProfessionals = professionals.slice(visibleCount);

  const handleClick = (name) => {
    navigate(`/filterscreen/${name}`);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="relative" ref={containerRef}>
        <div className="flex overflow-x-auto hide-scrollbar gap-3 p-2 transition-all duration-300 ease-in-out">
          {visibleProfessionals.map((profession) => (
            <div
              key={profession.id}
              onClick={() => handleClick(profession.name)}
              className={`flex items-center whitespace-nowrap px-6 py-1 rounded-full border-1 cursor-pointer transition-all duration-200 ; ${
                selectedProfession === profession.name
                  ? 'bg-[#0066FF] text-white border-[#0066FF]'
                  : 'bg-white text-[#0066FF] border-[#0066FF] hover:bg-blue-50'
              }`}
            >
              <span className={`text-sm mr-2 ${
                selectedProfession === profession.name
                  ? 'text-white'
                  : 'text-[#0066FF]'
              }`}>{profession.icon}</span>
              <span className="text-sm font-medium">{profession.name}</span>
            </div>
          ))}
          {hiddenProfessionals.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center px-4 py-3 rounded-full border-1 border-[#0066FF] bg-white text-[#0066FF] hover:bg-blue-50 transition-all duration-200"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>

        {hiddenProfessionals.length > 0 && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'opacity-100 max-h-40 mt-2'
                : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <div className="flex overflow-x-auto hide-scrollbar gap-3 p-2">
              {hiddenProfessionals.map((profession) => (
                <div
                  key={profession.id}
                  onClick={() => handleClick(profession.name)}
                  className={`flex items-center whitespace-nowrap px-6 py-3 rounded-full border-1 cursor-pointer transition-all duration-200 ${
                    selectedProfession === profession.name
                      ? 'bg-[#0066FF] text-white border-[#0066FF]'
                      : 'bg-white text-[#0066FF] border-[#0066FF] hover:bg-blue-50'
                  }`}
                >
                  <span className={`text-lg mr-2 ${
                    selectedProfession === profession.name
                      ? 'text-white'
                      : 'text-[#0066FF]'
                  }`}>{profession.icon}</span>
                  <span className="text-sm font-medium">{profession.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CardList profession={selectedProfession} />

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FilterScreen;