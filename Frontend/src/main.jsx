import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './components/Home.jsx';
import Messages from './components/Mesages.jsx';
import MainPage from './pages/MainPage.jsx';
import { useAuth } from './utils/authContext.jsx'; 
import AuthProvider from './utils/authContext.jsx';
import Blinks from './components/Blinks.jsx';
import Create from './components/Create.jsx';
import Notifications from './components/Notifications.jsx';
import Profile from './components/Profile.jsx';
import Search from './components/Search.jsx';
import UserProfile from './components/UserProfile.jsx';
import Followers from './components/Followers.jsx';
import Followings from './components/Followings.jsx';
import EditFollowings from './components/EditFollowings.jsx';
import EditFollowers from './components/EditFollowers.jsx';
const AppRoutes = () => {
  const { isLoggedIn } = useAuth(); 
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '',
          element: isLoggedIn ? <MainPage /> : <Login />, 
          children: [
            {
              path: '',
              element: <Home />,
            },
            {
              path: 'messages',
              element: <Messages />,
            },
            {
              path: 'create',
              element: <Create />,
            },
            {
              path: 'blinks',
              element: <Blinks />,
            },
            {
              path: 'notifications',
              element: <Notifications />,
            },
            {
              path: 'profile',
              element: <Profile />,
            },
            {
              path: 'search',
              element: <Search />,
            },
            {
              path:'userProfile/:username',
              element:<UserProfile/>
            },
            {
              path:'followers/:userId',
              element:<Followers/>
            },
            {
              path:'followings/:userId',
              element:<Followings/>
            },
            {
              path:'editFollowings/:userId',
              element:<EditFollowings/>
            },
            {
              path:'editFollowers/:userId',
              element:<EditFollowers/>
            },
          ],
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'signup',
          element: <Signup />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
      <AppRoutes /> 
    </AuthProvider>
  </StrictMode>,
);
