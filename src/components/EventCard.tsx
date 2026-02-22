import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

import type { Event } from '@/types/models';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type EventCardProps = {
  event: Event;
  index?: number;
};

function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const navigate = useNavigate();

  const lowestPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : (event.lowestPrice ?? 0);
  const eventImage =
    event.eventImages?.[0]?.imageUrl ?? event.images?.[0] ?? '';

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/events/${event.slug}`)}>
      {/* Event Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-muted">
        {eventImage ? (
          <img
            src={eventImage}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-secondary/20">
            <Calendar className="h-12 w-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Category Badge */}
        {event.category && (
          <Badge className="absolute top-3 left-3 shadow-md">
            {event.category.name}
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        {/* Event Name */}
        <h3 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        {/* Date */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2 shrink-0" />
          <span>
            {new Date(event.eventDate).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate">
            {event.venueName}
            {event.city && `, ${event.city.name}`}
          </span>
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="font-bold text-lg text-primary">
            {formatPrice(lowestPrice)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export type { EventCardProps };
