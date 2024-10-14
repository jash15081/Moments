import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const Create = () => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState(''); // 'success' or 'error'

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPopupMessage(''); // Clear previous messages
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('media', media); // Assuming media is a file object

      const res = await axiosInstance.post('/post/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // On success
      setPopupMessage('Post created successfully!');
      setPopupType('success');
      setMedia(null);
      setCaption('');
    } catch (error) {
      console.error(error.response?.data?.message);
      setPopupMessage('Failed to create post. Please try again.');
      setPopupType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMedia = () => {
    setMedia(null);
  };

  return (
    <div className="flex bg-gray-100 border border-gray-300 rounded-lg w-full h-full mx-auto mt-6 shadow-lg transition duration-75">
      <div className="flex-1 p-5 border-r border-gray-300 flex flex-col items-center justify-center transition duration-75">
        <div className="w-full h-[70%] bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-5 relative transition duration-75">
          {media ? (
            <>
              <img src={media} alt="Selected media" className="max-w-full max-h-full rounded-lg" />
              <button
                onClick={handleClearMedia}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-75"
              >
                Clear
              </button>
            </>
          ) : (
            <div className="text-gray-500 text-lg">Select a media to preview</div>
          )}
        </div>
        <label className="flex items-center space-x-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-75">
          <img
            src="/media/icons/add.svg"
            alt="Add"
            className="w-4 h-4"
            style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="hidden"
          />
        </label>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between transition duration-75">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={handleCaptionChange}
            className="flex-grow resize-none border border-gray-300 rounded-lg p-3 text-lg bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-75"
          />
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-75"
            >
              Post
            </button>
            <button
              type="button"
              onClick={() => setCaption('')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-75"
            >
              Clear Caption
            </button>
          </div>
        </form>
      </div>

      {/* Popup message */}
      {popupMessage && (
        <div className={`fixed bottom-10 right-10 p-4 rounded-lg shadow-lg ${popupType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default Create;
