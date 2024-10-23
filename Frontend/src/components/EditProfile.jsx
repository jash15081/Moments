// EditProfile.jsx
import React, { useState } from 'react';
import { HashLoader } from 'react-spinners';
import axiosInstance from '../utils/axiosConfig';

const EditProfile = ({ user, onCancel, onUpdate }) => {
  const [fullname, setFullname] = useState(user.fullname);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let avatarUrl = user.avatar;
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);

        const uploadResponse = await axiosInstance.post("/users/avatar", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        avatarUrl = uploadResponse.data.data.avatar;
      }

      const payload = {
        fullname,
        username,
        email,
        bio,
        isPrivate,
        avatar: avatarUrl,
      };
      const response = await axiosInstance.post("/users/update-account", payload);
      onUpdate(response.data.data); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Column - Form */}
        <div className="flex-1 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Edit Profile</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block text-gray-700">Full Name</label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-gray-700">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-20 px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
              />
            </div>

            {/* Private Account */}
            <div className="flex items-center">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPrivate" className="ml-2 text-gray-700">Private Account</label>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <HashLoader color="#ffffff" loading={true} size={15} /> : 'Save'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Avatar */}
        <div className="flex flex-col items-center">
          <label className="block text-gray-700 mb-2">Profile Picture</label>
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
