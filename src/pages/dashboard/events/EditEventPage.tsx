import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Loader2,
  Save,
  LayoutDashboard,
  Ticket,
  Tag
} from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { useConfirmDialog } from '@/components/ui/useConfirmDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

import { useOrganizerEventDetail } from '@/features/events/hooks/useOrganizerEventDetail';
import { useEditEventForm } from '@/features/events/hooks/useEditEventForm';
import { useTicketTypeManagement } from '@/features/events/hooks/useTicketTypeManagement';
import { useEventActions } from '@/features/events/hooks/useEventActions';
import { useCreateVoucherForm } from '@/features/events/hooks/useCreateVoucherForm';

import EventForm from './components/EventForm';
import TicketTypeManager from './components/TicketTypeManager';
import VoucherList from './components/VoucherList';
import CreateVoucherModal from './components/CreateVoucherModal';

import type { OrganizerEventDetailResponseData } from '@/features/events/types';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, isLoading, refetch } = useOrganizerEventDetail(id!);

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

  return <EditEventPageContent event={event} refetch={refetch} />;
}

function EditEventPageContent({
  event,
  refetch
}: {
  event: OrganizerEventDetailResponseData;
  refetch: () => void;
}) {
  const navigate = useNavigate();
  const { formik } = useEditEventForm(event);

  const {
    ticketTypes,
    addTicketType,
    updateTicketType,
    deleteTicketType,
    isLoading: isTicketLoading
  } = useTicketTypeManagement(event?.id || '', event?.ticketTypes);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const { formik: voucherFormik } = useCreateVoucherForm(
    event?.id || '',
    () => {
      refetch();
      setIsVoucherModalOpen(false);
    }
  );

  const { publishEvent, cancelEvent, deleteEvent } = useEventActions(refetch);
  const { confirm, dialog } = useConfirmDialog();

  return (
    <div className="min-h-[80vh] bg-background pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/events')}
            className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {event.status === 'draft' && (
              <Button
                variant="outline"
                onClick={() =>
                  confirm({
                    title: 'Publish Event',
                    onConfirm: () => publishEvent(event.id)
                  })
                }>
                Publish
              </Button>
            )}
            {event.status === 'published' && (
              <Button
                variant="outline"
                className="text-warning hover:text-warning hover:bg-warning/10"
                onClick={() =>
                  confirm({
                    title: 'Cancel Event',
                    variant: 'destructive',
                    onConfirm: () => cancelEvent(event.id)
                  })
                }>
                Cancel Event
              </Button>
            )}
            {event.status === 'draft' && (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() =>
                  confirm({
                    title: 'Delete Event',
                    variant: 'destructive',
                    onConfirm: () => {
                      deleteEvent(event.id);
                      navigate('/dashboard/events');
                    }
                  })
                }>
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground mt-1">
            Update your event details, manage tickets, and create vouchers.
          </p>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6 w-full sm:w-100 grid grid-cols-3">
            <TabsTrigger value="details">
              <LayoutDashboard className="w-4 h-4 mr-2 hidden sm:inline-block" />
              Details
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <Ticket className="w-4 h-4 mr-2 hidden sm:inline-block" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="vouchers">
              <Tag className="w-4 h-4 mr-2 hidden sm:inline-block" />
              Vouchers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-8 mb-8 pb-8">
              <EventForm
                formik={formik}
                isEdit={true}
                initialProvinceId={event.city?.provinceId}
              />

              <div className="flex items-center gap-4 justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={formik.isSubmitting}
                  className="min-w-45">
                  {formik.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />{' '}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Event Details
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="tickets" className="mt-0">
            <div className="space-y-8 pb-8">
              <TicketTypeManager
                ticketTypes={ticketTypes}
                isLoading={isTicketLoading}
                onAdd={addTicketType}
                onUpdate={updateTicketType}
                onDelete={deleteTicketType}
              />
            </div>
          </TabsContent>

          <TabsContent value="vouchers" className="mt-0">
            <div className="space-y-8 pb-8">
              <VoucherList
                vouchers={event.eventVouchers ?? event.vouchers ?? []}
                onCreateClick={() => setIsVoucherModalOpen(true)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        formik={voucherFormik}
        isLoading={voucherFormik.isSubmitting}
      />

      {dialog}
    </div>
  );
}
