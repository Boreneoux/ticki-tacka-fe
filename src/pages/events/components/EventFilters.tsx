import { useCallback } from 'react';
import { Search } from 'lucide-react';

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
};

export default function EventFilters({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    categoryId,
    onCategoryChange,
    categories,
    cityId,
    onCityChange,
    cities,
    isCitiesLoading
}: EventFiltersProps) {
    const handleCategoryChange = useCallback(
        (value: string) => {
            onCategoryChange(value === 'all' ? '' : value);
        },
        [onCategoryChange]
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

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-2 md:p-3"
        >
            <div className="flex flex-col md:flex-row items-center gap-0">
                {/* Search Input */}
                <div className="relative flex-1 min-w-0 md:min-w-[200px] w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#94a3b8] pointer-events-none" />
                    <Input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search events..."
                        className="pl-12 pr-4 h-12 w-full border-0 shadow-none focus-visible:ring-0 text-foreground bg-transparent placeholder:text-[#94a3b8] text-[15px]"
                    />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-[#e2e8f0] self-stretch my-2" />

                {/* Category Select */}
                <Select
                    value={categoryId || 'all'}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="h-12 min-w-[170px] border-0 shadow-none focus-visible:ring-0 text-[15px] text-foreground px-5">
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

                {/* Divider */}
                <div className="hidden md:block w-px bg-[#e2e8f0] self-stretch my-2" />

                {/* City Select */}
                <Select
                    value={cityId || 'all'}
                    onValueChange={handleCityChange}
                >
                    <SelectTrigger className="h-12 min-w-[150px] border-0 shadow-none focus-visible:ring-0 text-[15px] text-foreground px-5">
                        <SelectValue
                            placeholder={
                                isCitiesLoading
                                    ? 'Loading...'
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

                {/* Search Button */}
                <div className="p-1 md:pl-2">
                    <Button
                        type="submit"
                        size="icon"
                        className="h-11 w-11 rounded-xl shrink-0 bg-[#1a3a4a] hover:bg-[#152f3d] text-white"
                    >
                        <Search className="size-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}

