import {NavLink, useParams} from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useState,useEffect } from "react";
import Posts from "./Posts.jsx";
import { HashLoader } from "react-spinners";

function UserProfile(){
    const {username} = useParams();
    const [user,setUser] = useState();
    const [isLoading,setIsLoading] = useState(true);
    const [error,setError] = useState("");
    const fetchUser = async ()=>{
        setIsLoading(true);
        try{
            const fetchedUser = await axiosInstance.get(`/users/getUser/${username}`);
            setUser(fetchedUser.data.data);
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
    return (
        <>
        {isLoading?<HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={30} />:(
        <>
        <div className="profile h-full w-full flex overflow-hidden">
            <div className="header bg-gray-100 p-2 flex items-center w-full h-[25%] justify-evenly sm:pt-10">
                <div className="self-story  ml-[-5%] p-[4px] flex-shrink-0 mx-2 h-[80%]  rounded-[80%] bg-gradient-to-t from-blue-900 via-blue-500 to-purple-600 aspect-square m-0 overflow-hidden sm:h-[100%]">
                    <button>
                        <img 
                            src={user.avatar} 
                            className="border-white border-2 h-full w-full aspect-square rounded-[100%] object-cover" 
                            alt="User story"
                        />
                    </button>
                </div>
                <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
                    <div className="postcount flex flex-col items-center justify-center">
                        <div className="text-xs sm:text-base">posts</div>
                        <div className="text-lg font-medium">100</div>
                        
                    </div>
                </NavLink>

                <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
                    <div className="fllowers flex flex-col items-center justify-center">
                        <div className="text-xs sm:text-base">followers</div>
                        <div className="text-lg font-medium">100</div>
                    </div>
                </NavLink>
                <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
                    <div className="following flex flex-col items-center justify-center">
                        <div className="text-xs sm:text-base">followings</div>
                        <div className="text-lg font-medium">100</div>
                    </div>
                </NavLink>
            
            </div>
            <div className="mutuals">

            </div>
            <div className="buttons">

            </div>
        </div>
        <Posts username={username} />
        </>

        )}
        </>
    )
}

export default UserProfile