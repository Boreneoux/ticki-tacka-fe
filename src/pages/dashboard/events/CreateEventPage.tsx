import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Ticket,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  Loader2,
  GripVertical
} from 'lucide-react';

import useCategories from '@/features/events/hooks/useCategories';
import { useProvinces, useCities } from '@/features/events/hooks/useLocations';
import { createEventApi } from '@/features/events/api/events.api';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Label from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type TicketTypeRow = {
  name: string;
  description: string;
  price: string;
  quota: string;
};

const emptyTicket = (): TicketTypeRow => ({
  name: '',
  description: '',
  price: '0',
  quota: '1'
});

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { provinces } = useProvinces();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [description, setDescription] = useState('');
  const [ticketTypes, setTicketTypes] = useState<TicketTypeRow[]>([emptyTicket()]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const { cities } = useCities(provinceId || undefined);

  const handleProvinceChange = (value: string) => {
    setProvinceId(value);
    setCityId('');
  };

  const addImage = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(fileList)) {
      if (images.length + newFiles.length >= MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds 1 MB limit`);
        continue;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported format (JPG, PNG, WebP)`);
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    const [movedImg] = newImages.splice(dragIndex, 1);
    const [movedPreview] = newPreviews.splice(dragIndex, 1);

    newImages.splice(index, 0, movedImg);
    newPreviews.splice(index, 0, movedPreview);

    setImages(newImages);
    setImagePreviews(newPreviews);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const updateTicket = (index: number, field: keyof TicketTypeRow, value: string) => {
    setTicketTypes(prev =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const addTicketRow = () => {
    if (ticketTypes.length >= 5) {
      toast.error('Maximum 5 ticket types allowed');
      return;
    }
    setTicketTypes(prev => [...prev, emptyTicket()]);
  };

  const removeTicketRow = (index: number) => {
    if (ticketTypes.length <= 1) {
      toast.error('At least one ticket type is required');
      return;
    }
    setTicketTypes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) { toast.error('Event name is required'); return; }
    if (!categoryId) { toast.error('Category is required'); return; }
    if (!eventDate) { toast.error('Event date is required'); return; }
    if (!eventTime) { toast.error('Event time is required'); return; }
    if (!cityId) { toast.error('City is required'); return; }
    if (!venueName.trim()) { toast.error('Venue name is required'); return; }
    if (!venueAddress.trim()) { toast.error('Venue address is required'); return; }
    if (!description.trim() || description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }
    if (images.length === 0) {
      toast.error('Please upload at least one event image');
      return;
    }

    for (const ticket of ticketTypes) {
      if (!ticket.name.trim()) {
        toast.error('All ticket types must have a name');
        return;
      }
      if (Number(ticket.quota) < 1) {
        toast.error('Ticket quota must be at least 1');
        return;
      }
      if (Number(ticket.price) < 0) {
        toast.error('Ticket price cannot be negative');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await createEventApi({
        name: name.trim(),
        categoryId,
        eventDate: new Date(eventDate).toISOString(),
        eventTime,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        endTime: endTime || undefined,
        cityId,
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        description: description.trim(),
        ticketTypes: ticketTypes.map(t => ({
          name: t.name.trim(),
          description: t.description.trim() || undefined,
          price: Number(t.price),
          quota: Number(t.quota)
        })),
        images
      });

      toast.success('Event created successfully!');
      navigate(`/events/${result.slug}`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to create event'
        : 'Failed to create event';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details below to create your event. You can upload up to {MAX_IMAGES} images.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Event Images
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload up to {MAX_IMAGES} images (JPG, PNG, WebP · max 1 MB each). The first image will be the cover. Drag to reorder.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${dragIndex === index
                          ? 'border-primary opacity-50 scale-95'
                          : index === 0
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}>
                      <img
                        src={preview}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable="false"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                      {index === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                          COVER
                        </span>
                      )}

                      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ))}

                  {images.length < MAX_IMAGES && (
                    <label className="relative aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={e => { addImage(e.target.files); e.target.value = ''; }}
                        className="sr-only"
                      />
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Add Image
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {images.length}/{MAX_IMAGES}
                      </span>
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name *</Label>
                  <Input
                    id="event-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jakarta Music Festival 2026"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="event-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Description *</Label>
                  <Textarea
                    id="event-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Tell attendees about your event..."
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Date &amp; Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Start Date *</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Start Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="event-time"
                        type="time"
                        value={eventTime}
                        onChange={e => setEventTime(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date (optional)</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time (optional)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-province">Province *</Label>
                    <Select value={provinceId} onValueChange={handleProvinceChange}>
                      <SelectTrigger id="event-province">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map(prov => (
                          <SelectItem key={prov.id} value={prov.id}>
                            {prov.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-city">City *</Label>
                    <Select
                      value={cityId}
                      onValueChange={setCityId}
                      disabled={!provinceId}>
                      <SelectTrigger id="event-city">
                        <SelectValue placeholder={provinceId ? 'Select city' : 'Select province first'} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue-name">Venue Name *</Label>
                  <Input
                    id="venue-name"
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    placeholder="e.g. Gelora Bung Karno Stadium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue-address">Venue Address *</Label>
                  <Textarea
                    id="venue-address"
                    value={venueAddress}
                    onChange={e => setVenueAddress(e.target.value)}
                    placeholder="Full address..."
                    rows={2}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    Ticket Types
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addTicketRow}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        Ticket #{index + 1}
                      </span>
                      {ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketRow(index)}
                          className="h-7 w-7 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          value={ticket.name}
                          onChange={e => updateTicket(index, 'name', e.target.value)}
                          placeholder="e.g. Regular, VIP"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={ticket.description}
                          onChange={e => updateTicket(index, 'description', e.target.value)}
                          placeholder="Optional description"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price (IDR) *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={ticket.price}
                          onChange={e => updateTicket(index, 'price', e.target.value)}
                          placeholder="0 = Free"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quota *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={ticket.quota}
                          onChange={e => updateTicket(index, 'quota', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center gap-4 justify-end pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="min-w-[180px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
