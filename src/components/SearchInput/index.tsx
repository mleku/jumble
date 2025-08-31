import { cn } from '@/lib/utils'
import { SearchIcon, X } from 'lucide-react'
import { ComponentProps, forwardRef, useEffect, useState } from 'react'

const SearchInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ value, onChange, className, ...props }, ref) => {
    const [displayClear, setDisplayClear] = useState(false)

    useEffect(() => {
      setDisplayClear(!!value)
    }, [value])

    return (
      <div
        tabIndex={0}
        className={cn(
          'flex h-9 w-full items-center rounded-md border border-input bg-transparent px-2 py-1 text-base shadow-sm transition-colors md:text-sm [&:has(:focus-visible)]:ring-ring [&:has(:focus-visible)]:ring-1 [&:has(:focus-visible)]:outline-none',
          className
        )}
      >
        <SearchIcon className="size-4 shrink-0 opacity-50" />
        <input
          {...props}
          ref={ref}
          value={value}
          onChange={onChange}
          className="size-full mx-2 border-none bg-transparent focus:outline-none placeholder:text-muted-foreground"
        />
        {displayClear && (
          <button type="button" onClick={() => onChange?.({ target: { value: '' } } as any)}>
            <X className="size-4 shrink-0 opacity-50 hover:opacity-100" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'
export default SearchInput
