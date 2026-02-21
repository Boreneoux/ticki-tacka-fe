import * as React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

import Input from './Input';
import Button from './Button';
import { cn } from './Utils';
import { useDebounce } from '@/hooks/useDebounce';

type SearchInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  showClearButton?: boolean;
  className?: string;
};

export default function SearchInput({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  isLoading = false,
  showClearButton = true,
  className
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(
    controlledValue || ''
  );

  const isControlled = controlledValue !== undefined;
  const displayValue = isControlled ? controlledValue : internalValue;
  const debouncedValue = useDebounce(displayValue, debounceMs);

  // Trigger onSearch when debounced value changes
  React.useEffect(() => {
    if (onSearch && debouncedValue !== undefined) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [isControlled, onChange]
  );

  const handleClear = React.useCallback(() => {
    if (isControlled) {
      onChange?.('');
    } else {
      setInternalValue('');
    }

    onSearch?.('');
  }, [isControlled, onChange, onSearch]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(displayValue);
      }
    },
    [onSearch, displayValue]
  );

  return (
    <div data-slot="search-input" className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-9 pr-20"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {isLoading && (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {showClearButton && displayValue && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleClear}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export type { SearchInputProps };
