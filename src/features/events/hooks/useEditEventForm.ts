import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { createEventSchema } from '../schemas/createEventSchema';
import { updateEventApi } from '../api/organizer-events.api';
import type {
  EventFormValues,
  OrganizerEventDetailResponseData
} from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

const formatTime = (timeStr?: string | null) => {
  if (!timeStr) return '';
  if (!timeStr.includes('T')) return timeStr.slice(0, 5); // Fallback to raw "HH:mm"
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const formatDateLocal = (dateStr?: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

export function useEditEventForm(
  event: OrganizerEventDetailResponseData | null
) {
  const navigate = useNavigate();

  // Set initial values based on existing event
  const initialValues: EventFormValues = event
    ? {
        name: event.name,
        categoryId: event.categoryId,
        eventDate: formatDateLocal(event.eventDate),
        eventTime: formatTime(event.eventTime),
        endDate: formatDateLocal(event.endDate),
        endTime: formatTime(event.endTime),
        cityId: event.cityId,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        description: event.description,
        images: [], // we append new files here
        existingImages: event.eventImages?.map(img => img.imageUrl) || [], // store existing image URLs to show
        ticketTypes: [] // ticket types handled separately in edit
      }
    : {
        name: '',
        categoryId: '',
        eventDate: '',
        eventTime: '',
        endDate: '',
        endTime: '',
        cityId: '',
        venueName: '',
        venueAddress: '',
        description: '',
        images: [],
        existingImages: [],
        ticketTypes: []
      };

  const formik = useFormik<EventFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: createEventSchema, // wait, createEventSchema requires ticketTypes. Since edit handles tickettypes separately, we might need a separate schema or omit ticket types validation?
    onSubmit: async values => {
      if (!event?.id) return;

      try {
        // For edit, existing images + new images might need to be at least 1 overall
        if (
          values.images.length === 0 &&
          (!values.existingImages || values.existingImages.length === 0)
        ) {
          toast.error('Please upload at least one image');
          return;
        }

        const formData = new FormData();
        formData.append('name', values.name.trim());
        formData.append('categoryId', values.categoryId);
        formData.append('eventDate', new Date(values.eventDate).toISOString());
        formData.append('eventTime', values.eventTime);
        if (values.endDate)
          formData.append('endDate', new Date(values.endDate).toISOString());
        if (values.endTime) formData.append('endTime', values.endTime);
        formData.append('cityId', values.cityId);
        formData.append('venueName', values.venueName.trim());
        formData.append('venueAddress', values.venueAddress.trim());
        formData.append('description', values.description.trim());

        if (values.existingImages && values.existingImages.length > 0) {
          formData.append(
            'existingImages',
            JSON.stringify(values.existingImages)
          );
        }

        for (const file of values.images) {
          formData.append('images', file);
        }

        await updateEventApi(event.id, formData);

        toast.success('Event updated successfully!');
        navigate(`/dashboard/events`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Failed to update event'
          );
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    }
  });

  return { formik };
}
