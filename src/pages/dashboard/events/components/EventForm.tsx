import React, { useState } from 'react';
import { FormikProps } from 'formik';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

import useCategories from '@/features/events/hooks/useCategories';
import { useProvinces, useCities } from '@/features/events/hooks/useLocations';
import type { EventFormValues } from '@/features/events/types';

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

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type EventFormProps = {
  formik: FormikProps<EventFormValues>;
  isEdit?: boolean;
  initialProvinceId?: string;
};

export default function EventForm({
  formik,
  isEdit = false,
  initialProvinceId
}: EventFormProps) {
  const { categories } = useCategories();
  const [provinceId, setProvinceId] = useState(initialProvinceId || '');

  const { provinces } = useProvinces();
  const { cities } = useCities(provinceId || undefined);

  React.useEffect(() => {
    if (initialProvinceId && !provinceId) {
      setProvinceId(initialProvinceId);
    }
  }, [initialProvinceId, provinceId]);

  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  React.useEffect(() => {
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const addImage = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    const totalImages =
      formik.values.images.length + (formik.values.existingImages?.length || 0);

    for (const file of Array.from(fileList)) {
      if (totalImages + newFiles.length >= MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds 1 MB limit`);
        continue;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(
          `"${file.name}" is not a supported format (JPG, PNG, WebP)`
        );
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    formik.setFieldValue('images', [...formik.values.images, ...newFiles]);
    setNewImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index: number) => {
    const arr = [...(formik.values.existingImages || [])];
    arr.splice(index, 1);
    formik.setFieldValue('existingImages', arr);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);

    const arr = [...formik.values.images];
    arr.splice(index, 1);
    formik.setFieldValue('images', arr);

    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleProvinceChange = (value: string) => {
    setProvinceId(value);
    formik.setFieldValue('cityId', '');
  };

  return (
    <div className="space-y-8">
      {/* Image Upload */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Event Images
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload up to {MAX_IMAGES} images (JPG, PNG, WebP · max 1 MB each).
            The first image will be the cover.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Existing Images (Edit Only) */}
            {formik.values.existingImages?.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="group relative aspect-square rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all">
                <img
                  src={url}
                  alt={`Existing event image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* New Images */}
            {newImagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  index === 0 && !formik.values.existingImages?.length
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}>
                <img
                  src={preview}
                  alt={`New event image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                {index === 0 && !formik.values.existingImages?.length && (
                  <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    COVER
                  </span>
                )}

                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {formik.values.images.length +
              (formik.values.existingImages?.length || 0) <
              MAX_IMAGES && (
              <label className="relative aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={e => {
                    addImage(e.target.files);
                    e.target.value = '';
                  }}
                  className="sr-only"
                />
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Add Image
                </span>
              </label>
            )}
          </div>
          {formik.submitCount > 0 &&
            formik.values.images.length === 0 &&
            (!formik.values.existingImages ||
              formik.values.existingImages.length === 0) && (
              <p className="text-sm font-medium text-destructive mt-1">
                Please upload at least one image
              </p>
            )}
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              {...formik.getFieldProps('name')}
              placeholder="e.g. Jakarta Music Festival 2026"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm font-medium text-destructive mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              key={`cat-${categories.length}`}
              value={formik.values.categoryId || undefined}
              onValueChange={val => formik.setFieldValue('categoryId', val)}>
              <SelectTrigger id="categoryId">
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
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-sm font-medium text-destructive mt-1">
                {formik.errors.categoryId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...formik.getFieldProps('description')}
              placeholder="Tell attendees about your event..."
              rows={5}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm font-medium text-destructive mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Date &amp; Time
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Start Date *</Label>
              <Input
                id="eventDate"
                type="date"
                {...formik.getFieldProps('eventDate')}
              />
              {formik.touched.eventDate && formik.errors.eventDate && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formik.errors.eventDate as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Start Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="eventTime"
                  type="time"
                  {...formik.getFieldProps('eventTime')}
                  className="pl-10"
                />
              </div>
              {formik.touched.eventTime && formik.errors.eventTime && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formik.errors.eventTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (optional)</Label>
              <Input
                id="endDate"
                type="date"
                {...formik.getFieldProps('endDate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time (optional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  {...formik.getFieldProps('endTime')}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provinceId">Province *</Label>
              <Select
                key={`prov-${provinces.length}`}
                value={provinceId || undefined}
                onValueChange={handleProvinceChange}>
                <SelectTrigger id="provinceId">
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
              <Label htmlFor="cityId">City *</Label>
              <Select
                key={`city-${cities.length}-${provinceId}`}
                value={formik.values.cityId || undefined}
                onValueChange={val => formik.setFieldValue('cityId', val)}
                disabled={!provinceId && !isEdit}>
                <SelectTrigger id="cityId">
                  <SelectValue
                    placeholder={
                      provinceId || isEdit
                        ? 'Select city'
                        : 'Select province first'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.cityId && formik.errors.cityId && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formik.errors.cityId}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueName">Venue Name *</Label>
            <Input
              id="venueName"
              {...formik.getFieldProps('venueName')}
              placeholder="e.g. Gelora Bung Karno Stadium"
            />
            {formik.touched.venueName && formik.errors.venueName && (
              <p className="text-sm font-medium text-destructive mt-1">
                {formik.errors.venueName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueAddress">Venue Address *</Label>
            <Textarea
              id="venueAddress"
              {...formik.getFieldProps('venueAddress')}
              placeholder="Full address..."
              rows={2}
            />
            {formik.touched.venueAddress && formik.errors.venueAddress && (
              <p className="text-sm font-medium text-destructive mt-1">
                {formik.errors.venueAddress}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
