import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';

import { changePasswordApi } from '../api/profile.api';
import { changePasswordSchema } from '../schemas/changePasswordSchema';
import type { ChangePasswordFormValues } from '../types';

export default function useChangePasswordForm() {
  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: changePasswordSchema,
    onSubmit: async ({ oldPassword, newPassword }, { resetForm }) => {
      try {
        await changePasswordApi({ oldPassword, newPassword });
        toast.success('Password changed successfully!');
        resetForm();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to change password'
          : 'Failed to change password';
        toast.error(message);
      }
    }
  });

  return { formik };
}
