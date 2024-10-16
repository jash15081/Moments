import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const MyPost = ({ post, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/post/deletePost/${post.id}`);
      onDelete(post.id);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  return (
    <div className="post flex flex-col w-full flex-shrink-0">
      <div className="media w-full h-auto rounded-lg shadow-lg">
        {post.mediaType === 'video' ? (
          <video controls className="w-full mx-auto">
            <source src={post.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={post.media} className="w-full" alt="Post media" />
        )}
      </div>
      <div className="interction flex py-4">
        <div className="likes flex flex-col items-center justify-center">
          <button>
            <img src="/media/icons/heart.svg" className="h-8 mx-1" alt="Like" />
          </button>
          <p className="text-sm -mt-1">{post.likesCount}</p>
        </div>

        <div className="comments flex flex-col items-center justify-center">
          <button>
            <img src="/media/icons/comment.svg" className="h-9 -mt-1 mx-1" alt="Comment" />
          </button>
          <p className="text-sm -mt-1">{post.commentsCount}</p>
        </div>

        <div className="share flex flex-col items-center justify-center">
          <button>
            <img src="/media/icons/share.svg" className="h-7 mx-1" alt="Share" />
            <p className="text-sm">{post.shares}</p>
          </button>
        </div>
      </div>
      <div className="caption ml-1.5">{post.caption}</div>
      <div className="line bg-gray-300 w-full h-[2px] rounded-lg my-4"></div>
      <div className="delete-button flex justify-end">
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      {showConfirm && (
        <div className="confirm-popup bg-gray-200 p-4 rounded-lg shadow-lg flex flex-col items-center">
          <p>Are you sure you want to delete this post?</p>
          <div className="flex mt-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPost;
