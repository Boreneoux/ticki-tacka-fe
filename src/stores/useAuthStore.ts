import { create } from 'zustand';

type AuthState = {
  username: string;
  role: string;
  isLogin: boolean;
  isLoading: boolean;
};

type AuthActions = {
  setAuth: (data: Pick<AuthState, 'username' | 'role'>) => void;
  resetAuth: () => void;
  setLoading: (isLoading: boolean) => void;
};

type UseAuthStore = AuthState & AuthActions;

const initialState: Omit<AuthState, 'isLoading'> = {
  username: '',
  role: '',
  isLogin: false
};

const useAuthStore = create<UseAuthStore>(set => ({
  ...initialState,
  isLoading: true,
  setAuth: ({ username, role }) => {
    set({ username, role, isLogin: true });
  },
  resetAuth: () => {
    set(initialState);
  },
  setLoading: isLoading => {
    set({ isLoading });
  }
}));

export default useAuthStore;
