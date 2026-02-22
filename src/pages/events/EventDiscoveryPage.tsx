import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, TrendingUp } from 'lucide-react';

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
        <div className="rounded-2xl border border-[#05668d]/10 overflow-hidden bg-white/60 backdrop-blur-sm">
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-3 border-t border-[#05668d]/10">
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

    const searchQuery = searchParams.get('search') || '';
    const categoryId = searchParams.get('category') || '';
    const provinceId = searchParams.get('province') || '';
    const cityId = searchParams.get('city') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const [searchInput, setSearchInput] = useState(searchQuery);

    const debouncedSearch = useDebounce(searchInput, 400);

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

    const hasActiveFilters = !!(searchQuery || categoryId || provinceId || cityId);

    const handleClearFilters = useCallback(() => {
        setSearchInput('');
        setSearchParams({});
    }, [setSearchParams]);

    return (
        <div className="min-h-[80vh] bg-gradient-to-b from-[#f0f9ff] via-white to-[#f8fafc]">
            {/* Hero Header */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #05668d 0%, #028090 30%, #00a8e8 60%, #38BDF8 100%)'
                    }}
                />

                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 50%, white 1.5px, transparent 1.5px),
                            radial-gradient(circle at 80% 30%, white 2px, transparent 2px),
                            radial-gradient(circle at 50% 80%, white 1px, transparent 1px),
                            radial-gradient(circle at 10% 20%, white 2px, transparent 2px),
                            radial-gradient(circle at 90% 70%, white 1.5px, transparent 1.5px),
                            radial-gradient(circle at 40% 10%, white 1px, transparent 1px)
                        `,
                        backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px, 140px 140px'
                    }}
                    aria-hidden="true"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f0f9ff]" />

                <div className="container mx-auto px-4 pt-10 pb-24 md:pt-14 md:pb-32 relative z-10">
                    <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 mb-5 border border-white/20">
                            <Sparkles className="size-4 text-amber-300" />
                            <span className="text-sm font-medium text-white/90">Discover what's happening near you</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white mb-3 tracking-tight leading-[1.1] drop-shadow-sm">
                            Find Your Next <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">
                                Amazing Experience
                            </span>
                        </h1>
                        <p className="text-sm md:text-base text-white/75 font-normal max-w-md mx-auto leading-relaxed">
                            Browse concerts, festivals, workshops, and more events happening around you
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
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
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="container mx-auto px-4 -mt-6 md:-mt-8 relative z-20 pb-12 md:pb-16">
                {/* Results Header */}
                {!isLoading && (
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-5 text-[#05668d]" />
                            <p className="text-sm md:text-base font-semibold text-foreground">
                                {totalItems} {totalItems === 1 ? 'event' : 'events'} found
                            </p>
                            {searchQuery && (
                                <span className="text-sm text-muted-foreground">
                                    for "<span className="font-medium text-[#05668d]">{searchQuery}</span>"
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading Skeletons */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && events.length === 0 && (
                    <div className="backdrop-blur-sm bg-white/60 rounded-2xl border border-[#05668d]/10 p-8 md:p-12">
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
                    </div>
                )}

                {/* Event Grid */}
                {!isLoading && events.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                            {events.map((event, index) => (
                                <EventCard key={event.id} event={event} index={index} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-10 md:mt-14 flex flex-col items-center gap-4">
                                <Pagination>
                                    <PaginationContent className="gap-1.5">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                aria-disabled={currentPage === 1}
                                                className={`rounded-xl border border-[#05668d]/15 hover:bg-[#05668d]/5 hover:border-[#05668d]/30 transition-all ${currentPage === 1
                                                        ? 'pointer-events-none opacity-40'
                                                        : ''
                                                    }`}
                                            />
                                        </PaginationItem>

                                        {generatePaginationRange(currentPage, totalPages).map(
                                            (page, idx) =>
                                                page === 'ellipsis' ? (
                                                    <PaginationItem key={`ellipsis-${idx}`}>
                                                        <PaginationEllipsis className="text-muted-foreground" />
                                                    </PaginationItem>
                                                ) : (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            isActive={page === currentPage}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`rounded-xl transition-all ${page === currentPage
                                                                    ? 'bg-gradient-to-r from-[#05668d] to-[#028090] text-white border-transparent shadow-md shadow-[#05668d]/20 hover:from-[#04567a] hover:to-[#027080]'
                                                                    : 'border border-[#05668d]/15 hover:bg-[#05668d]/5 hover:border-[#05668d]/30'
                                                                }`}
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
                                                className={`rounded-xl border border-[#05668d]/15 hover:bg-[#05668d]/5 hover:border-[#05668d]/30 transition-all ${currentPage === totalPages
                                                        ? 'pointer-events-none opacity-40'
                                                        : ''
                                                    }`}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>

                                <p className="text-xs text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
