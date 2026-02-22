import { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';

import useAuthStore from '@/stores/useAuthStore';
import { updateProfileApi } from '../api/profile.api';
import { editProfileSchema } from '../schemas/editProfileSchema';
import type { EditProfileFormValues, ProfileData } from '../types';

type UseEditProfileFormProps = {
  profile: ProfileData;
  onSuccess: () => void;
};

export default function useEditProfileForm({
  profile,
  onSuccess
}: UseEditProfileFormProps) {
  const { setAuth } = useAuthStore();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const formik = useFormik<EditProfileFormValues>({
    initialValues: {
      username: profile.username,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber || '',
      organizerName: profile.organizer?.organizerName || '',
      companyAddress: profile.organizer?.companyAddress || ''
    },
    enableReinitialize: true,
    validationSchema: editProfileSchema,
    onSubmit: async values => {
      try {
        const formData = new FormData();

        if (values.username !== profile.username) {
          formData.append('username', values.username);
        }
        if (values.fullName !== profile.fullName) {
          formData.append('fullName', values.fullName);
        }
        if (values.phoneNumber !== (profile.phoneNumber || '')) {
          formData.append('phoneNumber', values.phoneNumber);
        }

        if (profile.role === 'EO') {
          if (
            values.organizerName !== (profile.organizer?.organizerName || '')
          ) {
            formData.append('organizerName', values.organizerName);
          }
          if (
            values.companyAddress !== (profile.organizer?.companyAddress || '')
          ) {
            formData.append('companyAddress', values.companyAddress);
          }
        }

        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }

        const updated = await updateProfileApi(formData);

        setAuth({
          username: updated.username,
          email: updated.email,
          fullName: updated.fullName,
          role: updated.role,
          profilePictureUrl: updated.profilePictureUrl
        });

        toast.success('Profile updated successfully!');
        setProfilePicture(null);
        onSuccess();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to update profile'
          : 'Failed to update profile';
        toast.error(message);
      }
    }
  });

  return { formik, profilePicture, setProfilePicture };
}
