import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  AtSign,
  Copy,
  Check,
  Building2,
  MapPin,
  Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { ProfileData } from '@/features/profile/types';

type ProfileDetailsProps = {
  profile: ProfileData;
};

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  copyable?: boolean;
};

function InfoRow({ icon, label, value, copyable }: InfoRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-b-0">
      <div className="mt-0.5 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5 truncate">
          {value || '—'}
        </p>
      </div>
      {copyable && value && (
        <button
          onClick={handleCopy}
          className="mt-1 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Copy to clipboard">
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <InfoRow
            icon={<AtSign className="h-4 w-4 text-primary" />}
            label="Username"
            value={profile.username}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4 text-primary" />}
            label="Email"
            value={profile.email}
          />
          <InfoRow
            icon={<User className="h-4 w-4 text-primary" />}
            label="Full Name"
            value={profile.fullName}
          />
          <InfoRow
            icon={<Phone className="h-4 w-4 text-primary" />}
            label="Phone Number"
            value={profile.phoneNumber}
          />
          <InfoRow
            icon={<Ticket className="h-4 w-4 text-primary" />}
            label="Referral Code"
            value={profile.referralCode}
            copyable
          />
        </CardContent>
      </Card>

      {/* EO-specific Information */}
      {profile.role === 'EO' && profile.organizer && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Organizer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <InfoRow
              icon={<Building2 className="h-4 w-4 text-primary" />}
              label="Organizer Name"
              value={profile.organizer.organizerName}
            />
            <InfoRow
              icon={<MapPin className="h-4 w-4 text-primary" />}
              label="Company Address"
              value={profile.organizer.companyAddress}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
