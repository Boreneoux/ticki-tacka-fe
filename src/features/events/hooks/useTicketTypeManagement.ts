import { useState, useCallback, useEffect } from 'react';
import {
  createTicketTypeApi,
  updateTicketTypeApi,
  deleteTicketTypeApi
} from '../api/organizer-events.api';
import type { TicketType } from '@/types/models';
import type {
  CreateTicketTypePayload,
  UpdateTicketTypePayload
} from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

export function useTicketTypeManagement(
  eventId: string,
  initialTickets: TicketType[] = []
) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialTickets && initialTickets.length > 0) {
      setTicketTypes(initialTickets);
    }
  }, [initialTickets]);

  const addTicketType = useCallback(
    async (payload: CreateTicketTypePayload) => {
      setIsLoading(true);
      try {
        const newTicket = await createTicketTypeApi(eventId, payload);
        setTicketTypes(prev => [...prev, newTicket]);
        toast.success('Ticket type added successfully');
        return newTicket;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Failed to add ticket type'
          );
        } else {
          toast.error('An unexpected error occurred');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  const updateTicketType = useCallback(
    async (ticketTypeId: string, payload: UpdateTicketTypePayload) => {
      setIsLoading(true);
      try {
        const updatedTicket = await updateTicketTypeApi(
          eventId,
          ticketTypeId,
          payload
        );
        setTicketTypes(prev =>
          prev.map(t => (t.id === ticketTypeId ? updatedTicket : t))
        );
        toast.success('Ticket type updated successfully');
        return updatedTicket;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Failed to update ticket type'
          );
        } else {
          toast.error('An unexpected error occurred');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  const deleteTicketType = useCallback(
    async (ticketTypeId: string) => {
      setIsLoading(true);
      try {
        await deleteTicketTypeApi(eventId, ticketTypeId);
        setTicketTypes(prev => prev.filter(t => t.id !== ticketTypeId));
        toast.success('Ticket type deleted successfully');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Failed to delete ticket type'
          );
        } else {
          toast.error('An unexpected error occurred');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  return {
    ticketTypes,
    setTicketTypes, // Allow sync with fetched detail if needed
    addTicketType,
    updateTicketType,
    deleteTicketType,
    isLoading
  };
}
