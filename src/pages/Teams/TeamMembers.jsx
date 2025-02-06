import React from 'react';
import { Phone, Mail, UserCheck, Banknote } from 'lucide-react';

const TeamMembers = ({ members = [] }) => {
  return (
    <div className="space-y-4">
      {members.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No team members found
        </div>
      ) : (
        members.map((member) => (
          <div
            key={member.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={member.photo_url || "/placeholder.svg"}
                  alt={member.display_name || 'Team Member'}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium truncate">
                    {member.display_name || 'Anonymous Member'}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <UserCheck size={12} className="mr-1" />
                    Team Member
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Phone size={14} />
                    <span>{member.phone_number || 'No phone number'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Mail size={14} />
                    <span>{member.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Banknote size={14} />
                    <span> Stipend: </span> <span>₹ {member.salary || 'No stipend provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamMembers;