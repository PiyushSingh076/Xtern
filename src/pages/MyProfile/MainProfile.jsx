import React from "react";
import Skeleton from '@mui/material/Skeleton';
import schedule from '../../assets/svg/schedule.svg';
import medal from '../../assets/svg/medal.png';
import dollar from '../../assets/svg/dollar.svg';

export default function MainProfile({ userdata, loading }) {

    console.log('main', loading)

    

    return (
        <div>
            <div className="single-mentor-first-wrap">
                {/* Profile Picture and Medal */}
                {loading ? (
                    <Skeleton variant="circular" width={96} height={96} />
                ) : (
                    <div className="mentor-img-sec">
                        {/* {userdata?.typeUser === 'Intern' && (
                            <div className="mentor-medal-sec">
                                <img src={medal} className="mentor-medal" width="24px" alt="medal" />
                                <span>{userdata?.medal}</span>
                            </div>
                        )} */}
                        <img src={userdata?.photo_url} alt="client-img" width={96} height={96} />
                    </div>
                )}

                {/* User Details */}
                <div className="single-mentor-details">
                    {loading ? (
                        <>
                            <Skeleton variant="text" width={150} height={28} />
                            <Skeleton variant="text" width={120} height={24} className="mt-12" />
                            <Skeleton variant="text" width={180} height={20} className="mt-16" />
                        </>
                    ) : (
                        <>
                            <h3>{userdata?.firstName + ' ' + userdata?.lastName}</h3>
                             <h4>Year of experience: {userdata?.experience}</h4>
                            <p className="">{userdata?.type}</p>
                        </>
                    )}
                </div>

                {/* Schedule and Dollar Buttons */}
                {/* <div className="mentor-follow-sec">
                
                        <>
                            {loading ? (
                                <>
                                    <Skeleton variant="circular" width={24} height={24} />
                                    <Skeleton variant="circular" width={24} height={24} style={{ marginLeft: 8 }} />
                                </>
                            ) : (
                                <>
                                    <div className="mentor-follow-btn" data-bs-toggle="modal" data-bs-target="#scheduleModal">
                                        <img src={schedule} width="24px" alt="schedule" />
                                    </div>

                                    <div className="modal fade" id="scheduleModal" tabIndex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="scheduleModalLabel">Schedule Interview</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <input type="date" className="form-control mb-3" />
                                                    <input type="time" className="form-control mb-3" />
                                                    <textarea className="form-control mb-3" placeholder="Additional Notes"></textarea>
                                                    <button className="btn btn-primary">Schedule Interview</button>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mentor-comment">
                                        <img src={dollar} width="24px" alt="dollar" />
                                    </div>
                                </>
                            )}
                        </>
                   
                </div> */}
            </div>
        </div>
    );
}
