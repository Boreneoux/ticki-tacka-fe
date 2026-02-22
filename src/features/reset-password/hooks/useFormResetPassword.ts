import { useState } from 'react';
import { useFormik } from 'formik';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

import { resetPasswordApi } from '../api/resetPassword.api';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema';
import { ResetPasswordFormValues } from '../types';

export default function useFormResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get('token');

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async ({ newPassword }) => {
      if (!token) return;

      try {
        await resetPasswordApi(token, newPassword);
        setIsSuccess(true);
        toast.success('Password has been reset successfully!');

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ||
            'Failed to reset password. The link may have expired.'
          : 'Failed to reset password. Please try again.';
        toast.error(message);
      }
    }
  });

  return { formik, isSuccess, tokenMissing: !token };
}
