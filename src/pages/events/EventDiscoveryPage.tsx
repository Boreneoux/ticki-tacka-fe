import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import useEvents from '@/features/events/hooks/useEvents';
import useCategories from '@/features/events/hooks/useCategories';
import { useProvinces, useCities } from '@/features/events/hooks/useLocations';
import { useDebounce } from '@/hooks/useDebounce';

import EventCard from '@/components/EventCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
} from '@/components/ui/Pagination';

import EventFilters from './components/EventFilters';

const ITEMS_PER_PAGE = 12;

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

function generatePaginationRange(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [1];

    if (current > 3) {
        pages.push('ellipsis');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push('ellipsis');
    }

    pages.push(total);

    return pages;
}

export default function EventDiscoveryPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read URL state
    const searchQuery = searchParams.get('search') || '';
    const categoryId = searchParams.get('category') || '';
    const provinceId = searchParams.get('province') || '';
    const cityId = searchParams.get('city') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    // Local search state for controlled input
    const [searchInput, setSearchInput] = useState(searchQuery);

    // Debounce — but don't use debounce for URL syncing,
    // SearchInput component already handles the debounce internally
    const debouncedSearch = useDebounce(searchInput, 400);

    // Data hooks
    const { categories } = useCategories();
    const { provinces } = useProvinces();
    const { cities, isLoading: isCitiesLoading } = useCities(
        provinceId || undefined
    );
    const { events, pagination, isLoading } = useEvents({
        search: debouncedSearch || undefined,
        category: categoryId || undefined,
        city: cityId || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE
    });

    // URL state updater — preserves other params and resets page to 1 on filter change
    const updateParams = useCallback(
        (updates: Record<string, string>, resetPage = true) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                Object.entries(updates).forEach(([key, value]) => {
                    if (value) {
                        newParams.set(key, value);
                    } else {
                        newParams.delete(key);
                    }
                });
                if (resetPage && !updates.page) {
                    newParams.delete('page');
                }
                return newParams;
            });
        },
        [setSearchParams]
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchInput(value);
        },
        []
    );

    const handleSearchSubmit = useCallback(
        (value: string) => {
            updateParams({ search: value });
        },
        [updateParams]
    );

    const handleCategoryChange = useCallback(
        (value: string) => {
            updateParams({ category: value });
        },
        [updateParams]
    );

    const handleProvinceChange = useCallback(
        (value: string) => {
            updateParams({ province: value, city: '' });
        },
        [updateParams]
    );

    const handleCityChange = useCallback(
        (value: string) => {
            updateParams({ city: value });
        },
        [updateParams]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            updateParams({ page: page.toString() }, false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [updateParams]
    );

    const totalPages = pagination?.totalPages ?? 1;
    const totalItems = pagination?.totalItems ?? 0;

    const hasActiveFilters = searchQuery || categoryId || provinceId || cityId;

    const handleClearFilters = useCallback(() => {
        setSearchInput('');
        setSearchParams({});
    }, [setSearchParams]);

    return (
        <div className="min-h-[80vh]">
            {/* Jumbotron Header */}
            <section className="relative overflow-hidden pb-16 md:pb-20" style={{ background: 'linear-gradient(135deg, #0077B6 0%, #00A8E8 40%, #38BDF8 100%)' }}>
                {/* Confetti/Particle Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 10% 15%, white 1.5px, transparent 1.5px),
                            radial-gradient(circle at 85% 25%, white 1px, transparent 1px),
                            radial-gradient(circle at 40% 8%, white 2px, transparent 2px),
                            radial-gradient(circle at 72% 42%, white 1px, transparent 1px),
                            radial-gradient(circle at 20% 55%, white 1.5px, transparent 1.5px),
                            radial-gradient(circle at 92% 58%, white 2px, transparent 2px),
                            radial-gradient(circle at 55% 30%, white 1px, transparent 1px),
                            radial-gradient(circle at 30% 80%, white 1.5px, transparent 1.5px),
                            radial-gradient(circle at 65% 70%, white 2px, transparent 2px),
                            radial-gradient(circle at 80% 85%, white 1px, transparent 1px),
                            radial-gradient(circle at 15% 40%, white 1px, transparent 1px),
                            radial-gradient(circle at 50% 60%, white 1.5px, transparent 1.5px)
                        `,
                        backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px, 140px 140px, 100px 100px, 130px 130px, 170px 170px, 110px 110px, 190px 190px, 145px 145px'
                    }}
                    aria-hidden="true"
                />

                {/* Soft light overlay for depth */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent" aria-hidden="true" />

                {/* Content */}
                <div className="container mx-auto px-4 pt-12 md:pt-16 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
                        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white mb-4 tracking-tight leading-[1.1] drop-shadow-sm">
                            Discover Amazing Events
                        </h1>
                        <p className="text-base md:text-lg text-white/85 font-normal max-w-xl mx-auto leading-relaxed">
                            Find and book tickets for concerts, sports, theater, and more
                        </p>
                    </div>

                    {/* Filter Card — overlaps into next section */}
                    <div className="max-w-4xl mx-auto">
                        <EventFilters
                            searchValue={searchInput}
                            onSearchChange={handleSearchChange}
                            onSearchSubmit={handleSearchSubmit}
                            isSearchLoading={isLoading}
                            categoryId={categoryId}
                            onCategoryChange={handleCategoryChange}
                            categories={categories}
                            provinceId={provinceId}
                            onProvinceChange={handleProvinceChange}
                            provinces={provinces}
                            cityId={cityId}
                            onCityChange={handleCityChange}
                            cities={cities}
                            isCitiesLoading={isCitiesLoading}
                        />
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="container mx-auto px-4 py-8 md:py-12">
                {/* Results count */}
                {!isLoading && (
                    <p className="text-sm text-muted-foreground mb-6">
                        {totalItems} {totalItems === 1 ? 'event' : 'events'} found
                        {searchQuery && (
                            <span>
                                {' '}
                                for "<span className="font-medium text-foreground">{searchQuery}</span>"
                            </span>
                        )}
                    </p>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && events.length === 0 && (
                    <EmptyState
                        icon="search"
                        title="No events found"
                        description={
                            hasActiveFilters
                                ? 'Try adjusting your filters or search query'
                                : 'There are no published events at the moment. Check back later!'
                        }
                        action={
                            hasActiveFilters
                                ? { label: 'Clear Filters', onClick: handleClearFilters }
                                : undefined
                        }
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                aria-disabled={currentPage === 1}
                                                className={
                                                    currentPage === 1
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            />
                                        </PaginationItem>

                                        {generatePaginationRange(currentPage, totalPages).map(
                                            (page, idx) =>
                                                page === 'ellipsis' ? (
                                                    <PaginationItem key={`ellipsis-${idx}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                ) : (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            isActive={page === currentPage}
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                aria-disabled={currentPage === totalPages}
                                                className={
                                                    currentPage === totalPages
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
