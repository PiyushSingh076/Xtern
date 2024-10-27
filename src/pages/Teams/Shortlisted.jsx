import React from 'react';
import profile from '../../assets/images/banner/mentor.png';
import share from '../../assets/svg/share.svg';
import chat from '../../assets/svg/chat.png';

export default function Shortlisted() {
 
    const shortlisted = [
        {
            name: 'Anirudh',
            profile: profile,
            role: 'Software Engineer',
            status: 'Shortlisted',
            skills: ['React', 'Node', 'MongoDB', 'Python', 'Java', 'C++', 'SQL']
        },
        {
            name: 'Anirudh',
            profile: profile,
            role: 'Software Engineer',
            status: 'Shortlisted',
            skills: ['React', 'Node', 'MongoDB']
        },
        {
            name: 'Anirudh',
            profile: profile,
            role: 'Software Engineer',
            status: 'Shortlisted',
            skills: ['React', 'Node', 'MongoDB']
        }
    ];

    return (
        <div className='info-card-container'>
            {shortlisted.map((item, index) => (
                <div key={index} className='info-card-container-inner'>
                    <div className='info-card-shortlisted'>
                        <div className='share-icon'>
                            <img src={share} alt="share" width={'20px'} />
                        </div>
                        <div className='info-card-img-section'>
                            <img src={item.profile} alt="profile" width={'70px'} />
                        </div>      
                        <div className='info-card-content'>
                            <div className='info-card-name-section'>
                                <h4>{item.name}</h4>
                                <div className='chat-icon'>
                                    <img src={chat} alt="chat" width={'15px'} />
                                    <span>Chat</span>
                                </div>
                                </div>
                                <div className='info-card-skills-section'>
                                    {item.skills.map((skill, index) => (
                                        <span className='info-card-skill' key={index}>{skill}</span>
                                    ))}
                                </div>
                        </div>
                    </div>
                    <div className='info-card-action-section'>
                        <button className='subscribe-btn'>Subscribe xtern</button>
                        <button className='replace-btn'>Schedule Interview</button>
                        <button className='unsubscribe-btn'>Reject</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
