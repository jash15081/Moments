import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; 

function Notifications() {
    const [followRequests, setFollowRequests] = useState([]);
    const [otherNotifications, setOtherNotifications] = useState([]);
    const [isFollowRequestsOpen, setIsFollowRequestsOpen] = useState(false); // State for follow requests dropdown
    const [isOtherNotificationsOpen, setIsOtherNotificationsOpen] = useState(false); // State for other notifications dropdown
    const navigate = useNavigate();

    const fetchFollowRequests = async () => {
        const response = await axiosInstance.get("/users/getPendingRequests");
        const requests = response.data.data;
        console.log(response.data)
        setFollowRequests(requests);
    };

    const fetchOtherNotifications = async () => {
        const response = await axiosInstance.get("/users/getNotifications"); // Make sure to implement this endpoint
        const notifications = response.data.data;
        setOtherNotifications(notifications);
    };

    useEffect(() => {
        fetchFollowRequests();
        fetchOtherNotifications();
    }, []);

    const acceptRequest = async (userId) => {
        try {
            const res = await axiosInstance.post("/users/acceptRequest", { userId });
            const updatedRequests = followRequests.map((req) =>
                req._id === userId ? { ...req, accepted: true } : req
            );
            setFollowRequests(updatedRequests);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="w-4/5 mx-auto flex flex-col">
            {/* Follow Requests Dropdown */}
            <div className="mb-4">
                <h3 
                    className="text-lg font-semibold bg-gray-100 pl-6 pt-4 mt-4 rounded-lg flex justify-between items-center cursor-pointer"
                    onClick={() => setIsFollowRequestsOpen(!isFollowRequestsOpen)}
                >
                    Follow Requests
                    {isFollowRequestsOpen ? <AiOutlineUp /> : <AiOutlineDown />}
                </h3>
                {isFollowRequestsOpen && (
                    <div className="bg-gray-100 rounded-lg p-5 max-h-80 overflow-y-scroll">
                        {followRequests.length === 0 ? (
                            <p className="text-gray-600">No follow requests.</p>
                        ) : (
                            followRequests.map(request => (
                                <div 
                                    key={request._id} 
                                    onClick={() => { navigate(`/userProfile/${request.username}`); }} 
                                    className="flex hover:cursor-pointer items-center mb-2 p-2 rounded-lg bg-white hover:bg-gray-200 transition duration-75"
                                >
                                    <img src={request.avatar} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                                    <div className="flex flex-col">
                                        <p className="font-medium mb-[-5%]">{request.fullname}</p>
                                        <p className="text-sm text-gray-500">{request.username}</p>
                                    </div>
                                    <div className="time p-1 ml-5 text-gray-400 text-sm">
                                        {formatDistanceToNow(new Date(request.createdAt))} ago
                                    </div>
                                    {request.accepted ? (
                                        <button
                                            className="bg-gray-300 ml-auto text-black px-3 py-2 rounded-md hover:bg-gray-300 hover:text-black transition duration-75"
                                        >
                                            Accepted
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); acceptRequest(request._id); }}
                                            className="bg-blue-600 ml-auto text-white px-3 py-2 rounded-md hover:bg-gray-300 hover:text-black transition duration-75"
                                        >
                                            Accept
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Other Notifications Dropdown */}
            <div>
                <h3 
                    className="text-lg font-semibold mb-4 bg-gray-100 pl-6 pt-4 rounded-lg flex justify-between items-center cursor-pointer "
                    onClick={() => setIsOtherNotificationsOpen(!isOtherNotificationsOpen)}
                >
                    Other Notifications
                    {isOtherNotificationsOpen ? <AiOutlineUp /> : <AiOutlineDown />}
                </h3>
                {isOtherNotificationsOpen && (
                    <div className="bg-gray-100 rounded-lg p-5 max-h-80 overflow-y-scroll"> {/* Set max height for scroll */}
                        {otherNotifications.length === 0 ? (
                            <p className="text-gray-600">No notifications.</p>
                        ) : (
                            otherNotifications.map(notification => (
                                <div key={notification.id} className="flex items-center mb-4 p-3 border border-gray-300 rounded-lg bg-white">
                                    <img src={notification.avatar} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                                    <div className="flex-1">
                                        <p className="font-medium">{notification.name}</p>
                                        <p className="text-gray-600 text-sm">{notification.message}</p>
                                        <p className="text-gray-400 text-xs">{formatDistanceToNow(new Date(notification.createdAt))} ago</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notifications;
