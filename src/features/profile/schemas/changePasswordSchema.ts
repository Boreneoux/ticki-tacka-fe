import * as Yup from 'yup';

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'New password must be at least 6 characters')
    .notOneOf(
      [Yup.ref('oldPassword')],
      'New password must be different from current password'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
});
