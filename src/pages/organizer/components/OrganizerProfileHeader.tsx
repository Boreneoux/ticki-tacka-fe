import { Building2, MapPin, CalendarDays, Star } from 'lucide-react';

import type { OrganizerPublicProfile } from '@/features/organizer/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

type OrganizerProfileHeaderProps = {
  profile: OrganizerPublicProfile;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function OrganizerProfileHeader({
  profile
}: OrganizerProfileHeaderProps) {
  const memberYear = new Date(profile.memberSince).getFullYear();

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="h-24 sm:h-32 bg-linear-to-r from-primary to-secondary" />

      {/* Profile info */}
      <div className="px-4 sm:px-8 pb-6">
        {/* Avatar — overlaps the banner */}
        <div className="-mt-10 sm:-mt-12 mb-4 flex items-end justify-between">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-card shadow-lg">
            {profile.profilePictureUrl && (
              <AvatarImage
                src={profile.profilePictureUrl}
                alt={profile.fullName}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-xl sm:text-2xl font-bold">
              {getInitials(profile.organizerName)}
            </AvatarFallback>
          </Avatar>

          <Badge variant="secondary" className="mb-1 text-xs px-3 py-1">
            Event Organizer
          </Badge>
        </div>

        {/* Names */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {profile.organizerName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            @{profile.username} · {profile.fullName}
          </p>
        </div>

        {/* Meta rows */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground mb-5">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0 text-primary/60" />
            <span>{profile.organizerName}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary/60 mt-0.5" />
            <span className="leading-relaxed">{profile.companyAddress}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary/60" />
            <span>Member since {memberYear}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Events */}
          <div className="bg-muted/60 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {profile.stats.eventCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Events</p>
          </div>

          {/* Rating */}
          <div className="bg-muted/60 rounded-xl p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {profile.stats.totalReviews > 0
                  ? profile.stats.averageRating.toFixed(1)
                  : '—'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Avg Rating</p>
          </div>

          {/* Reviews */}
          <div className="bg-muted/60 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {profile.stats.totalReviews}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
