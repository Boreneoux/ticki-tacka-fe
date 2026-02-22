import type { AttendeeItem } from '@/features/dashboard/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';

type Props = {
  attendee: AttendeeItem;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

export default function AttendeeCard({ attendee }: Props) {
  return (
    <div className="rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-sm p-4 space-y-3">
      {/* User header */}
      <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
          {attendee.user.profilePictureUrl && (
            <AvatarImage
              src={attendee.user.profilePictureUrl}
              alt={attendee.user.fullName}
            />
          )}
          <AvatarFallback className="text-sm bg-primary/10 text-primary">
            {getInitials(attendee.user.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">
            {attendee.user.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {attendee.user.email}
          </p>
        </div>
        <div className="ml-auto font-semibold text-primary text-sm shrink-0">
          {formatCurrency(attendee.totalPaid)}
        </div>
      </div>

      {/* Invoice & date */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="font-mono">{attendee.invoiceNumber}</span>
        <span>
          {new Date(attendee.purchasedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Tickets */}
      <div className="flex flex-wrap gap-1.5">
        {attendee.ticketDetails.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {t.quantity}× {t.ticketType}
          </span>
        ))}
      </div>
    </div>
  );
}
