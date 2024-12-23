import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useFetchUserData from '../../../hooks/Auth/useFetchUserData';
import './my_video_call.css';

const VideoCallSelection = () => {
    const { userData } = useFetchUserData();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailableUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getCallableUsers', {
                    params: {
                        currentUserId: userData.id
                    }
                });
                console.log(response.data.users);
                setAvailableUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching available users:', error);
            }
        };

        if (userData) {
            fetchAvailableUsers();
        }
    }, [userData]);

    const handleVideoCallInvite = (user) => {
        setSelectedUser(user);
        navigate(`/videocall?uid=${user.id}&firstName=${encodeURIComponent(user.name)}`);
    };

    if (!userData) {
        return (
            <div className="login-required">
                <div className="login-message">
                    <i className="user-icon"></i>
                    <p>Please log in to start a video call</p>
                </div>
            </div>
        );
    }

    return (
        <div className="video-call-selection">
            <h2>Start a Video Call</h2>
            {availableUsers.length === 0 ? (
                <div className="no-users-message">
                    <i className="video-icon"></i>
                    <p>No users available for video call</p>
                </div>
            ) : (
                <div className="user-grid">
                    {availableUsers.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                {user.image ? (
                                    <img 
                                        src={user.image} 
                                        alt={user.name} 
                                        className="user-avatar" 
                                    />
                                ) : (
                                    <div className="user-avatar-placeholder">
                                        <i className="user-icon"></i>
                                    </div>
                                )}
                                <div className="user-details">
                                    <h3>{user.name}</h3>
                                    <p>{user.status || 'Available'}</p>
                                </div>
                            </div>
                            <button onClick={() => handleVideoCallInvite(user)} className="video-call-button">
                                <i className="video-icon"></i>
                                Start Video Call
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoCallSelection;

