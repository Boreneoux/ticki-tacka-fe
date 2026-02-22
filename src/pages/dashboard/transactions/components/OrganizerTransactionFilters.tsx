import { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import type { TransactionStatus } from '@/types/enums';
import type { Event } from '@/types/models';
import { getOrganizerEventsApi } from '@/features/events/api/organizer-events.api';

const STATUS_OPTIONS: { value: TransactionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'waiting_for_payment', label: 'Awaiting Payment' },
  { value: 'waiting_for_admin_confirmation', label: 'Awaiting Confirmation' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'expired', label: 'Expired' },
  { value: 'rejected', label: 'Rejected' }
];

type OrganizerTransactionFiltersProps = {
  selectedStatus: TransactionStatus | 'all';
  selectedEventId: string;
  onStatusChange: (status: TransactionStatus | 'all') => void;
  onEventChange: (eventId: string) => void;
};

export default function OrganizerTransactionFilters({
  selectedStatus,
  selectedEventId,
  onStatusChange,
  onEventChange
}: OrganizerTransactionFiltersProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrganizerEventsApi({ limit: 100 });
        setEvents(data.events);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // silently skip — filter will just show no event options
        }
      }
    })();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 flex-1">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select
          value={selectedStatus}
          onValueChange={val =>
            onStatusChange(val as TransactionStatus | 'all')
          }>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Select
        value={selectedEventId || 'all'}
        onValueChange={val => onEventChange(val === 'all' ? '' : val)}>
        <SelectTrigger className="w-full sm:w-60">
          <SelectValue placeholder="Filter by event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {events.map(event => (
            <SelectItem key={event.id} value={event.id}>
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
