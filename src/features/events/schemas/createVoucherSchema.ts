import * as Yup from 'yup';

export const createVoucherSchema = Yup.object().shape({
  voucherCode: Yup.string()
    .required('Voucher code is required')
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be at most 20 characters'),
  voucherName: Yup.string().required('Voucher name is required'),
  discountType: Yup.mixed<'percentage' | 'fixed'>()
    .oneOf(['percentage', 'fixed'], 'Invalid discount type')
    .required('Discount type is required'),
  discountValue: Yup.number()
    .min(0.01, 'Discount value must be greater than 0')
    .required('Discount value is required'),
  maxDiscount: Yup.number()
    .nullable()
    .when('discountType', {
      is: 'percentage',
      then: schema =>
        schema
          .required('Max discount is required for percentage discount')
          .min(0, 'Max discount cannot be negative'),
      otherwise: schema => schema.nullable()
    }),
  maxUsage: Yup.number()
    .min(1, 'Max usage must be at least 1')
    .required('Max usage is required'),
  startDate: Yup.date().required('Start date is required'),
  expiredAt: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date cannot be before start date'),
  isActive: Yup.boolean().required('Active status is required')
});
