import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { useOrganizerEventDetail } from '@/features/events/hooks/useOrganizerEventDetail';
import { useCreateVoucherForm } from '@/features/events/hooks/useCreateVoucherForm';

import VoucherList from './components/VoucherList';
import CreateVoucherModal from './components/CreateVoucherModal';

export default function EventVouchersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { event, isLoading, refetch } = useOrganizerEventDetail(id!);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const { formik: voucherFormik } = useCreateVoucherForm(id!, () => {
    refetch();
    setIsVoucherModalOpen(false);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Button onClick={() => navigate('/dashboard/events')} className="mt-4">
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background pb-12">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Vouchers for {event.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your promotional vouchers for this event.
          </p>
        </div>

        <div className="space-y-8">
          <VoucherList
            vouchers={event.eventVouchers ?? event.vouchers ?? []}
            onCreateClick={() => setIsVoucherModalOpen(true)}
          />
        </div>
      </div>

      <CreateVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        formik={voucherFormik}
        isLoading={voucherFormik.isSubmitting}
      />
    </div>
  );
}
