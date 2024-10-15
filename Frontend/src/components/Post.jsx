import React from 'react';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
    const navigate = useNavigate()
    const navigateUser = (username)=>{
        console.log("I want to navigate")
        navigate(`/userProfile/${username}`);
    }

  return (
    <div className="post flex flex-col w-full flex-shrink-0">
        <div className="top_bar flex items-center py-2">
        <div className="profile_picture h-12 aspect-square rounded-[6rem] p-[2px] bg-gradient-to-t from-blue-900 via-blue-500 to-purple-600 overflow-hidden ">
          <button>
            <img
              src={post.creator[0].avatar}
              className="h-full aspect-square object-cover rounded-full border-white border-2"
              alt=""
            />
          </button>
        </div>
        <div className="title flex flex-col ml-4 items-start">
          <p className="text-lg" onClick={()=>{navigateUser(post.creator[0].username)}}>{post.creator[0].username}</p>
          <p className="text-sm -mt-1 flex items-center justify-center">
            <img src="media/icons/music.svg" className="h-3 mr-1 mt-1" alt="" />- {post.audioName}
          </p>
        </div>
        <div className="more ml-auto p-2">
          <button className="h-6 p-1 hover:bg-gray-200 rounded-lg flex justify-center items-center">
            <img src="media/icons/dots.svg" className="h-6" alt="" />
          </button>
        </div>
      </div>
      <div className="media w-full h-auto  rounded-lg shadow-lg">
        {post.mediaType === 'video' ? (
          <video controls className="w-full max-h-96 mx-auto">
            <source src={post.media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={post.media} className="mx-auto max-h-96" alt="Post media" />
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
    </div>
  );
};

export default Post;
