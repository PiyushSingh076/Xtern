import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserData from "../../hooks/Auth/useFetchUserData";
import { useSelector } from "react-redux";

import schedule from '../../assets/svg/schedule.svg';
import medal from '../../assets/svg/medal.png';
import dollar from '../../assets/svg/dollar.svg';

export default function MainProfile() {
    const [data, setData] = useState(null);
    const { userData } = useFetchUserData();
    const role = useSelector((state) => state.role);
    const internInfo = useSelector((state) => state.internInfo); 
    const ventureInfo = useSelector((state) => state.ventureInfo);
    console.log(ventureInfo);
    useEffect(() => {
        console.log('useEffect');

        if (role.selectedRole === 'intern') {
            setData(internInfo);
            console.log('intern is executing');
        }
        if (role.selectedRole === 'venture') {
            setData(ventureInfo);
            console.log('venture is executing');
        }
    }, [role]);


    return (
        <div>
            <div className="single-mentor-first-wrap">
                <div className="mentor-img-sec">
                    {role.selectedRole === 'intern' && (
                        <div className="mentor-medal-sec">
                            <img src={medal} className="mentor-medal" width={'24px'} alt="medal" />
                            <span>Bronze</span>
                        </div>
                    )}
                    <img src={userData?.profilePicture} alt="client-img" width={96} height={96} />
                </div>
                <div className="single-mentor-details">
                    <h3>{userData?.display_name}</h3>
                    {role.selectedRole === 'intern' && <h4 className="mt-12">Graduation Year: {internInfo?.graduationYear}</h4>}
                    {role.selectedRole === 'venture' && <h4 className="mt-12">Organization: <span className="company-name">{data?.companyName}</span></h4>}
                    {role.selectedRole === 'intern' && <p className="mt-16">{data?.internType}</p>}
                    {role.selectedRole === 'venture' && <p className="mt-16">{data?.role}</p>}
                </div>
                <div className="mentor-follow-sec">
                    {role.selectedRole === 'intern' && (
                        <>
                            <div className="mentor-follow-btn" data-bs-toggle="modal" data-bs-target="#scheduleModal">
                                <img src={schedule} width={'24px'} alt="schedule" />
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
                        <img src={dollar} width={'24px'} alt="dollar" />
                    </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
