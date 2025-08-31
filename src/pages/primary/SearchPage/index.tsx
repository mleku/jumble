import NormalFeed from '@/components/NormalFeed'
import Profile from '@/components/Profile'
import { ProfileListBySearch } from '@/components/ProfileListBySearch'
import Relay from '@/components/Relay'
import { BIG_RELAY_URLS, SEARCHABLE_RELAY_URLS } from '@/constants'
import PrimaryPageLayout from '@/layouts/PrimaryPageLayout'
import { forwardRef, useMemo, useState } from 'react'
import { SearchPageTitlebar } from './SearchPageTitlebar'
import TrendingNotes from './TrendingNotes'
import { TSearchParams } from './types'

const SearchPage = forwardRef((_, ref) => {
  const [searchParams, setSearchParams] = useState<TSearchParams | null>(null)

  const content = useMemo(() => {
    if (!searchParams) {
      return <TrendingNotes />
    }
    if (searchParams.type === 'profile') {
      return <Profile id={searchParams.search} />
    }
    if (searchParams.type === 'profiles') {
      return <ProfileListBySearch search={searchParams.search} />
    }
    if (searchParams.type === 'notes') {
      return (
        <NormalFeed
          subRequests={[{ urls: SEARCHABLE_RELAY_URLS, filter: { search: searchParams.search } }]}
        />
      )
    }
    if (searchParams.type === 'hashtag') {
      return (
        <NormalFeed
          subRequests={[{ urls: BIG_RELAY_URLS, filter: { '#t': [searchParams.search] } }]}
        />
      )
    }
    return <Relay url={searchParams.search} />
  }, [searchParams])

  const onSearch = (params: TSearchParams) => {
    setSearchParams(params)
  }

  return (
    <PrimaryPageLayout
      ref={ref}
      pageName="search"
      titlebar={<SearchPageTitlebar onSearch={onSearch} />}
      displayScrollToTopButton
    >
      {content}
    </PrimaryPageLayout>
  )
})
SearchPage.displayName = 'SearchPage'
export default SearchPage
