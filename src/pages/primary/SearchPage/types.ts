export type TSearchType = 'profile' | 'profiles' | 'notes' | 'hashtag' | 'relay'

export type TSearchParams = {
  type: TSearchType
  search: string
}
