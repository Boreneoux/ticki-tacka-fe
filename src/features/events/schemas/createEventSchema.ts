import * as Yup from 'yup';

export const createEventSchema = Yup.object().shape({
  name: Yup.string()
    .required('Event name is required')
    .max(100, 'Event name must be at most 100 characters'),
  categoryId: Yup.string().required('Category is required'),
  eventDate: Yup.date()
    .required('Event date is required')
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      'Event date cannot be in the past'
    ),
  eventTime: Yup.string().required('Event time is required'),
  endDate: Yup.date().nullable(),
  endTime: Yup.string().nullable(),
  cityId: Yup.string().required('City is required'),
  venueName: Yup.string().required('Venue name is required'),
  venueAddress: Yup.string().required('Venue address is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),

  // Images array — backend accepts up to 3 images, max 1 MB each
  images: Yup.array().of(Yup.mixed()).max(3, 'Maximum 3 images allowed'),
  existingImages: Yup.array()
    .of(Yup.string())
    .max(3, 'Maximum 3 images allowed'),

  ticketTypes: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Ticket name is required'),
        description: Yup.string().nullable(),
        price: Yup.number()
          .min(0, 'Price cannot be negative')
          .required('Price is required'),
        quota: Yup.number()
          .min(1, 'Quota must be at least 1')
          .required('Quota is required')
      })
    )
    .min(1, 'At least one ticket type is required')
    .required('Ticket types are required')
});
