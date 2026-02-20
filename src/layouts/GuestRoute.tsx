import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore from '@/stores/useAuthStore';

export default function GuestRoute() {
  const { isLogin, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLogin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
