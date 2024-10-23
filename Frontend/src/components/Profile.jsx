import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useState, useEffect } from "react";
import Posts from "./Posts.jsx";
import { HashLoader } from "react-spinners";
import EditProfile from "./EditProfile"; 
import MyPosts from "./myPosts.jsx";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [followers,setFollowers] = useState(0);
  const [followings,setFollowings] = useState(0);
  const [posts,setPosts] = useState(0);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const fetchedUser = await axiosInstance.get("/users/current-user");
      setUser(fetchedUser.data.data.user); 
      setFollowers(fetchedUser.data.data.followers)
      setFollowings(fetchedUser.data.data.followings)
      setPosts(fetchedUser.data.data.posts);
      setIsLoading(false);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch user data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); 

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const seeFollowers = () => {
    navigate(`/editFollowers/${user._id}`);
  };

  const seeFollowings = () => {
    navigate(`/editFollowings/${user._id}`);
  };

  if (isLoading) {
    return (
      <HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={30} />
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (isEditing) {
    return (
      <EditProfile user={user} onCancel={handleEditCancel} onUpdate={handleProfileUpdate} />
    );
  }

  return (
    <div className="profile w-full overflow-scroll">
      <div className="header bg-gray-100 p-2 flex items-center w-full h-[30%] justify-evenly sm:pt-10">
        <div className="self-story ml-[-5%] p-[4px] flex-shrink-0 mx-2 h-[90%] rounded-full bg-gray-400 aspect-square overflow-hidden sm:h-[100%]">
          <img
            src={user.avatar}
            className="border-white border-2 h-full w-full rounded-full object-cover"
            alt="User Avatar"
          />
        </div>
        <NavLink className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg">
          <div className="postcount flex flex-col items-center justify-center">
            <div className="text-xs sm:text-base">Posts</div>
            <div className="text-lg font-medium">{posts || 0}</div>
          </div>
        </NavLink>

        <NavLink
          onClick={seeFollowers}
          className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg cursor-pointer"
        >
          <div className="followers flex flex-col items-center justify-center">
            <div className="text-xs sm:text-base">Followers</div>
            <div className="text-lg font-medium">{followers || 0}</div>
          </div>
        </NavLink>
        <NavLink
          onClick={seeFollowings}
          className="p-2 hover:bg-gray-200 transition duration-75 rounded-lg cursor-pointer"
        >
          <div className="followings flex flex-col items-center justify-center">
            <div className="text-xs sm:text-base">Followings</div>
            <div className="text-lg font-medium">{followings || 0}</div>
          </div>
        </NavLink>
      </div>
      <div className="name_and_edit flex bg-gray-100 items-center justify-between p-2 pt-4">
        <div className="name ml-[6%]">
          <span className="font-semibold">{user.fullname}</span>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
        <div className="buttons mr-6">
          {/* Edit Profile Button */}
          <button
            className="px-4 py-2 bg-green-400 rounded-lg w-28 h-10 flex items-center justify-center"
            onClick={handleEditClick}
          >
            Edit 
          </button>
        </div>
      </div>
      <div className="bio_section flex bg-gray-100 pl-14 pt-2 text-gray-600 text-sm pb-4">
        {user.bio ? (
          <div className="bio" style={{ whiteSpace: "pre-wrap" }}>{user.bio}</div>
        ) : (
          <p className="text-gray-900 font-semibold mr-2">Bio: <span className="italic">No bio available.</span></p>
        )}
      </div>
        <MyPosts userId={user._id} />
     
    </div>
  );
}

export default Profile;
