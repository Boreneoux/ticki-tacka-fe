import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { createEventSchema } from '../schemas/createEventSchema';
import { createEventApi } from '../api/events.api'; // Reuse the existing create event api
import type { EventFormValues } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

export function useCreateEventForm() {
  const navigate = useNavigate();

  const initialValues: EventFormValues = {
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
    ticketTypes: [
      {
        name: '',
        description: '',
        price: 0,
        quota: 1
      }
    ]
  };

  const formik = useFormik<EventFormValues>({
    initialValues,
    validationSchema: createEventSchema,
    onSubmit: async values => {
      try {
        // Ensure there is at least one image
        if (values.images.length === 0) {
          toast.error('Please upload at least one image');
          return;
        }

        // The instruction provided an invalid syntax `await createEventApi(formData);{...}`.
        // Assuming the intent was to remove the `const result =` and pass the object directly,
        // and that `formData` was a placeholder for the actual object being passed.
        // To make it syntactically correct and faithful to the "fix unused result" intent,
        // the `const result =` is removed, and the object is passed directly.
        await createEventApi({
          name: values.name.trim(),
          categoryId: values.categoryId,
          eventDate: new Date(values.eventDate).toISOString(),
          eventTime: values.eventTime,
          endDate: values.endDate
            ? new Date(values.endDate).toISOString()
            : undefined,
          endTime: values.endTime || undefined,
          cityId: values.cityId,
          venueName: values.venueName.trim(),
          venueAddress: values.venueAddress.trim(),
          description: values.description.trim(),
          ticketTypes: values.ticketTypes.map(t => ({
            name: t.name.trim(),
            description: t.description?.trim() || undefined,
            price: Number(t.price),
            quota: Number(t.quota)
          })),
          images: values.images
        });

        toast.success('Event created successfully!');
        navigate(`/dashboard/events`); // Navigate back to my events list instead of public event page
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || 'Failed to create event'
          );
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    }
  });

  return { formik };
}
