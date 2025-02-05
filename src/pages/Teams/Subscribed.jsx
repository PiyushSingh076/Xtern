import React from 'react'
import { useNavigate } from "react-router-dom";
import { Phone, Mail, UserCheck } from 'lucide-react';



export const Subscribed = ({user}) => {
    const navigate = useNavigate();

    const handleProfileClick = (userId) => {
        navigate(`/profile/${userId}`);
    };
    return (
        <div
            onClick={() => handleProfileClick(user.id)}
            className="flex items-center space-x-2 sm:space-x-4  sm:p-4 p-4 bg-white border border-gray-200 rounded-lg transition-colors hover:bg-gray-100 cursor-pointer"
        >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={user.photo_url || "/placeholder.svg"}
                    alt={user.display_name || 'User'}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-medium truncate">
                        {user.display_name || 'Anonymous User'} ({user.type})
                    </h3>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Subscribed
                    </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Phone size={14} />
                    <span>{user.phone_number || 'No phone number'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Mail size={14} />
                    <span>{user.email || 'No email provided'}</span>
                  </div>
                </div>
            </div>
        </div>
    )
}
