import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/Pagination';
import { useConfirmDialog } from '@/components/ui/useConfirmDialog';

import { useOrganizerEvents } from '@/features/events/hooks/useOrganizerEvents';
import { useEventActions } from '@/features/events/hooks/useEventActions';
import EventFilters from './components/EventFilters';
import EventsTable from './components/EventsTable';

export default function DashboardEventsPage() {
  const navigate = useNavigate();
  const { events, pagination, isLoading, refetch, params, setParams } =
    useOrganizerEvents({ page: 1, limit: 10 });
  const { publishEvent, cancelEvent, deleteEvent } = useEventActions(refetch);
  const { confirm, dialog } = useConfirmDialog();

  const handlePublish = async (id: string) => {
    confirm({
      title: 'Publish Event',
      description:
        'Are you sure you want to publish this event? It will be visible to the public.',
      onConfirm: () => publishEvent(id)
    });
  };

  const handleCancel = async (id: string) => {
    confirm({
      title: 'Cancel Event',
      description:
        'Are you sure you want to cancel this event? This action cannot be undone.',
      variant: 'destructive',
      onConfirm: () => cancelEvent(id)
    });
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Delete Event',
      description: 'Are you sure you want to delete this event permanently?',
      variant: 'destructive',
      onConfirm: () => deleteEvent(id)
    });
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage your events, track sales, and connect with attendees.
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/events/create')}
          className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <EventFilters filters={params} setFilters={setParams} />

      <EventsTable
        events={events}
        isLoading={isLoading}
        onPublish={handlePublish}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 cursor-pointer">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.currentPage - 1))
                  }
                  className={
                    pagination.currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === pagination.currentPage}
                    onClick={() => handlePageChange(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        pagination.totalPages,
                        pagination.currentPage + 1
                      )
                    )
                  }
                  className={
                    pagination.currentPage === pagination.totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {dialog}
    </div>
  );
}
