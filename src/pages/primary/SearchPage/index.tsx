import { SearchBar } from '@/components/SearchBar'
import SearchResult from '@/components/SearchResult'
import PrimaryPageLayout from '@/layouts/PrimaryPageLayout'
import { usePrimaryPage } from '@/PageManager'
import { TSearchParams } from '@/types'
import { forwardRef, useState } from 'react'

const SearchPage = forwardRef((_, ref) => {
  const { current, display } = usePrimaryPage()
  const [searchParams, setSearchParams] = useState<TSearchParams | null>(null)

  const onSearch = (params: TSearchParams | null) => {
    setSearchParams(params)
  }

  return (
    <PrimaryPageLayout
      ref={ref}
      pageName="search"
      titlebar={
        <SearchBar onSearch={onSearch} active={current === 'search' && display && !searchParams} />
      }
      displayScrollToTopButton
    >
      <SearchResult searchParams={searchParams} />
    </PrimaryPageLayout>
  )
})
SearchPage.displayName = 'SearchPage'
export default SearchPage
