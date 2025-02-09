import React from 'react';
import { Button } from "@mui/material"
import { Phone } from 'lucide-react';

const ShortlistedUsers = ({ users = [], onSubscribe }) => {
 const handleSubscribe = (user) => {
  if (onSubscribe) {
    onSubscribe(user);
  }
};


  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No shortlisted users found
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={user.photo_url || "/placeholder.svg"}
                  alt={user.display_name || 'User'}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium truncate">
                  {user.display_name || 'Anonymous User'}
                </h3>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <Phone size={14} />
                  <span>{user.phone_number || 'No phone number'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
            <Button
  onClick={() => handleSubscribe(user)}
  size="sm"
  className="w-full sm:w-auto"
>
  Subscribe
</Button>

            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ShortlistedUsers;
