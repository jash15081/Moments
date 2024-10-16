import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { HashLoader } from 'react-spinners';

const ChangeProfilePicture = ({ user, onUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(user.user.avatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewSrc(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await axiosInstance.post(`/users/uploadAvatar/${user.user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(response.data.data); // Update the user in the parent component
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-profile-pic-container mx-auto w-full max-w-md p-4 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">Change Profile Picture</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4">
        <img src={previewSrc} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-400 text-white rounded-lg flex items-center"
          disabled={loading || !selectedFile}
        >
          {loading ? <HashLoader color="#ffffff" loading={true} size={15} /> : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;
