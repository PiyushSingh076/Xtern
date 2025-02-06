import React, { useState, useEffect } from "react";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ShortlistedUsers from "./ShortlistedUsers";
import TeamMembers from "./TeamMembers";
import { Subscribed } from "./Subscribed";
import SubscriptionModal from "./SubscriptionModal";
import Payments from "./Payments";

const TeamPage = () => {
    const [activeTab, setActiveTab] = useState("subscribed");
    const [authorizedUsers, setAuthorizedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userData, loading: userDataLoading, error: userDataError } = useFetchUserData();
    const [shortlistedUsers, setShortlistedUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [stipend, setStipend] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();


    const openModal = (user) => {
        setSelectedUser(user);
        setStipend("");
        setIsModalOpen(true);
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

                                return { id: uid, ...userDoc.data(), salary: teamData.members.find(member => member.uid === uid).stipend };
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

    useEffect(() => {
        async function fetchTeamMembers() {
            if (!userData || !userData.uid) return;

            try {
                const teamDocRef = doc(db, "teams", userData.uid);
                const teamDoc = await getDoc(teamDocRef);

                if (teamDoc.exists()) {
                    const acceptedUids = teamDoc.data().members
                        ?.filter(member => member.status === "ACCEPTED")
                        .map(member => member.uid) || [];

                    const acceptedUserDetails = await Promise.all(
                        acceptedUids.map(async (uid) => {
                            const userDocRef = doc(db, "users", uid);
                            const userDoc = await getDoc(userDocRef);

                            if (userDoc.exists()) {

                                return { id: uid, ...userDoc.data(), salary: teamDoc.data().members.find(member => member.uid === uid).stipend };
                            }
                            return null;
                        })
                    );

                    setTeamMembers(acceptedUserDetails.filter(user => user !== null));
                }
            } catch (error) {
                console.error("Error fetching team members:", error);
            }
        }

        fetchTeamMembers();
    }, [userData]);



    const handleSubscribe = (user) => {
        openModal(user);
    };

    const handleSubmitSubscription = async () => {
        if (!selectedUser || stipend.trim() === "") return;
        setLoading(true); // Start loading

    
        try {
            const teamDocRef = doc(db, "teams", userData.uid);
            const teamDoc = await getDoc(teamDocRef);
    
            if (teamDoc.exists()) {
                // Update members list in Firestore
                const updatedMembers = teamDoc.data().members.map(member =>
                    member.uid === selectedUser.id
                        ? { ...member, status: "ACCEPTED", stipend }
                        : member
                );

                await updateDoc(teamDocRef, { members: updatedMembers });
    
                // Move user to team members
                setTeamMembers(prev => [...prev, { ...selectedUser, stipend }]);
                setShortlistedUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error updating subscription:", error);
        } finally {
            setLoading(false); // Stop loading
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


    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            {/* Tabs */}
            <div className="flex w-full mb-4 sm:mb-8 border-b text-xs sm:text-sm">
                <button
                    onClick={() => setActiveTab("subscribed")}
                    className={`flex-1 py-2 sm:py-3 text-center ${activeTab === "subscribed" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                        }`}
                >
                    Subscribed Users ({authorizedUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab("shortlisted")}
                    className={`flex-1 py-2 sm:py-3 text-center ${activeTab === "shortlisted" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                        }`}
                >
                    Shortlisted
                </button>
                <button
                    onClick={() => setActiveTab("team")}
                    className={`flex-1 py-2 sm:py-3 text-center ${activeTab === "team" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                        }`}
                >
                    Team Members
                </button>
                <button
                    onClick={() => setActiveTab("payments")}
                    className={`flex-1 py-2 sm:py-3 text-center ${activeTab === "payments" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
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
                            <Subscribed key={user.id} user={user} />
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
                    <TeamMembers members={teamMembers} />
                )}

                {activeTab === "payments" && (

                    <Payments members={teamMembers} ></Payments>
                )}
            </div>
            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stipend={stipend}
                setStipend={setStipend}
                onSubmit={handleSubmitSubscription}

                loading={loading}

            />
        </div>

    );
};

export default TeamPage;