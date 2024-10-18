import React, { useState } from 'react';
import { HashLoader } from 'react-spinners';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns
import axiosInstance from '../utils/axiosConfig';
import DedicatedPost from './PostInteraction'; // Import the DedicatedPost component

const MyPost = ({ post, onDelete, setPosts }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showDedicatedPost, setShowDedicatedPost] = useState(false); // State to control DedicatedPost visibility

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/post/deletePost/${post._id}`);
      setPosts(res.data.data.posts);
      onDelete(post._id);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to delete post', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      const response = isLiked
        ? await axiosInstance.post('/post/dislike', { postId: post._id })
        : await axiosInstance.post('/post/like', { postId: post._id });

      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  const handlePostClick = () => {
    setShowDedicatedPost(true); // Show the DedicatedPost when the post is clicked
  };

  const closeDedicatedPost = () => {
    setShowDedicatedPost(false); // Hide the DedicatedPost when closing it
  };

  return (
    <>
      <div className="post flex flex-col w-full flex-shrink-0 relative hover:bg-gray-200 transition duration-75 rounded-lg p-3" onClick={handlePostClick}>
        {/* Display the time ago above the media */}
        <div className="text-gray-500 text-sm mb-2">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>

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
        <div className="interaction flex py-4 items-center">
          <div className="likes flex flex-col items-center justify-center">
            <button onClick={(e) => { e.stopPropagation(); toggleLike(); }}>
              {isLiked ? (
                <img src="/media/icons/redheart.svg" className="h-8 mx-1" alt="Unlike" />
              ) : (
                <img src="/media/icons/heart.svg" className="h-8 mx-1" alt="Like" />
              )}
            </button>
            <p className="text-sm -mt-1">{likesCount}</p>
          </div>

          <div className="comments flex flex-col items-center justify-center">
            <button onClick={(e) => e.stopPropagation()}>
              <img src="/media/icons/comment.svg" className="h-9 -mt-1 mx-1" alt="Comment" />
            </button>
            <p className="text-sm -mt-1">{post.commentsCount}</p>
          </div>

          <div className="share flex flex-col items-center justify-center">
            <button onClick={(e) => e.stopPropagation()}>
              <img src="/media/icons/share.svg" className="h-7 mx-1" alt="Share" />
              <p className="text-sm">{post.shares}</p>
            </button>
          </div>

          {/* Delete button */}
          <div className="delete-button flex justify-end ml-auto">
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="caption ml-1.5">{post.caption}</div>
        <div className="line bg-gray-300 w-full h-[2px] rounded-lg my-4"></div>

        {showConfirm && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
            <div className="confirm-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 p-4 rounded-lg shadow-lg flex flex-col items-center z-20">
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
          </>
        )}

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-30">
            <HashLoader color="#ff0000" loading={loading} size={60} />
          </div>
        )}
      </div>

      {/* DedicatedPost Popup */}
      {showDedicatedPost && (
        <DedicatedPost
          post={post}
          onClose={closeDedicatedPost}
          toggleLike={toggleLike}
          likesCount={likesCount}
          isLiked={isLiked}
        />
      )}
    </>
  );
};

export default MyPost;
