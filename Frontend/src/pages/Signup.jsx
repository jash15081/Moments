import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // React Hook Form
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { HashLoader } from 'react-spinners';

const SignupForm = () => {
  const { register, handleSubmit } = useForm(); // Initialize useForm from react-hook-form
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData) => {
    setError('');
    setIsLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Password must match!');
        setIsLoading(false);
        return;
      }
      const response = await axiosInstance.post('/users/register', formData);
      console.log('Signup successful:', response.data);
      setIsLoading(false);
      navigate('/login');
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="container flex items-center justify-center rounded-xl">
      <div className="left shadow-xl flex-col justify-center items-center h-[32.7rem] z-10 rounded-lg overflow-hidden bg-gray-100 mr-3 hidden md:flex">
        <div className="logo bg-gray-100 overflow-hidden h-3/4 flex justify-center items-center">
          <img src="/media/pictures/logo_white.png" className="object-contain mr-8 min-h-[500px] mix-blend-multiply" alt="logo_not_found" />
        </div>
        <div className="contact_us flex h-1/4 bg-gray-100 justify-center items-center space-x-5">
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/github_light.svg" alt="git" /></a>
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/linkedin_light.svg" alt="linkedin" /></a>
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/mail_light.svg" alt="mail" /></a>
          <a className="h-1/3" href=""><img className="h-full mix-blend-multiply" src="/media/pictures/only_logo_white.png" alt="small_logo" /></a>
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/phone_light.svg" alt="phone" /></a>
        </div>
      </div>

      <div className="right flex flex-col p-5 bg-gray-100 rounded-md shadow-xl w-80 h-[35.7rem] min-w-96 md:h-[32.7rem]">
        <h1 className="text-xl font-bold text-gray-600 m-auto mb-3">Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            required
            name="email"
            className="p-3 py-1 border border-slate-200 rounded-sm mb-3 focus:border-gray-400 w-full"
            type="email"
            placeholder="Email"
            {...register('email')} // Using register from react-hook-form
          />
          <input
            required
            name="username"
            className="p-3 py-1 border border-slate-200 rounded-sm mb-3 focus:border-gray-400 w-full"
            type="text"
            placeholder="Username"
            {...register('username')}
          />
          
          <input
            required
            name="fullname"
            className="p-3 py-1 border border-slate-200 rounded-sm mb-3 focus:border-gray-400 w-full"
            type="text"
            placeholder="Full name"
            {...register('fullname')}
          />
          <input
            required
            name="password"
            className="p-3 py-1 border border-slate-200 rounded-sm mb-3 focus:border-gray-400 w-full"
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          <input
            required
            name="confirmPassword"
            className="p-3 py-1 border border-slate-200 rounded-sm mb-3 focus:border-gray-400 w-full"
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 bg-gray-700 rounded-lg my-3 text-white hover:bg-gray-950 transition duration-75 ease-in flex items-center justify-center h-10">
            {isLoading ? <HashLoader color={"#ececec"} loading={true} size={20} /> : "Sign Up"}
          </button>
        </form>

        <div className="h-1 rounded-lg bg-gray-300 my-1"></div>
        <button className="flex justify-center my-3 items-center py-1 rounded-lg bg-gray-200">
          <img src="/media/icons/google.svg" className="w-8 mr-2" alt="google" /> Sign Up with Google
        </button>
        <p className="m-auto">Already have an account? <Link to="/login" className="underline text-blue-500">Log In</Link></p>

        <div className="contact_us flex h-1/4 bg-gray-100 justify-center items-center space-x-5 md:hidden">
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/github_light.svg" alt="github" /></a>
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/linkedin_light.svg" alt="linkedin" /></a>
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/mail_light.svg" alt="mail" /></a>
          <a className="h-1/3" href=""><img className="h-full mix-blend-multiply" src="/media/pictures/only_logo_white.png" alt="small_logo" /></a>
          <a className="h-1/3" href=""><img className="h-full" src="/media/icons/phone_light.svg" alt="phone" /></a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
