import { useRef, useState } from 'react';
import { AtSign, User, Phone, Building2, MapPin, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import useEditProfileForm from '@/features/profile/hooks/useEditProfileForm';
import type { ProfileData } from '@/features/profile/types';

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

type EditProfileFormProps = {
  profile: ProfileData;
  onSuccess: () => void;
};

export default function EditProfileForm({
  profile,
  onSuccess
}: EditProfileFormProps) {
  const { formik, profilePicture, setProfilePicture } = useEditProfileForm({
    profile,
    onSuccess
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.error('Image must be less than 1MB');
      return;
    }

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const isFieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field];

  const displayImageUrl = previewUrl || profile.profilePictureUrl;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                {displayImageUrl && (
                  <AvatarImage src={displayImageUrl} alt={profile.fullName} />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-secondary hover:underline cursor-pointer">
              {profilePicture ? profilePicture.name : 'Change photo'}
            </button>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                placeholder="Enter username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-10"
                aria-invalid={isFieldError('username') ? true : undefined}
              />
            </div>
            {isFieldError('username') && (
              <p className="text-sm text-destructive">
                {formik.errors.username}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-10"
                aria-invalid={isFieldError('fullName') ? true : undefined}
              />
            </div>
            {isFieldError('fullName') && (
              <p className="text-sm text-destructive">
                {formik.errors.fullName}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-10"
                aria-invalid={isFieldError('phoneNumber') ? true : undefined}
              />
            </div>
            {isFieldError('phoneNumber') && (
              <p className="text-sm text-destructive">
                {formik.errors.phoneNumber}
              </p>
            )}
          </div>

          {/* EO Fields */}
          {profile.role === 'EO' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Organizer Details
                  </span>
                </div>
              </div>

              {/* Organizer Name */}
              <div className="space-y-2">
                <Label htmlFor="organizerName">Organizer Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="organizerName"
                    name="organizerName"
                    placeholder="Enter organizer name"
                    value={formik.values.organizerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10"
                    aria-invalid={
                      isFieldError('organizerName') ? true : undefined
                    }
                  />
                </div>
                {isFieldError('organizerName') && (
                  <p className="text-sm text-destructive">
                    {formik.errors.organizerName}
                  </p>
                )}
              </div>

              {/* Company Address */}
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Enter company address"
                    value={formik.values.companyAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10"
                    aria-invalid={
                      isFieldError('companyAddress') ? true : undefined
                    }
                  />
                </div>
                {isFieldError('companyAddress') && (
                  <p className="text-sm text-destructive">
                    {formik.errors.companyAddress}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11"
            size="lg"
            disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
