import {NavLink, useParams} from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useState,useEffect } from "react";
import Posts from "./Posts.jsx";
import { HashLoader } from "react-spinners";

function UserProfile(){
    const {username} = useParams();
    const [user,setUser] = useState();
    const [isLoading,setIsLoading] = useState(true);
    const [followLoading,setfollowLoading] = useState(false);
    const [error,setError] = useState("");
    const fetchUser = async ()=>{
        setIsLoading(true);
        try{
            const fetchedUser = await axiosInstance.get(`/users/getUser/${username}`);
            setUser(fetchedUser.data.data);
            console.log(fetchedUser.data.data);
            setIsLoading(false);
        }
        catch(e){
            setError(e.response?.data?.message);
            setIsLoading(false);

        }

    }
    useEffect(()=>{
        fetchUser();
    },[])

    const cancelRequest = async (userId)=>{
        setfollowLoading(true);
        try{
            const res = await axiosInstance.post("/users/cancelRequest",{userId});
            setUser(res.data.data)
            setfollowLoading(false);
        }
        catch(e){
            setError(e.response?.data?.message);
            setfollowLoading(false);
        }
    }
    const unFollow = async (userId)=>{
        setfollowLoading(true);

        try{
            const res = await axiosInstance.post("/users/unfollow",{userId});
            setUser(res.data.data)
            setfollowLoading(false);
        }
        catch(e){
            setError(e.response?.data?.message);
            setfollowLoading(false);
        }
    }
    const follow = async (userId)=>{
        setfollowLoading(true);
        try{
            const res = await axiosInstance.post("/users/sendRequest",{userId});
            setUser(res.data.data);
            setfollowLoading(false);
        }
        catch(e){
            setError(e.response?.data?.message);
            setfollowLoading(false);
        }
    }


    return (
        <>
        {isLoading?<HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={30} />:(
        <>
        <div className="profile w-full overflow-hidden">
            <div className="header bg-gray-100 p-2 flex items-center w-full h-[25%] justify-evenly sm:pt-10">
                <div className="self-story  ml-[-5%] p-[4px] flex-shrink-0 mx-2 h-[80%]  rounded-[80%] bg-gradient-to-t from-blue-900 via-blue-500 to-purple-600 aspect-square m-0 overflow-hidden sm:h-[100%]">
                    <button>
                        <img 
                            src={user.user.avatar} 
                            className="border-white border-2 h-full w-full aspect-square rounded-[100%] object-cover" 
                            alt="User story"
                        />
                    </button>
                </div>
                <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
                    <div className="postcount flex flex-col items-center justify-center">
                        <div className="text-xs sm:text-base">posts</div>
                        <div className="text-lg font-medium">0</div>
                        
                    </div>
                </NavLink>

                <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
                    <div className="fllowers flex flex-col items-center justify-center">
                        <div className="text-xs sm:text-base">followers</div>
                        <div className="text-lg font-medium">{user.followers}</div>
                    </div>
                </NavLink>
                <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
                    <div className="following flex flex-col items-center justify-center">
                        <div className="text-xs sm:text-base">followings</div>
                        <div className="text-lg font-medium">{user.followings}</div>
                    </div>
                </NavLink>
            
            </div>
            <div className="name_and_follow flex bg-gray-100 items-center justify-between p-2 pt-4">
                <div className="name ml-[6%]">
                    {user.user.fullname}
                    <div className="text-sm text-gray-500">
                        {user.user.username}
                    </div>
                </div>
                <div className="buttons  mr-6">
                    {followLoading?<button className="px-4 py-2 bg-blue-400 rounded-lg w-28 h-10 flex items-center justify-center"><HashLoader color={"#eeeeee"} loading={true} size={15} /></button>:user.pending?(<button className="px-4 py-2 bg-gray-300 rounded-lg w-28 h-10 flex items-center justify-center" onClick={()=>{cancelRequest(user.user._id)}}>requested</button>):
                    (user.following?<button className="px-4 py-2 bg-gray-300 rounded-lg w-28 h-10 flex items-center justify-center" onClick={()=>{unFollow(user.user._id)}}>following</button>:
                    <button className="px-4 py-2 bg-blue-400 rounded-lg w-28 h-10 flex items-center justify-center" onClick={()=>{follow(user.user._id)}}>follow</button>)}
                </div>
            </div>
            <div className="mutuals">

            </div>
            
            <Posts username={username} />

        </div>
        </>

        )}
        </>
    )
}

export default UserProfile