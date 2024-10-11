import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import { HashLoader } from 'react-spinners';
import axiosInstance from '../utils/axiosConfig';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await axiosInstance.post('/users/login', { username: data.username, email: data.username, password: data.password });
      console.log('logged');
      setIsLoading(false);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError(err.response.data.message || 'Log in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form className="container flex items-center justify-center rounded-xl m-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="left shadow-xl flex-col justify-center items-center h-[24.7rem] z-10 rounded-lg overflow-hidden bg-gray-100 mr-3 hidden md:flex">
        <div className="logo bg-gray-100 overflow-hidden h-3/4 flex justify-center items-center">
          <img
            src="/media/pictures/logo_white.png"
            className="object-contain mr-8 min-h-[500px] mix-blend-multiply"
            alt="logo_not_found"
          />
        </div>
        <div className="contact_us flex h-1/4 bg-gray-100 justify-center items-center space-x-5">
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/github_light.svg" alt="GitHub" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/linkedin_light.svg" alt="LinkedIn" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/mail_light.svg" alt="Email" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full mix-blend-multiply" src="/media/pictures/only_logo_white.png" alt="Logo" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/phone_light.svg" alt="Phone" />
          </a>
        </div>
      </div>

      <div className="right flex flex-col p-5 bg-gray-100 rounded-md shadow-xl w-80 h-[26.7rem] min-w-96 md:h-[24.7rem]">
        <h1 className="text-xl font-bold text-gray-600 m-auto mb-3">Log In</h1>
        <form action=""></form>
        <input
          className="p-3 py-1 border border-slate-200 rounded-sm focus:border-gray-400"
          type="text"
          placeholder="Email or Username"
          {...register("username")}
        />

        <input
          className="p-3 py-1 border border-slate-200 rounded-sm mt-3"
          type="password"
          placeholder="Password"
          {...register("password")}
        />

        {error && <p className="text-red-500">{error}</p>}
        <a href="#" className="ml-1 text-xs text-blue-500 mt-3">Forgot password?</a>
        <button className="px-4 py-2 bg-gray-700 rounded-lg my-3 text-white hover:bg-gray-950 transition duration-75 ease-in flex items-center justify-center h-10"
          type="submit">
          {isLoading ? <HashLoader color={"#ececec"} loading={true} size={20} /> : "Log In"}
        </button>
        <div className="h-1 rounded-lg bg-gray-300 my-3"></div>
        <button className="flex justify-center my-3 items-center py-1 rounded-lg bg-gray-200">
          <img src="/media/icons/google.svg" className="w-8 mr-2" alt="Google" />
          Log In with Google
        </button>
        <p className="m-auto">
          Don't have an account? <Link to="../signup" className="underline text-blue-500">Sign Up</Link>
        </p>
        <div className="contact_us flex h-1/4 bg-gray-100 justify-center items-center space-x-5 md:hidden">
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/github_light.svg" alt="GitHub" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/linkedin_light.svg" alt="LinkedIn" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/mail_light.svg" alt="Email" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full mix-blend-multiply" src="/media/pictures/only_logo_white.png" alt="Logo" />
          </a>
          <a className="h-1/3" href="#">
            <img className="h-full" src="/media/icons/phone_light.svg" alt="Phone" />
          </a>
        </div>
      </div>
    </form>
  );
};

export default Login;
