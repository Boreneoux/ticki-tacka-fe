import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

import useAuthStore from '@/stores/useAuthStore';
import { loginApi } from '../api/login.api';
import { loginSchema } from '../schemas/loginValidationSchema';
import { LoginFormValues } from '../types';

export default function useFormLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async ({ email, password }) => {
      try {
        const result = await loginApi({ email, password });

        setAuth({ username: result.user.username, role: result.user.role });

        toast.success('Login successful!');

        if (result.user.role === 'EO') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Invalid email or password'
          : 'Invalid email or password';
        toast.error(message);
      }
    }
  });

  return { formik };
}
