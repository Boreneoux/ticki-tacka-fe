import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import type { Event } from '@/types/models';
import EventCard from '@/components/EventCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

type RecentEventsSectionProps = {
    events: Event[];
    isLoading: boolean;
};

function EventCardSkeleton() {
    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-3 border-t border-border">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
        </div>
    );
}

export default function RecentEventsSection({
    events,
    isLoading
}: RecentEventsSectionProps) {
    return (
        <section className="container mx-auto px-4 py-12 md:py-16">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1">
                        Latest Events
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Check out the latest events
                    </p>
                </div>
                <Link
                    to="/events"
                    className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    View all
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && events.length === 0 && (
                <EmptyState
                    icon="inbox"
                    title="No events yet"
                    description="Be the first to discover amazing events! Check back soon."
                    variant="card"
                />
            )}

            {/* Event Grid */}
            {!isLoading && events.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))}
                    </div>

                    {/* Mobile "View all" link */}
                    <div className="mt-8 text-center sm:hidden">
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            View all events
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
}
