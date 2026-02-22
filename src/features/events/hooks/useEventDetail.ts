import { useState, useEffect, useCallback } from 'react';

import type { Event, TicketType } from '@/types/models';
import { getEventBySlugApi, getTicketTypesApi } from '../api/events.api';

type UseEventDetailReturn = {
  event: Event | null;
  ticketTypes: TicketType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * `availableQuota` is a computed field not stored in the database.
 * Older endpoints may omit it, so we derive it from `quota - soldCount`
 * as a safety measure whenever it is absent or zero while soldCount < quota.
 */
function normalizeTickets(tickets: TicketType[]): TicketType[] {
  return tickets.map(ticket => ({
    ...ticket,
    availableQuota:
      ticket.availableQuota != null && ticket.availableQuota > 0
        ? ticket.availableQuota
        : Math.max(0, ticket.quota - ticket.soldCount)
  }));
}

export default function useEventDetail(
  slug: string | undefined
): UseEventDetailReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      setError('Event not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const eventData = await getEventBySlugApi(slug);
      setEvent(eventData);

      if (eventData?.id) {
        try {
          const tickets = await getTicketTypesApi(eventData.id);
          setTicketTypes(normalizeTickets(tickets));
        } catch {
          setTicketTypes(normalizeTickets(eventData.ticketTypes ?? []));
        }
      }
    } catch {
      setError('Failed to load event details');
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { event, ticketTypes, isLoading, error, refetch: fetchData };
}
