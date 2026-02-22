import { useState } from 'react';
import {
  publishEventApi,
  cancelEventApi,
  deleteEventApi
} from '../api/organizer-events.api';
import toast from 'react-hot-toast';
import axios from 'axios';

export function useEventActions(onSuccess?: () => void) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const publishEvent = async (id: string) => {
    setIsPublishing(true);
    try {
      await publishEventApi(id);
      toast.success('Event published successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to publish event');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const cancelEvent = async (id: string) => {
    setIsCanceling(true);
    try {
      await cancelEventApi(id);
      toast.success('Event canceled successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to cancel event');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsCanceling(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteEventApi(id);
      toast.success('Event deleted successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    publishEvent,
    cancelEvent,
    deleteEvent,
    isPublishing,
    isCanceling,
    isDeleting
  };
}
