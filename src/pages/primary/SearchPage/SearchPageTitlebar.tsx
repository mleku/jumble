import Nip05 from '@/components/Nip05'
import SearchInput from '@/components/SearchInput'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/UserAvatar'
import Username from '@/components/Username'
import { useSearchProfiles } from '@/hooks'
import { toNote } from '@/lib/link'
import { normalizeUrl } from '@/lib/url'
import { cn } from '@/lib/utils'
import { usePrimaryPage, useSecondaryPage } from '@/PageManager'
import { TProfile } from '@/types'
import { Hash, Notebook, Server, UserRound } from 'lucide-react'
import { nip19 } from 'nostr-tools'
import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TSearchParams } from './types'

export function SearchPageTitlebar({ onSearch }: { onSearch: (params: TSearchParams) => void }) {
  const { t } = useTranslation()
  const { current, display } = usePrimaryPage()
  const { push } = useSecondaryPage()
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState(input)
  const { profiles } = useSearchProfiles(debouncedInput, 10)
  const [searching, setSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const normalizedUrl = useMemo(() => {
    if (['w', 'ws', 'ws:', 'ws:/', 'wss', 'wss:', 'wss:/'].includes(input)) {
      return undefined
    }
    try {
      return normalizeUrl(input)
    } catch {
      return undefined
    }
  }, [input])

  useEffect(() => {
    if (current === 'search' && display) {
      searchInputRef.current?.focus()
    }
  }, [current, display])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [input])

  const blur = () => {
    setSearching(false)
    searchInputRef.current?.blur()
  }

  const startSearch = () => {
    setSearching(true)
  }

  const list = useMemo(() => {
    const search = input.trim()
    if (!search) return null

    const updateSearch = (params: TSearchParams, newInput?: string) => {
      onSearch(params)
      blur()
      if (newInput) {
        setInput(newInput)
      }
    }

    if (/^[0-9a-f]{64}$/.test(search)) {
      return (
        <>
          <NoteItem
            id={search}
            onClick={() => {
              blur()
              push(toNote(search))
            }}
          />
          <ProfileIdItem id={search} onClick={() => updateSearch({ type: 'profile', search })} />
        </>
      )
    }

    try {
      let id = search
      if (id.startsWith('nostr:')) {
        id = id.slice(6)
      }
      const { type } = nip19.decode(id)
      if (['nprofile', 'npub'].includes(type)) {
        return (
          <ProfileIdItem id={id} onClick={() => updateSearch({ type: 'profile', search: id })} />
        )
      }
      if (['nevent', 'naddr', 'note'].includes(type)) {
        return (
          <NoteItem
            id={id}
            onClick={() => {
              blur()
              push(toNote(id))
            }}
          />
        )
      }
    } catch {
      // ignore
    }

    return (
      <>
        <NormalItem search={search} onClick={() => updateSearch({ type: 'notes', search })} />
        <HashtagItem
          search={search}
          onClick={() => updateSearch({ type: 'hashtag', search }, `#${search}`)}
        />
        {!!normalizedUrl && (
          <RelayItem
            url={normalizedUrl}
            onClick={() => updateSearch({ type: 'relay', search }, normalizedUrl)}
          />
        )}
        {profiles.map((profile) => (
          <ProfileItem
            key={profile.pubkey}
            profile={profile}
            onClick={() =>
              updateSearch({ type: 'profile', search: profile.npub }, profile.username)
            }
          />
        ))}
        {profiles.length >= 10 && (
          <Item onClick={() => updateSearch({ type: 'profiles', search })}>
            <div className="font-semibold">{t('Show more...')}</div>
          </Item>
        )}
      </>
    )
  }, [input, debouncedInput, profiles])

  return (
    <div className="relative flex gap-2 items-center h-full px-3">
      {searching && list && (
        <div
          className={cn(
            'absolute top-full -translate-y-1 inset-x-3 bg-surface-background rounded-b-lg pt-1 shadow-lg',
            searching ? 'z-50' : ''
          )}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ScrollArea className="h-[60vh]">{list}</ScrollArea>
        </div>
      )}
      <SearchInput
        ref={searchInputRef}
        className={cn('bg-surface-background shadow-inner', searching ? 'z-50' : '')}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => startSearch()}
      />
      {searching && <div className="fixed inset-0 w-full h-full" onClick={() => blur()} />}
    </div>
  )
}

function NormalItem({ search, onClick }: { search: string; onClick?: () => void }) {
  return (
    <Item onClick={onClick}>
      <Notebook className="text-muted-foreground" />
      <div className="font-semibold truncate">{search}</div>
    </Item>
  )
}

function HashtagItem({ search, onClick }: { search: string; onClick?: () => void }) {
  const hashtag = search.match(/[\p{L}\p{N}\p{M}]+/u)?.[0].toLowerCase()
  return (
    <Item onClick={onClick}>
      <Hash className="text-muted-foreground" />
      <div className="font-semibold truncate">{hashtag}</div>
    </Item>
  )
}

function NoteItem({ id, onClick }: { id: string; onClick?: () => void }) {
  return (
    <Item onClick={onClick}>
      <Notebook className="text-muted-foreground" />
      <div className="font-semibold truncate">{id}</div>
    </Item>
  )
}

function ProfileIdItem({ id, onClick }: { id: string; onClick?: () => void }) {
  return (
    <Item onClick={onClick}>
      <UserRound className="text-muted-foreground" />
      <div className="font-semibold truncate">{id}</div>
    </Item>
  )
}

function ProfileItem({ profile, onClick }: { profile: TProfile; onClick?: () => void }) {
  return (
    <div className="p-2 hover:bg-accent rounded-md cursor-pointer" onClick={onClick}>
      <div className="flex gap-2 items-center pointer-events-none h-11">
        <UserAvatar userId={profile.pubkey} className="shrink-0" />
        <div className="w-full overflow-hidden">
          <Username
            userId={profile.pubkey}
            className="font-semibold truncate max-w-full w-fit"
            skeletonClassName="h-4"
          />
          <Nip05 pubkey={profile.pubkey} />
        </div>
      </div>
    </div>
  )
}

function RelayItem({ url, onClick }: { url: string; onClick?: () => void }) {
  return (
    <Item onClick={onClick}>
      <Server className="text-muted-foreground" />
      <div className="font-semibold truncate">{url}</div>
    </Item>
  )
}

function Item({ className, children, onClick, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex gap-2 items-center p-2 hover:bg-accent rounded-md cursor-pointer',
        className
      )}
      onClick={(e) => {
        console.log('click')
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </div>
  )
}
