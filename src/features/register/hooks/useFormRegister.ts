import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

import useAuthStore from '@/stores/useAuthStore';
import { registerApi } from '../api/register.api';
import { registerSchema } from '../schemas/registerSchema';
import { RegisterFormValues } from '../types';

export default function useFormRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      email: '',
      username: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      referralCode: '',
      role: 'User',
      organizerName: '',
      companyAddress: ''
    },
    validationSchema: registerSchema,
    onSubmit: async values => {
      try {
        const result = await registerApi(values);

        setAuth({ username: result.user.username, role: result.user.role });

        toast.success('Account created successfully!');

        if (result.user.role === 'EO') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ||
            'Registration failed. Please try again.'
          : 'Registration failed. Please try again.';
        toast.error(message);
      }
    }
  });

  return { formik };
}
