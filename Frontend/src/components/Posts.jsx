import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import axiosInstance from '../utils/axiosConfig';

const Posts = ({userId}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.post("/post/getPostsByUser",{userId})
        console.log(response.data.data.posts)
        setPosts(response.data.data.posts);
      } catch (error) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="content mx-auto w-full flex flex-col p-3   h-full scrhide mt-4 sm:h-[77VH] sm:w-[30rem]">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
