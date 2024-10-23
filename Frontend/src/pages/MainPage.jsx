import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../utils/authContext";

function MainPage() {
    const {setIsLoggedIn} = useAuth();
  const navigate = useNavigate();
  const logout = async()=>{
    try{
      const res = axiosInstance.post("/users/logout");
      setIsLoggedIn(false);
      navigate("/login");
    }
    catch(e){
      console.log(e);
    }
  }
  
  return (
    <div className="container flex">
      <div className="sidebar h-screen ml-2 flex-col justify-start items-center bg-gray-50 shadow-lg hidden sm:flex">
        <div className="logo h-1/5 overflow-hidden flex justify-center items-center -ml-6 mr-3">
          <img
            className="h-[40vh] mix-blend-multiply"
            src="/media/pictures/logo_white.png"
            alt="Logo"
          />
        </div>

        <NavLink
          to="/"
          className="navigations_home sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img src="/media/icons/home.svg" className="h-6 mr-3" alt="Home" />
          Home
        </NavLink>

        <NavLink
          to="/search"
          className="navigations_search sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img src="/media/icons/search.svg" className="h-6 mr-3" alt="Search" />
          Search
        </NavLink>

        <NavLink
          to="/blinks"
          className="navigations_blinks sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img src="/media/icons/blink.svg" className="h-6 mr-3" alt="Blinks" />
          Blinks
        </NavLink>

        <NavLink
          to="/messages"
          className="navigations_messages sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img
            src="/media/icons/message.svg"
            className="h-6 mr-3"
            alt="Messages"
          />
          Messages
        </NavLink>

        <NavLink
          to="/notifications"
          className="navigations_notifications sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img
            src="/media/icons/notification.svg"
            className="h-6 mr-3"
            alt="Notifications"
          />
          Notifications
        </NavLink>

        <NavLink
          to="/create"
          className="navigations_create sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img src="/media/icons/create.svg" className="h-6 mr-3" alt="Create" />
          Create
        </NavLink>

        <NavLink
          to="/profile"
          className="navigations_profile sidebutton flex items-center"
          activeClassName="active-link"
        >
          <img
            src="/media/icons/profile.svg"
            className="h-6 mr-3"
            alt="Profile"
          />
          Profile
        </NavLink>

        <NavLink
          onClick={logout}
          className="navigations_more mt-auto sidebutton flex items-center mb-2"
          activeClassName="active-link"
        >
          <img
            src="/media/icons/logout.svg"
            className="h-6 mr-3"
            alt="More"
          />
          Logout
        </NavLink>
      </div>

      <div className="main_page w-screen h-screen flex flex-col justify-center sm:justify-normal sm:max-w-[60Vw] sm:w-[60vw] overflow-hidden">
        <div className="topbar mb-auto flex items-center p-1 mt-1 sm:hidden">
          <button onClick={logout} className="p-1 mr-auto ml-2 hover:bg-gray-200 rounded-md">
            <img
              src="/media/icons/logout.svg"
              className="h-5"
              alt="Hamburger"
            />
          </button>
          <img
            src="/media/pictures/name_white.png"
            className="h-6 object-cover m-auto"
            alt="Name"
          />
          <NavLink
            to="/notifications"
            className="p-1 mr-0 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img
              src="/media/icons/notification.svg"
              className="h-5"
              alt="Notification"
            />
          </NavLink>
          <NavLink
            to="/messages"
            className="p-1 ml-2 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img
              src="/media/icons/message.svg"
              className="h-5"
              alt="Messages"
            />
          </NavLink>
        </div>
        
          <Outlet />
        

        <div className="navbar flex mt-auto justify-evenly items-center p-1 bg-gray-50 border border-t-4 sm:hidden">
          <NavLink
            to="/"
            className="p-2 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img src="/media/icons/home.svg" className="h-5" alt="Home" />
          </NavLink>
          <NavLink
            to="/search"
            className="p-2 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img src="/media/icons/search.svg" className="h-5" alt="Search" />
          </NavLink>
          <NavLink
            to="/create"
            className="p-1 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img src="/media/icons/create.svg" className="h-7" alt="Create" />
          </NavLink>
          <NavLink
            to="/blinks"
            className="p-2 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img src="/media/icons/blink.svg" className="h-5" alt="Blinks" />
          </NavLink>
          <NavLink
            to="/profile"
            className="p-2 hover:bg-gray-200 rounded-md"
            activeClassName="active-link"
          >
            <img src="/media/icons/profile.svg" className="h-5" alt="Profile" />
          </NavLink>
        </div>
      </div>

      <div className="right_bar"></div>
    </div>
  );
}

export default MainPage;
