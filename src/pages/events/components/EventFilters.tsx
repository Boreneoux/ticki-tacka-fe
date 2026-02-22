import { useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import type { Category, Province, City } from '@/types/models';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/Select';

type EventFiltersProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (value: string) => void;
    isSearchLoading?: boolean;

    categoryId: string;
    onCategoryChange: (value: string) => void;
    categories: Category[];

    provinceId: string;
    onProvinceChange: (value: string) => void;
    provinces: Province[];

    cityId: string;
    onCityChange: (value: string) => void;
    cities: City[];
    isCitiesLoading?: boolean;

    hasActiveFilters: boolean;
    onClearFilters: () => void;
};

export default function EventFilters({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    categoryId,
    onCategoryChange,
    categories,
    provinceId,
    onProvinceChange,
    provinces,
    cityId,
    onCityChange,
    cities,
    isCitiesLoading,
    hasActiveFilters,
    onClearFilters
}: EventFiltersProps) {
    const handleCategoryChange = useCallback(
        (value: string) => {
            onCategoryChange(value === 'all' ? '' : value);
        },
        [onCategoryChange]
    );

    const handleProvinceChange = useCallback(
        (value: string) => {
            onProvinceChange(value === 'all' ? '' : value);
        },
        [onProvinceChange]
    );

    const handleCityChange = useCallback(
        (value: string) => {
            onCityChange(value === 'all' ? '' : value);
        },
        [onCityChange]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchSubmit(searchValue);
    };

    const activeFilterCount = [categoryId, provinceId, cityId].filter(Boolean).length;

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form
                onSubmit={handleSubmit}
                className="relative backdrop-blur-xl bg-white/90 rounded-2xl shadow-[0_8px_32px_rgba(0,119,182,0.12)] border border-white/60 p-1.5 md:p-2 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,119,182,0.18)]"
            >
                <div className="flex items-center gap-0">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#05668d]/50 pointer-events-none" />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search events, artists, venues..."
                            className="pl-12 pr-4 h-12 md:h-14 w-full border-0 shadow-none focus-visible:ring-0 text-foreground bg-transparent placeholder:text-muted-foreground/60 text-[15px] md:text-base"
                        />
                    </div>
                    <div className="p-1">
                        <Button
                            type="submit"
                            className="h-10 md:h-11 px-5 md:px-7 rounded-xl shrink-0 bg-gradient-to-r from-[#05668d] to-[#028090] hover:from-[#04567a] hover:to-[#027080] text-white font-semibold shadow-lg shadow-[#05668d]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#05668d]/30 hover:-translate-y-px"
                        >
                            <Search className="size-4 md:mr-2" />
                            <span className="hidden md:inline">Search</span>
                        </Button>
                    </div>
                </div>
            </form>

            {/* Filter Row */}
            <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-[0_4px_20px_rgba(0,119,182,0.08)] border border-white/50 p-3 md:p-4 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="size-4 text-[#05668d]" />
                    <span className="text-sm font-semibold text-[#05668d]">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="inline-flex items-center justify-center size-5 rounded-full bg-[#05668d] text-white text-[11px] font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#05668d]/70 hover:text-destructive transition-colors cursor-pointer"
                        >
                            <X className="size-3.5" />
                            Clear all
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Category Select */}
                    <Select
                        value={categoryId || 'all'}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="h-11 border-[#05668d]/15 bg-white/70 shadow-none hover:border-[#05668d]/30 focus:border-[#05668d]/40 focus-visible:ring-[#05668d]/20 text-sm transition-colors rounded-xl px-4">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Province Select */}
                    <Select
                        value={provinceId || 'all'}
                        onValueChange={handleProvinceChange}
                    >
                        <SelectTrigger className="h-11 border-[#05668d]/15 bg-white/70 shadow-none hover:border-[#05668d]/30 focus:border-[#05668d]/40 focus-visible:ring-[#05668d]/20 text-sm transition-colors rounded-xl px-4">
                            <SelectValue placeholder="All Provinces" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Provinces</SelectItem>
                            {provinces.map((prov) => (
                                <SelectItem key={prov.id} value={prov.id}>
                                    {prov.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* City Select */}
                    <Select
                        value={cityId || 'all'}
                        onValueChange={handleCityChange}
                    >
                        <SelectTrigger className="h-11 border-[#05668d]/15 bg-white/70 shadow-none hover:border-[#05668d]/30 focus:border-[#05668d]/40 focus-visible:ring-[#05668d]/20 text-sm transition-colors rounded-xl px-4">
                            <SelectValue
                                placeholder={
                                    isCitiesLoading
                                        ? 'Loading...'
                                        : provinceId
                                            ? 'Select City'
                                            : 'All Cities'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

