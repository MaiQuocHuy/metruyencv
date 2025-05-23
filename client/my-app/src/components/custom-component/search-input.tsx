import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  value: string;
  variant?: 'default' | 'minimal' | 'hero';
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      inputClassName,
      iconClassName,
      variant = 'default',
      iconPosition = 'left',
      clearable = true,
      placeholder = 'Search...',
      value,
      onChange,
      onSearch,
      onClear,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      // Handle both the forwarded ref and our local ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      inputRef.current = node;
    };

    // Handle search submission
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
      }
    };

    // Clear the input
    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      if (onClear) {
        onClear();
      }
      // Focus the input after clearing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Determine container styles based on variant
    const containerStyles = cn(
      'relative flex items-center transition-all duration-200',
      {
        // Default variant with border and background
        'bg-background border rounded-md shadow-sm': variant === 'default',
        // Minimal variant with just a bottom border
        'border-b': variant === 'minimal',
        // Hero variant with translucent background for hero sections
        'bg-background/80 backdrop-blur-sm rounded-md border border-border/50':
          variant === 'hero',
        // Focus states
        'ring-2 ring-ring/20': isFocused && variant === 'default',
        'border-primary': isFocused && variant === 'minimal'
      },
      className
    );

    // Input styles
    const inputStyles = cn(
      'flex-1 bg-transparent border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
      {
        // Increased left padding when icon is on the left to prevent text overlap
        'pl-10': iconPosition === 'left',
        'pr-9': iconPosition === 'right' || (clearable && value),
        'px-8 py-2': variant !== 'minimal',
        'py-1': variant === 'minimal',
        'text-white placeholder:text-white/70': variant === 'hero'
      },
      inputClassName
    );

    // Icon styles
    const searchIconStyles = cn(
      'text-muted-foreground h-4 w-4 shrink-0',
      {
        'absolute left-3': iconPosition === 'left',
        'absolute right-3': iconPosition === 'right',
        'text-white/70': variant === 'hero'
      },
      iconClassName
    );

    return (
      <div className={containerStyles}>
        {iconPosition === 'left' && <Search className={searchIconStyles} />}

        <input
          ref={combinedRef}
          type="text"
          className={inputStyles}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {clearable && value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className={cn(
              'absolute right-1 h-6 w-6 rounded-full p-0 opacity-70 hover:opacity-100',
              variant === 'hero' && 'text-white hover:bg-white/20'
            )}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}

        {iconPosition === 'right' && <Search className={searchIconStyles} />}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
