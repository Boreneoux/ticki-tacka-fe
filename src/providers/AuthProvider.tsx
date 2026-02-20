import { useEffect } from 'react';

import useAuthStore from '@/stores/useAuthStore';
import { sessionApi } from '@/features/login/api/session.api';

export default function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await sessionApi();
        setAuth({ username: user.username, role: user.role });
      } catch {
        // Not logged in — that's fine, just stay as guest
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setAuth, setLoading]);

  return <>{children}</>;
}
