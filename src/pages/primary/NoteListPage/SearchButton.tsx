import { Button } from '@/components/ui/button'
import { usePrimaryPage } from '@/PageManager'
import { Search } from 'lucide-react'

export default function SearchButton() {
  const { navigate } = usePrimaryPage()

  return (
    <Button variant="ghost" size="titlebar-icon" onClick={() => navigate('search')}>
      <Search />
    </Button>
  )
}
