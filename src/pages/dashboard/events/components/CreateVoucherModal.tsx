import { FormikProps } from 'formik';
import { Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import type { VoucherFormValues } from '@/features/events/types';

type CreateVoucherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<VoucherFormValues>;
  isLoading: boolean;
};

export default function CreateVoucherModal({
  isOpen,
  onClose,
  formik,
  isLoading
}: CreateVoucherModalProps) {
  if (!isOpen) return null;

  const isPercentage = formik.values.discountType === 'percentage';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isLoading && onClose()}></div>
      <div className="relative bg-background rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border/40">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Create Event Voucher
          </h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voucher Code *</Label>
              <Input
                {...formik.getFieldProps('voucherCode')}
                placeholder="e.g. SUMMER24"
              />
              {formik.touched.voucherCode && formik.errors.voucherCode && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.voucherCode}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Voucher Name *</Label>
              <Input
                {...formik.getFieldProps('voucherName')}
                placeholder="e.g. Summer Promo"
              />
              {formik.touched.voucherName && formik.errors.voucherName && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.voucherName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type *</Label>
              <Select
                value={formik.values.discountType}
                onValueChange={val =>
                  formik.setFieldValue(
                    'discountType',
                    val as 'percentage' | 'fixed'
                  )
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (IDR)</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.discountType && formik.errors.discountType && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.discountType}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input
                type="number"
                {...formik.getFieldProps('discountValue')}
                placeholder={isPercentage ? '10' : '50000'}
              />
              {formik.touched.discountValue && formik.errors.discountValue && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.discountValue}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isPercentage && (
              <div className="space-y-2">
                <Label>Max Discount (IDR) *</Label>
                <Input type="number" {...formik.getFieldProps('maxDiscount')} />
                {formik.touched.maxDiscount && formik.errors.maxDiscount && (
                  <p className="text-[10px] text-destructive">
                    {formik.errors.maxDiscount}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>Max Usage/Quota *</Label>
              <Input
                type="number"
                min="1"
                {...formik.getFieldProps('maxUsage')}
              />
              {formik.touched.maxUsage && formik.errors.maxUsage && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.maxUsage}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date & Time *</Label>
              <Input
                type="datetime-local"
                {...formik.getFieldProps('startDate')}
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.startDate as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>End Date & Time *</Label>
              <Input
                type="datetime-local"
                {...formik.getFieldProps('expiredAt')}
              />
              {formik.touched.expiredAt && formik.errors.expiredAt && (
                <p className="text-[10px] text-destructive">
                  {formik.errors.expiredAt as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Voucher
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
