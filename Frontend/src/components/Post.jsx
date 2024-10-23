import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns for formatting time
import axiosInstance from '../utils/axiosConfig';
import DedicatedPost from './PostInteraction';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showDedicatedPost, setShowDedicatedPost] = useState(false);

  const navigateUser = (username, event) => {
    event.stopPropagation();
    navigate(`/userProfile/${username}`);
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
    setShowDedicatedPost(true);
  };

  const closeDedicatedPost = () => {
    setShowDedicatedPost(false);
  };

  return (
    <>
      <div className="post flex flex-col w-full flex-shrink-0 hover:bg-gray-200 p-3 transition duration-75 rounded-lg" onClick={handlePostClick}>
        <div className="top_bar flex items-center py-2">
          <div className="profile_picture h-12 aspect-square rounded-[6rem] p-[2px] bg-gradient-to-t from-blue-900 via-blue-500 to-purple-600 overflow-hidden">
            <button onClick={(e) => navigateUser(post.creator.username, e)}>
              <img
                src={post.creator.avatar}
                className="h-full aspect-square object-cover rounded-full border-white border-2"
                alt=""
              />
            </button>
          </div>
          <div className="title flex flex-col ml-4 items-start">
            <p
              className="text-lg cursor-pointer"
              onClick={(e) => navigateUser(post.creator.username, e)}
            >
              {post.creator.username}
            </p>
            <p className="text-sm -mt-1 flex items-center justify-center">
              <img src="media/icons/music.svg" className="h-3 mr-1 mt-1" alt="" />- {post.audioName}
            </p>
          </div>
          {/* Display time ago */}
          <div className="timeago ml-auto p-2 text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
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
        <div className="interaction flex py-4">
          <div className="likes flex flex-col items-center justify-center">
            <button onClick={(e) => { e.stopPropagation(); toggleLike(); }}>
              {isLiked
                ? <img src="/media/icons/redheart.svg" className="h-8 mx-1" alt="Unlike" />
                : <img src="/media/icons/heart.svg" className="h-8 mx-1" alt="Like" />
              }
            </button>
            <p className="text-sm -mt-1">{likesCount}</p>
          </div>
          <div className="comments flex flex-col items-center justify-center" >
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
      </div>

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

export default Post;
