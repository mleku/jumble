import { SearchBar } from '@/components/SearchBar'
import SearchResult from '@/components/SearchResult'
import { Button } from '@/components/ui/button'
import SecondaryPageLayout from '@/layouts/SecondaryPageLayout'
import { useSecondaryPage } from '@/PageManager'
import { TSearchParams } from '@/types'
import { ChevronLeft } from 'lucide-react'
import { forwardRef, useState } from 'react'

const SearchPage = forwardRef(({ index }: { index?: number }, ref) => {
  const { pop, currentIndex } = useSecondaryPage()
  const [searchParams, setSearchParams] = useState<TSearchParams | null>(null)

  const onSearch = (params: TSearchParams | null) => {
    setSearchParams(params)
  }

  return (
    <SecondaryPageLayout
      ref={ref}
      index={index}
      titlebar={
        <div className="flex items-center gap-1 h-full">
          <Button variant="ghost" size="titlebar-icon" onClick={() => pop()}>
            <ChevronLeft />
          </Button>
          <SearchBar onSearch={onSearch} active={currentIndex === index && !searchParams} />
        </div>
      }
    >
      <SearchResult searchParams={searchParams} />
    </SecondaryPageLayout>
  )
})
SearchPage.displayName = 'SearchPage'
export default SearchPage
