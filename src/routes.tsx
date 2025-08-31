import { match } from 'path-to-regexp'
import { isValidElement } from 'react'
import FollowingListPage from './pages/secondary/FollowingListPage'
import GeneralSettingsPage from './pages/secondary/GeneralSettingsPage'
import MuteListPage from './pages/secondary/MuteListPage'
import NoteListPage from './pages/secondary/NoteListPage'
import NotePage from './pages/secondary/NotePage'
import OthersRelaySettingsPage from './pages/secondary/OthersRelaySettingsPage'
import PostSettingsPage from './pages/secondary/PostSettingsPage'
import ProfileEditorPage from './pages/secondary/ProfileEditorPage'
import ProfileListPage from './pages/secondary/ProfileListPage'
import ProfilePage from './pages/secondary/ProfilePage'
import RelayPage from './pages/secondary/RelayPage'
import RelaySettingsPage from './pages/secondary/RelaySettingsPage'
import SearchPage from './pages/secondary/SearchPage'
import SettingsPage from './pages/secondary/SettingsPage'
import TranslationPage from './pages/secondary/TranslationPage'
import WalletPage from './pages/secondary/WalletPage'

const ROUTES = [
  { path: '/notes', element: <NoteListPage /> },
  { path: '/notes/:id', element: <NotePage /> },
  { path: '/users', element: <ProfileListPage /> },
  { path: '/users/:id', element: <ProfilePage /> },
  { path: '/users/:id/following', element: <FollowingListPage /> },
  { path: '/users/:id/relays', element: <OthersRelaySettingsPage /> },
  { path: '/relays/:url', element: <RelayPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/settings/relays', element: <RelaySettingsPage /> },
  { path: '/settings/wallet', element: <WalletPage /> },
  { path: '/settings/posts', element: <PostSettingsPage /> },
  { path: '/settings/general', element: <GeneralSettingsPage /> },
  { path: '/settings/translation', element: <TranslationPage /> },
  { path: '/profile-editor', element: <ProfileEditorPage /> },
  { path: '/mutes', element: <MuteListPage /> }
]

export const routes = ROUTES.map(({ path, element }) => ({
  path,
  element: isValidElement(element) ? element : null,
  matcher: match(path)
}))
