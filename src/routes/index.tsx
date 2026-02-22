import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import GuestRoute from '@/layouts/GuestRoute';
import ProtectedRoute from '@/layouts/ProtectedRoute';

// Public pages
import HomePage from '@/pages/home/HomePage';
import EventDiscoveryPage from '@/pages/events/EventDiscoveryPage';
import EventDetailPage from '@/pages/events/EventDetailPage';
import NotFoundPage from '@/pages/not-found/NotFoundPage';

// Guest-only auth pages
import LoginPage from '@/pages/auth/login/LoginPage';
import RegisterPage from '@/pages/auth/register/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/forgot-password/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/reset-password/ResetPasswordPage';

// User-protected pages
import CheckoutPage from '@/pages/events/CheckoutPage';
import TransactionsPage from '@/pages/transactions/TransactionsPage';
import TransactionDetailPage from '@/pages/transactions/TransactionDetailPage';

// Any-auth pages
import ProfilePage from '@/pages/profile/ProfilePage';

// EO dashboard pages
import DashboardEventsPage from '@/pages/dashboard/events/DashboardEventsPage';
import CreateEventPage from '@/pages/dashboard/events/CreateEventPage';
import EditEventPage from '@/pages/dashboard/events/EditEventPage';
import EventVouchersPage from '@/pages/dashboard/events/EventVouchersPage';
import EventStatisticsPage from '@/pages/dashboard/events/EventStatisticsPage';
import EventAttendeesPage from '@/pages/dashboard/events/EventAttendeesPage';
import DashboardTransactionsPage from '@/pages/dashboard/transactions/DashboardTransactionsPage';
import DashboardTransactionDetailPage from '@/pages/dashboard/transactions/DashboardTransactionDetailPage';
import DashboardStatisticsPage from '@/pages/dashboard/statistics/DashboardStatisticsPage';

export const router = createBrowserRouter([
  // ─── Public routes (MainLayout) ───
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/events', element: <EventDiscoveryPage /> },
      { path: '/events/:slug', element: <EventDetailPage /> }
    ]
  },

  // ─── Guest-only routes (redirect to / if logged in) ───
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> }
        ]
      }
    ]
  },

  // ─── User-protected routes (role: User) ───
  {
    element: <ProtectedRoute allowedRoles={['User']} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/events/:slug/checkout', element: <CheckoutPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/transactions/:id', element: <TransactionDetailPage /> }
        ]
      }
    ]
  },

  // ─── Any-auth protected routes (role: User | EO) ───
  {
    element: <ProtectedRoute allowedRoles={['User', 'EO']} />,
    children: [
      {
        element: <MainLayout />,
        children: [{ path: '/profile', element: <ProfilePage /> }]
      }
    ]
  },

  // ─── EO dashboard routes (role: EO, DashboardLayout) ───
  {
    element: <ProtectedRoute allowedRoles={['EO']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Events management
          { path: '/dashboard', element: <DashboardEventsPage /> },
          { path: '/dashboard/events', element: <DashboardEventsPage /> },
          { path: '/dashboard/events/create', element: <CreateEventPage /> },
          {
            path: '/dashboard/events/:id/edit',
            element: <EditEventPage />
          },
          {
            path: '/dashboard/events/:id/vouchers',
            element: <EventVouchersPage />
          },
          {
            path: '/dashboard/events/:id/statistics',
            element: <EventStatisticsPage />
          },
          {
            path: '/dashboard/events/:id/attendees',
            element: <EventAttendeesPage />
          },

          // Transactions management
          {
            path: '/dashboard/transactions',
            element: <DashboardTransactionsPage />
          },
          {
            path: '/dashboard/transactions/:id',
            element: <DashboardTransactionDetailPage />
          },

          // Statistics
          {
            path: '/dashboard/statistics',
            element: <DashboardStatisticsPage />
          },

          // Profile (inside dashboard layout for EO)
          { path: '/dashboard/profile', element: <ProfilePage /> }
        ]
      }
    ]
  },

  // ─── Catch-all 404 ───
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
