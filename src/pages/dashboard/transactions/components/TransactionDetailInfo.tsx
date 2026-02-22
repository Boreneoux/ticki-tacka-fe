import { User, Mail, Calendar, MapPin, Ticket } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { OrganizerTransactionDetailResponseData } from '@/features/transactions/types';
import TransactionStatusBadge from './TransactionStatusBadge';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

const formatTime = (timeStr: string) => timeStr.slice(0, 5);

type TransactionDetailInfoProps = {
  transaction: OrganizerTransactionDetailResponseData;
};

export default function TransactionDetailInfo({
  transaction
}: TransactionDetailInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Customer Card */}
      <Card className="border-border/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <User className="h-4 w-4" />
            Customer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage
                src={transaction.user?.profilePictureUrl ?? undefined}
                alt={transaction.user?.fullName}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {transaction.user?.fullName?.charAt(0).toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {transaction.user?.fullName ?? '—'}
              </p>
              <p className="text-sm text-muted-foreground">
                @{transaction.user?.username ?? '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{transaction.user?.email ?? '—'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <TransactionStatusBadge status={transaction.paymentStatus} />
          </div>
        </CardContent>
      </Card>

      {/* Event Card */}
      <Card className="border-border/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-primary">
            <Ticket className="h-4 w-4" />
            Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {transaction.event?.eventImages?.[0]?.imageUrl && (
            <img
              src={transaction.event.eventImages[0].imageUrl}
              alt={transaction.event.name}
              className="w-full h-28 object-cover rounded-lg"
            />
          )}

          <p className="font-semibold leading-snug">
            {transaction.event?.name ?? '—'}
          </p>

          {transaction.event?.eventDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                {formatDate(transaction.event.eventDate)}
                {transaction.event.eventTime &&
                  ` · ${formatTime(transaction.event.eventTime)}`}
              </span>
            </div>
          )}

          {transaction.event?.venueName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{transaction.event.venueName}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
