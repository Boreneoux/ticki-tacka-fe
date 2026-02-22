import { useState } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import axios from 'axios';

import { forgotPasswordApi } from '../api/forgotPassword.api';
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema';
import { ForgotPasswordFormValues } from '../types';

export default function useFormForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: ''
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async ({ email }) => {
      try {
        await forgotPasswordApi({ email });
        setIsSubmitted(true);
      } catch (error) {
        // Always show generic success message for security
        // (don't reveal whether email exists)
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          toast.error('Too many requests. Please try again later.');
        } else {
          setIsSubmitted(true);
        }
      }
    }
  });

  return { formik, isSubmitted };
}
