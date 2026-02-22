import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Calendar,
  Eye,
  Clock,
  MapPin,
  SendHorizonal,
  Ban,
  Tag
} from 'lucide-react';
import type { Event } from '@/types/models';
import type { EventStatus } from '@/types/enums';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

type EventsTableProps = {
  events: Event[];
  isLoading: boolean;
  onPublish: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
};

const STATUS_LEFT_BORDER: Record<EventStatus, string> = {
  published: 'border-l-4 border-l-green-500',
  draft: 'border-l-4 border-l-secondary',
  canceled: 'border-l-4 border-l-destructive',
  completed: 'border-l-4 border-l-primary'
};

const getStatusBadgeVariant = (status: EventStatus) => {
  switch (status) {
    case 'published':
      return 'success';
    case 'draft':
      return 'secondary';
    case 'canceled':
      return 'destructive';
    case 'completed':
      return 'default';
    default:
      return 'outline';
  }
};

const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-muted shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-muted rounded w-2/5" />
      <div className="h-3 bg-muted rounded w-3/5" />
    </div>
    <div className="hidden sm:flex gap-2">
      <div className="h-7 w-7 bg-muted rounded-md" />
      <div className="h-7 w-7 bg-muted rounded-md" />
    </div>
  </div>
);

export default function EventsTable({
  events,
  isLoading,
  onPublish,
  onCancel,
  onDelete
}: EventsTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-14 bg-muted/20 rounded-xl border border-dashed border-border/60">
        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h3 className="text-sm font-semibold text-foreground mb-1">
          No Events Found
        </h3>
        <p className="text-xs text-muted-foreground">
          Try adjusting your search or filters, or create a new event.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      {/* Table Header — desktop only */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_auto] items-center px-4 py-2 bg-muted/40 border-b border-border/50">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Event
        </span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right pr-1">
          Actions
        </span>
      </div>

      <ul className="divide-y divide-border/40">
        {events.map(event => (
          <li
            key={event.id}
            className={`flex items-start sm:items-center gap-3 px-3 py-2.5 bg-card hover:bg-muted/20 transition-colors group ${STATUS_LEFT_BORDER[event.status] ?? ''}`}>
            {/* Thumbnail */}
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0 ring-1 ring-border/40">
              {event.eventImages && event.eventImages.length > 0 ? (
                <img
                  src={event.eventImages[0].imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Calendar className="h-4 w-4 opacity-40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Name + status badge */}
              <div className="flex items-center gap-2 mb-0.5">
                <p
                  className="text-sm font-semibold text-foreground truncate leading-snug"
                  title={event.name}>
                  {event.name}
                </p>
                <Badge
                  variant={getStatusBadgeVariant(event.status)}
                  className="shrink-0 text-[10px] px-1.5 py-0">
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 shrink-0" />
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 shrink-0" />
                  {event.eventTime.includes('T')
                    ? new Date(event.eventTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : event.eventTime}
                </span>
                <span
                  className="flex items-center gap-1 truncate max-w-40"
                  title={event.venueName}>
                  <MapPin className="h-3 w-3 shrink-0" />
                  {event.venueName}
                </span>
                {event.category?.name && (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Tag className="h-3 w-3 shrink-0" />
                    {event.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                title="View Event"
                onClick={() => navigate(`/events/${event.slug || event.id}`)}>
                <Eye className="h-3.5 w-3.5" />
              </Button>

              {event.status !== 'canceled' && event.status !== 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                  title="Edit Event"
                  onClick={() =>
                    navigate(`/dashboard/events/${event.slug}/edit`)
                  }>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}

              {event.status === 'draft' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-secondary"
                  title="Publish Event"
                  onClick={() => onPublish(event.id)}>
                  <SendHorizonal className="h-3.5 w-3.5" />
                </Button>
              )}

              {event.status === 'published' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-warning"
                  title="Cancel Event"
                  onClick={() => onCancel(event.id)}>
                  <Ban className="h-3.5 w-3.5" />
                </Button>
              )}

              {event.status === 'draft' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  title="Delete Event"
                  onClick={() => onDelete(event.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
