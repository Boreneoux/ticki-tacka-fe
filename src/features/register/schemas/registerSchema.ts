import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  fullName: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  referralCode: Yup.string(),
  role: Yup.string().oneOf(['User', 'EO']).required(),
  organizerName: Yup.string().when('role', {
    is: 'EO',
    then: schema => schema.required('Organization name is required')
  }),
  companyAddress: Yup.string().when('role', {
    is: 'EO',
    then: schema => schema.required('Company address is required')
  })
});
