import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import Post from './Post';
import { HashLoader } from 'react-spinners';
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/users/current-user');
      setCurrentUser(response.data.data.user);
    } catch (error) {
      console.log('Failed to fetch current user:', error);
      setError('Failed to fetch user data');
    }
  };

  useEffect(() => {
    // Fetch user and posts data
    const fetchRandomPosts = async () => {
      try {
        // Fetch current user info
        await fetchCurrentUser();

        // Fetch random posts for home
        const response = await axiosInstance.get('/post/getPostsForHome');
        console.log(response)

        setPosts(response.data.data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPosts();
  }, []);

  if (loading) return <HashLoader className="mx-auto mt-[30%]" color={"#808080"} loading={true} size={40} />;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container mx-auto w-full flex flex-col p-4 h-full mt-4 sm:w-[35rem] overflow-y-auto">
      {/* Greeting */}
      <div className="greeting bg-blue-100 p-4 rounded-lg text-center mb-6">
        <h1 className="text-xl font-semibold text-blue-800">
          Welcome back, {currentUser ? currentUser.fullname : 'User'}!
        </h1>
        <p className="text-sm text-blue-600">Here's what's happening today:</p>
      </div>

      {/* Posts Section */}
      <div className="posts-section flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">You don't follow anyone !</p>
        ) : (
          posts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Home;
