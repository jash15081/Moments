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
