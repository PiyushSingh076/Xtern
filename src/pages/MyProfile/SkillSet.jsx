import React, { useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Code } from 'lucide-react';

const SkillSet = ({ profileData, skillloading }) => {
  useEffect(() => {
    console.log('SkillSet Component - Full profileData:', profileData);
    console.log('SkillSet Component - skillSet:', profileData?.skillSet);
  }, [profileData]);

  if (skillloading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-300 w-3/4 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Check if skillSet exists and has items
  const hasSkills = Array.isArray(profileData?.skillSet) && profileData.skillSet.length > 0;
  
  // Check if serviceDetails exists and has items
  const hasServices = Array.isArray(profileData?.serviceDetails) && profileData.serviceDetails.length > 0;

  const getBackgroundColor = (index) => {
    const colors = ['bg-purple-100', 'bg-green-100', 'bg-pink-100', 'bg-orange-100'];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Skills</h3>
      </div>

      {hasSkills ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {profileData.skillSet.map((skillItem, index) => {
            const ratingPercentage = (skillItem?.skillRating / 5) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className={`relative w-20 h-20 ${getBackgroundColor(index)} rounded-full flex items-center justify-center`}>
                  <CircularProgressbar
                    value={ratingPercentage}
                    styles={buildStyles({
                      pathColor: ratingPercentage >= 80 ? '#22c55e' : ratingPercentage >= 60 ? '#f97316' : '#ef4444',
                      trailColor: '#f3f4f6'
                    })}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="font-medium text-gray-800">{skillItem?.skill}</p>
                  <p className="text-sm text-gray-600">{skillItem?.skillRating} Star</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-red-500">No skill set available</p>
        </div>
      )}

      {hasServices && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profileData.serviceDetails.map((service, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h4 className="font-medium text-gray-800 mb-2">{service.serviceName}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {(service.serviceDescription || '').slice(0, 50)}...
                </p>
                <p className="text-lg font-semibold text-blue-600">₹{service.servicePrice}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSet;