import React, { useState, useEffect } from "react";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ShortlistedUsers from "./ShortlistedUsers";
import TeamMembers from "./TeamMembers";
import { Subscribed } from "./Subscribed";

const dummyUsers = [
    {
      id: 1,
      display_name: "John Doe",
      phone_number: "+1 234 567 890",
      photo_url: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      display_name: "Jane Smith",
      phone_number: "+1 987 654 321",
      photo_url: "https://via.placeholder.com/50",
    },
  ];
  
  const dummyTeamMembers = [
    {
      id: 1,
      display_name: "Alice Johnson",
      phone_number: "+1 555 444 333",
      email: "alice@example.com",
      photo_url: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      display_name: "Bob Williams",
      phone_number: "+1 111 222 333",
      email: "bob@example.com",
      photo_url: "https://via.placeholder.com/50",
    },
  ];


const TeamPage = () => {
  const [activeTab, setActiveTab] = useState("subscribed");
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, loading: userDataLoading, error: userDataError } = useFetchUserData();
  const [shortlistedUsers, setShortlistedUsers] = useState([]);
const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Fetch subscriber details
  const fetchSubscriberDetails = async (subscriberIds) => {
    try {
      const subscriberDetails = await Promise.all(
        subscriberIds.map(async (userId) => {
          const userDocRef = doc(db, "users", userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            return {
              id: userId,
              ...userDoc.data(),
              profileUrl: userDoc.data().profilePicture || "/placeholder.svg"
            };
          }
          return null;
        })
      );
      
      return subscriberDetails.filter(user => user !== null);
    } catch (error) {
      console.error("Error fetching subscriber details:", error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchShortlistedUsers() {
      if (!userData || !userData.uid) return;
  
      try {
        const teamDocRef = doc(db, "teams", userData.uid);
        const teamDoc = await getDoc(teamDocRef);
  
        if (teamDoc.exists()) {
          const teamData = teamDoc.data();
          const shortlistedUids = teamData.members
            ?.filter(member => member.status === "SHORTLIST")
            .map(member => member.uid) || [];
  
          const shortlistedUserDetails = await Promise.all(
            shortlistedUids.map(async (uid) => {
              const userDocRef = doc(db, "users", uid);
              const userDoc = await getDoc(userDocRef);
  
              if (userDoc.exists()) {
                return { id: uid, ...userDoc.data() };
              }
              return null;
            })
          );
  
          setShortlistedUsers(shortlistedUserDetails.filter(user => user !== null));
        }
      } catch (error) {
        console.error("Error fetching shortlisted users:", error);
      }
    }
  
    fetchShortlistedUsers();
  }, [userData]);
  

  useEffect(() => {
    async function loadSubscribers() {
      if (userData && userData.type === "entrepreneur" && userData.subs) {
        setLoading(true);
        try {
          const subscribers = await fetchSubscriberDetails(userData.subs);
          setAuthorizedUsers(subscribers);
        } catch (error) {
          console.error("Error loading subscribers:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setAuthorizedUsers([]);
        setLoading(false);
      }
    }

    loadSubscribers();
  }, [userData]);

  const handleSubscribe = async (userId) => {
    try {
      // Add your Firebase logic here to update the user's subscription status
      // and add them to team members
      
      // Update the UI
      const updatedUser = shortlistedUsers.find(user => user.id === userId);
      setTeamMembers(prev => [...prev, updatedUser]);
      setShortlistedUsers(prev => prev.filter(user => user.id !== userId));
      
      // Show success message
    } catch (error) {
      console.error('Error subscribing user:', error);
      // Show error message
    }
  };

  // Loading and error states remain the same...
  if (userDataLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-center text-gray-500">
            Loading user information...
          </p>
        </div>
      </div>
    );
  }

  if (userDataError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-center text-red-500">
            Error loading user data: {userDataError}
          </p>
        </div>
      </div>
    );
  }

  if (!userData || userData.type !== "entrepreneur") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-center text-gray-500">
            You need entrepreneur access to view this page. Current type: {userData?.type || "none"}
          </p>
        </div>
      </div>
    );
  }

  const UserCard = ({ user }) => (
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
        <p className="text-xs text-gray-500 truncate">
        {user.phone_number || 'No Phone provided'} | {user.email || 'No email provided'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Tabs */}
      <div className="flex w-full mb-4 sm:mb-8 border-b text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("subscribed")}
          className={`flex-1 py-2 sm:py-3 text-center ${
            activeTab === "subscribed" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          Subscribed Users ({authorizedUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("shortlisted")}
          className={`flex-1 py-2 sm:py-3 text-center ${
            activeTab === "shortlisted" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          Shortlisted
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`flex-1 py-2 sm:py-3 text-center ${
            activeTab === "team" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex-1 py-2 sm:py-3 text-center ${
            activeTab === "payments" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          Payments
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === "subscribed" && (
          <div className="space-y-3">
            {authorizedUsers.map((user) => (
            //   <UserCard key={user.id} user={user} />
            <Subscribed key={user.id} user={user}   />
            ))}
            {authorizedUsers.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No subscribed users found
              </div>
            )}
          </div>
        )}

{activeTab === "shortlisted" && (
  <ShortlistedUsers 
    users={shortlistedUsers} 
    onSubscribe={handleSubscribe} 
  />
)}

{activeTab === "team" && (
  <TeamMembers members={dummyTeamMembers} />
)}

        {activeTab === "payments" && (
          <div className="text-center text-xs sm:text-sm text-gray-500">
            No payment information available
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;