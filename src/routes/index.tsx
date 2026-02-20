import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import GuestRoute from '@/layouts/GuestRoute';
import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/pages/auth/login/LoginPage';
import RegisterPage from '@/pages/auth/register/RegisterPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: '/', element: <HomePage /> }]
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
