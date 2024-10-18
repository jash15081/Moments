import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { HashLoader } from 'react-spinners';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DedicatedPost = ({ post, onClose, toggleLike, likesCount, isLiked }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/post/getComments/${post._id}`);
      if (response.status === 200) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const addComment = async () => {
    if (!comment) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/post/addComment', {
        postId: post._id,
        content: comment,
      });
      setComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setDeleting(true);
    try {
      const response = await axiosInstance.post('/post/deleteComment', { commentId });
      if (response.status === 200) {
        setComments(comments.filter(cmt => cmt._id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleUsernameClick = (username) => {
    navigate(`/userProfile/${username}`);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="bg-white rounded-lg shadow-lg w-4/5 h-4/5 flex z-40 overflow-hidden">
        <div className="w-1/2 h-full p-6 flex flex-col items-center justify-center">
          {post.mediaType === 'video' ? (
            <video controls className="w-full h-auto mb-4">
              <source src={post.media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.media} className="w-full h-auto mb-4" alt="Post media" />
          )}
          <p className="text-gray-600 text-center mt-2">{post.caption}</p>
        </div>

        <div className="w-px h-full bg-gray-300"></div>

        <div className="w-1/2 h-full p-6 flex flex-col justify-between"> 
          <div className="flex items-center justify-between mb-4">
            <div className="likes flex flex-col items-center">
              <button onClick={toggleLike}>
                {isLiked ? (
                  <img src="/media/icons/redheart.svg" className="h-8 mx-1" alt="Unlike" />
                ) : (
                  <img src="/media/icons/heart.svg" className="h-8 mx-1" alt="Like" />
                )}
              </button>
              <p className="text-sm -mt-1">{likesCount}</p>
            </div>
            <div className="share flex flex-col items-center">
              <button>
                <img src="/media/icons/share.svg" className="h-7 mx-1" alt="Share" />
                <p className="text-sm">{post.shares}</p>
              </button>
            </div>
          </div>

          <div className="comments flex-1 overflow-y-auto mb-4">
            {loading ? (
              <p className="text-center text-gray-500"><HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={30} /></p>
            ) : comments.length ? (
              comments.map((cmt, index) => (
                <div key={index} className="comment hover:bg-gray-200 mb-1 p-2 rounded-lg transition duration-75 flex items-start">
                  <img
                    src={cmt.commentedBy.avatar}
                    alt="User avatar"
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => handleUsernameClick(cmt.commentedBy.username)}> {/* Added click handler */}
                      {cmt.commentedBy.username}{' '}
                      <span className="text-gray-400 text-xs">
                        • {formatDistanceToNow(new Date(cmt.createdAt))}
                      </span>
                    </p>
                    <p className="text-gray-800">{cmt.content}</p>
                  </div>
                  {cmt.isDeletable && (
                    <button className="ml-2 p-1 hover:bg-gray-200 rounded-lg" onClick={() => deleteComment(cmt._id)}>
                      <img src="/media/icons/delete.svg" className="h-6" alt="Delete" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No comments yet.</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 border-2 rounded-lg p-2"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading || deleting}
            />
            <button
              onClick={addComment}
              className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-blue-600"
              disabled={loading || deleting}
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        </div>
      )}
    </div>
  );
};

export default DedicatedPost;
