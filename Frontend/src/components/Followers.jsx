import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { HashLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

function Followers() {
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchFollowers = async () => {
    setIsLoading(true);
    try {
      const fetchedFollowers = await axiosInstance.get(`/users/getFollowers/${userId}`);
      setIsLoading(false);
      setFollowers(fetchedFollowers.data.data);
      console.log(fetchFollowers.data.data)
    } catch (e) {
      setIsLoading(false);
      setError(e.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const userClick = (username) => {
    navigate(`/userProfile/${username}`);
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
        <div className="title p-4 pl-5 w-full bg-gray-200 rounded-lg">Followers</div>
      <div className="line w-full h-1 bg-gray-400 rounded-lg mb-1"></div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={30} />
        ) : (
          <div className="bg-white shadow-md rounded-md p-4 flex flex-col h-full w-full">
            {followers.length > 0 ? (
              followers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    userClick(user.username);
                  }}
                  className="flex items-center p-1 pl-3 bg-gray-100 hover:bg-gray-200 rounded-lg mb-[2px] transition-colors duration-200"
                >
                  <div className="flex items-center py-1">
                    <div className="profile_picture h-9 aspect-square rounded-[6rem] p-[1px] bg-gray-50 overflow-hidden">
                      <button>
                        <img
                          src={user.avatar}
                          className="h-full aspect-square object-cover rounded-full border-white border-2"
                          alt="Profile"
                        />
                      </button>
                    </div>
                    <div className="title flex flex-col ml-4 items-start">
                      <p className="text-sm font-medium">{user.fullname}</p>
                      <p className="text-xs -mt-1 flex items-center justify-center">
                        {user.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 m-auto">No followers found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Followers;
