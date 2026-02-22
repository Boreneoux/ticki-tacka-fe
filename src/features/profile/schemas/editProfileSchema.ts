import * as Yup from 'yup';

export const editProfileSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must be at most 100 characters'),
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(255, 'Full name must be at most 255 characters'),
  phoneNumber: Yup.string()
    .min(5, 'Phone number must be at least 5 characters')
    .max(20, 'Phone number must be at most 20 characters'),
  organizerName: Yup.string()
    .min(2, 'Organizer name must be at least 2 characters')
    .max(255, 'Organizer name must be at most 255 characters'),
  companyAddress: Yup.string().min(
    5,
    'Company address must be at least 5 characters'
  )
});
