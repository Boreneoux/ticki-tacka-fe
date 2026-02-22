import { useFormik } from 'formik';
import { createVoucherSchema } from '../schemas/createVoucherSchema';
import { createVoucherApi } from '../api/organizer-events.api';
import type { VoucherFormValues } from '../types';
import type { DiscountType } from '@/types/enums';
import toast from 'react-hot-toast';
import axios from 'axios';

export function useCreateVoucherForm(eventId: string, onSuccess?: () => void) {
  const initialValues: VoucherFormValues = {
    voucherCode: '',
    voucherName: '',
    discountType: '',
    discountValue: '',
    maxDiscount: '',
    maxUsage: '',
    startDate: '',
    expiredAt: '',
    isActive: true
  };

  const formik = useFormik<VoucherFormValues>({
    initialValues,
    validationSchema: createVoucherSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createVoucherApi(eventId, {
          voucherCode: values.voucherCode.trim(),
          voucherName: values.voucherName.trim(),
          discountType: values.discountType as DiscountType,
          discountValue: Number(values.discountValue),
          maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : null,
          maxUsage: Number(values.maxUsage),
          startDate: new Date(values.startDate).toISOString(),
          expiredAt: new Date(values.expiredAt).toISOString(),
          isActive: values.isActive
        });

        toast.success('Voucher created successfully!');
        resetForm();
        if (onSuccess) onSuccess();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Failed to create voucher'
          );
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    }
  });

  return { formik };
}
