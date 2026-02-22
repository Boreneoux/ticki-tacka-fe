import type { AttendeeItem } from '@/features/dashboard/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { formatCurrency } from '@/utils/format';

type Props = {
  attendees: AttendeeItem[];
};

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

export default function AttendeeTable({ attendees }: Props) {
  if (attendees.length === 0) {
    return (
      <div className="rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-lg p-10 text-center text-muted-foreground text-sm">
        No attendees found for this event yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                Attendee
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                Invoice
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                Tickets
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Total Paid
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {attendees.map(attendee => (
              <tr
                key={attendee.transactionId}
                className="hover:bg-muted/30 transition-colors">
                {/* Attendee info */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-8 shrink-0">
                      {attendee.user.profilePictureUrl && (
                        <AvatarImage
                          src={attendee.user.profilePictureUrl}
                          alt={attendee.user.fullName}
                        />
                      )}
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(attendee.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {attendee.user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {attendee.user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Invoice */}
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {attendee.invoiceNumber}
                  </span>
                </td>

                {/* Tickets */}
                <td className="px-5 py-3.5">
                  <div className="space-y-0.5">
                    {attendee.ticketDetails.map((t, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {t.quantity}× {t.ticketType}
                      </p>
                    ))}
                  </div>
                </td>

                {/* Total paid */}
                <td className="px-5 py-3.5 text-right font-semibold text-primary">
                  {formatCurrency(attendee.totalPaid)}
                </td>

                {/* Purchase date */}
                <td className="px-5 py-3.5 text-right text-muted-foreground text-xs">
                  {new Date(attendee.purchasedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
