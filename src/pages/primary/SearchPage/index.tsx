import { SearchBar } from '@/components/SearchBar'
import SearchResult from '@/components/SearchResult'
import PrimaryPageLayout from '@/layouts/PrimaryPageLayout'
import { TSearchParams } from '@/types'
import { forwardRef, useState } from 'react'

const SearchPage = forwardRef((_, ref) => {
  const [input, setInput] = useState('')
  const [searchParams, setSearchParams] = useState<TSearchParams | null>(null)

  const onSearch = (params: TSearchParams | null) => {
    setSearchParams(params)
    if (params?.input) {
      setInput(params.input)
    }
  }

  return (
    <PrimaryPageLayout
      ref={ref}
      pageName="search"
      titlebar={<SearchBar onSearch={onSearch} input={input} setInput={setInput} />}
      displayScrollToTopButton
    >
      <SearchResult searchParams={searchParams} />
    </PrimaryPageLayout>
  )
})
SearchPage.displayName = 'SearchPage'
export default SearchPage
