import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import MyPost from './MyPost';

const MyPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log(userId)
        const response = await axiosInstance.post('/post/getPostsByUser', { userId });
        setPosts(response.data.data.posts);
        console.log(response)
      } catch (error) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="content mx-auto w-full flex flex-col p-3 h-full scrhide mt-4 sm:h-[77VH] sm:w-[30rem]">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No posts</p>
      ) : (
        posts.map((post) => (
          <MyPost key={post.id} post={post} onDelete={handleDelete} setPosts={setPosts} />
        ))
      )}
    </div>
  );
};

export default MyPosts;
