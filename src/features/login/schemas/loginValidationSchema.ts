import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
  password: Yup.string().required('Password is required')
});
