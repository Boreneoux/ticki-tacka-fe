import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import useCategories from '@/features/events/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { EventStatus } from '@/types/enums';
import type { OrganizerEventListParams } from '@/features/events/types';

type EventFiltersProps = {
  filters: OrganizerEventListParams;
  setFilters: (filters: OrganizerEventListParams) => void;
};

export default function EventFilters({
  filters,
  setFilters
}: EventFiltersProps) {
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      setFilters({ ...filters, search: debouncedSearchTerm, page: 1 });
    }
  }, [debouncedSearchTerm, filters, setFilters]);

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value === 'all' ? undefined : (value as EventStatus),
      page: 1
    });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({
      ...filters,
      category: value === 'all' ? undefined : value,
      page: 1
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 h-10 w-full"
        />
      </div>
      <div className="flex gap-4 w-full sm:w-auto">
        <div className="w-full sm:w-40">
          <Select
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {['draft', 'published', 'completed', 'canceled'].map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filters.category || 'all'}
            onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
