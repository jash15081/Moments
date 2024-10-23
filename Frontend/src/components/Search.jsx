import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosConfig";
import { HashLoader } from "react-spinners";
import debounce from 'lodash/debounce';
import { useNavigate } from "react-router-dom";

function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [str, setStr] = useState("");
  const [users, setUsers] = useState([]);
  const [mutualAccounts, setMutualAccounts] = useState([]); // State for mutual accounts
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUser = useCallback(
    debounce(async (searchStr) => {
      // if (searchStr.trim() === "") {
      //   setUsers([]);
      //   setIsLoading(false);
      //   return;
      // }
      setIsLoading(true);
      try {
        const fetchedUsers = await axiosInstance.post("/users/search", { str: searchStr });
        setIsLoading(false);
        console.log(fetchedUsers.data.data)
        setUsers(fetchedUsers.data.data);
      } catch (e) {
        console.log(e)
        setIsLoading(false);
        setError(e.response?.data?.message);
      }
    }, 400),
    []
  );

  // Fetch mutual accounts when component mounts
  const fetchMutualAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/users/mutual-accounts"); // Assuming this endpoint exists
      setMutualAccounts(response.data.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(e.response?.data?.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUser(str);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchUser(str);
    return () => {
      fetchUser.cancel();
    };
  }, [str, fetchUser]);

  const handleChange = (e) => {
    setStr(e.target.value);
  };

  const userClick = (username) => {
    navigate(`/userProfile/${username}`);
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-10 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          onChange={handleChange}
          value={str}
        />
      </div>
      <div className="line w-full h-1 bg-gray-400 rounded-lg mb-1"></div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={30} />
        ) : (
          <div className="bg-white shadow-md rounded-md p-4 flex flex-col h-full w-full">
            {str.trim() === "" && mutualAccounts.length > 0 ? ( // Show mutual accounts when search is empty
              mutualAccounts.map((user) => (
                <div key={user.id} onClick={() => userClick(user.username)} className="flex items-center p-1 pl-3 bg-gray-100 hover:bg-gray-200 rounded-lg mb-[2px] transition-colors duration-200">
                  <div className="flex items-center py-1">
                    <div className="profile_picture h-9 aspect-square rounded-[6rem] p-[1px] bg-gray-50 overflow-hidden">
                      <button>
                        <img src={user.avatar} className="h-full aspect-square object-cover rounded-full border-white border-2" alt="Profile" />
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
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} onClick={() => userClick(user.username)} className="flex items-center p-1 pl-3 bg-gray-100 hover:bg-gray-200 rounded-lg mb-[2px] transition-colors duration-200">
                  <div className="flex items-center py-1">
                    <div className="profile_picture h-9 aspect-square rounded-[6rem] p-[1px] bg-gray-50 overflow-hidden">
                      <button>
                        <img src={user.avatar} className="h-full aspect-square object-cover rounded-full border-white border-2" alt="Profile" />
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
              <div className="text-gray-400 m-auto">Search</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
