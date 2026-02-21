import { useCallback } from 'react';

import type { Category, Province, City } from '@/types/models';
import SearchInput from '@/components/ui/SearchInput';
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
    isSearchLoading,
    categoryId,
    onCategoryChange,
    categories,
    provinceId,
    onProvinceChange,
    provinces,
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

    const handleProvinceChange = useCallback(
        (value: string) => {
            onProvinceChange(value === 'all' ? '' : value);
            onCityChange('');
        },
        [onProvinceChange, onCityChange]
    );

    const handleCityChange = useCallback(
        (value: string) => {
            onCityChange(value === 'all' ? '' : value);
        },
        [onCityChange]
    );

    return (
        <div className="space-y-4">
            {/* Search */}
            <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                onSearch={onSearchSubmit}
                placeholder="Search events by name..."
                isLoading={isSearchLoading}
                className="w-full"
            />

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <Select
                    value={categoryId || 'all'}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger>
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

                {/* Province */}
                <Select
                    value={provinceId || 'all'}
                    onValueChange={handleProvinceChange}
                >
                    <SelectTrigger>
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

                {/* City */}
                <Select
                    value={cityId || 'all'}
                    onValueChange={handleCityChange}
                    disabled={!provinceId || isCitiesLoading}
                >
                    <SelectTrigger>
                        <SelectValue
                            placeholder={
                                !provinceId
                                    ? 'Select province first'
                                    : isCitiesLoading
                                        ? 'Loading cities...'
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
    );
}
