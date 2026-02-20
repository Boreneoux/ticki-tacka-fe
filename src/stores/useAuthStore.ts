import { create } from 'zustand';

type AuthState = {
  username: string;
  email: string;
  fullName: string;
  role: string;
  profilePictureUrl: string | null;
  isLogin: boolean;
  isLoading: boolean;
};

type AuthActions = {
  setAuth: (
    data: Pick<
      AuthState,
      'username' | 'email' | 'fullName' | 'role' | 'profilePictureUrl'
    >
  ) => void;
  resetAuth: () => void;
  setLoading: (isLoading: boolean) => void;
};

type UseAuthStore = AuthState & AuthActions;

const initialState: Omit<AuthState, 'isLoading'> = {
  username: '',
  email: '',
  fullName: '',
  role: '',
  profilePictureUrl: null,
  isLogin: false
};

const useAuthStore = create<UseAuthStore>(set => ({
  ...initialState,
  isLoading: true,
  setAuth: ({ username, email, fullName, role, profilePictureUrl }) => {
    set({ username, email, fullName, role, profilePictureUrl, isLogin: true });
  },
  resetAuth: () => {
    set(initialState);
  },
  setLoading: isLoading => {
    set({ isLoading });
  }
}));

export default useAuthStore;
