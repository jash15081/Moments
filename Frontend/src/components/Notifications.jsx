import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns';

function Notifications() {
    const [followRequests, setFollowRequests] = useState([]);
    const [otherNotifications, setOtherNotifications] = useState([]);
    const navigate = useNavigate();
    const fetchFollowRequests = async () => {
        const response = await axiosInstance.get("/users/getPendingRequests");
        const requests = response.data.data
        console.log(requests[0].createdAt)
        setFollowRequests(requests);
    };

    const fetchOtherNotifications = async () => {
        
       
    };

   
    useEffect(() => {
        fetchFollowRequests();
        fetchOtherNotifications();
    }, []);

    const acceptRequest = async (userId) => {
        try{
            const res = await axiosInstance.post("/users/acceptRequest",{userId});
            const updatedRequests = followRequests.map((req) =>
                req._id === userId ? { ...req, accepted: true } : req
            );           
            setFollowRequests(updatedRequests);
        }
        catch(e){
            console.log(e);
        }
    };

    return (
        <div className="w-4/5 mx-auto flex flex-col">
            <h3 className="text-lg font-semibold  bg-gray-100 pl-6 pt-4 mt-4 rounded-lg">Follow Requests</h3>

            <div className="bg-gray-100 rounded-lg p-5 h-80 overflow-y-scroll">
                {followRequests.length === 0 ? (
                    <p className="text-gray-600">No follow requests.</p>
                ) : (
                    followRequests.map(request => (
                        <div onClick={()=>{navigate(`/userProfile/${request.username}`)}} key={request.id} className="flex hover:cursor-pointer items-center mb-2 p-2 rounded-lg bg-white hover:bg-gray-200 transition duration-75">
                            <img src={request.avatar} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                            <div className="flex flex-col">
                                <p className="font-medium mb-[-5%]">{request.fullname}</p>
                                <p className="text-sm text-gray-500">{request.username}</p>
                            </div>
                            <div className="time p-1 ml-5 text-gray-400 text-sm">
                                {formatDistanceToNow(request.createdAt)}
                            </div>
                            {request.accepted?<button
                                onClick={(e) => {e.stopPropagation(); acceptRequest(request.id)}}
                                className="bg-gray-300 ml-auto text-black px-3 py-2 rounded-md hover:bg-gray-300 hover:text-black transition duration-75"
                            >
                                Accepted
                            </button>:<button
                                onClick={(e) => {e.stopPropagation(); acceptRequest(request._id)}}
                                className="bg-blue-600 ml-auto text-white px-3 py-2 rounded-md hover:bg-gray-300 hover:text-black transition duration-75"
                            >
                                Accept
                            </button>}
                            
                        </div>
                    ))
                )}
            </div>
            <div className="bg-gray-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-4">Other Notifications</h3>
                {otherNotifications.length === 0 ? (
                    <p className="text-gray-600">No notifications.</p>
                ) : (
                    otherNotifications.map(notification => (
                        <div key={notification.id} className="flex items-center mb-4 p-3 border border-gray-300 rounded-lg bg-white">
                            <img src={notification.profilePicture} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                            <div className="flex-1">
                                <p className="font-medium">{notification.name}</p>
                                <p className="text-gray-600 text-sm">{notification.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;
