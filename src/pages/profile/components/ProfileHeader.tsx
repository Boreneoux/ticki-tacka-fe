import { User, Shield, Ticket } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import type { ProfileData } from '@/features/profile/types';

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

type ProfileHeaderProps = {
  profile: ProfileData;
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-accent shadow-xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-white/10" />
      </div>

      <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col items-center text-center md:flex-row md:text-left gap-5">
        {/* Avatar */}
        <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-white/30 shadow-lg">
          {profile.profilePictureUrl && (
            <AvatarImage
              src={profile.profilePictureUrl}
              alt={profile.fullName}
            />
          )}
          <AvatarFallback className="bg-white/20 text-white text-2xl md:text-3xl font-bold">
            {getInitials(profile.fullName)}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {profile.fullName}
          </h1>
          <p className="text-white/80 text-sm md:text-base">{profile.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
              {profile.role === 'EO' ? (
                <Shield className="h-3.5 w-3.5" />
              ) : (
                <User className="h-3.5 w-3.5" />
              )}
              {profile.role === 'EO' ? 'Event Organizer' : 'Customer'}
            </span>
            {profile.role === 'User' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                <Ticket className="h-3.5 w-3.5" />
                {profile.pointBalance.toLocaleString()} Points
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
