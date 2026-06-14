import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, TrendingUp, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const TRENDING_SEARCHES = ['Pizza', 'Sushi', 'Burgers', 'Chinese', 'Indian', 'Thai']

const RECENT_SEARCHES_KEY = 'fooddelivery-recent-searches'

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  const recent = getRecentSearches().filter((s) => s !== query)
  recent.unshift(query)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, 5)))
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const recentSearches = getRecentSearches()
  const showDropdown = isFocused && !query

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        saveRecentSearch(query.trim())
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        inputRef.current?.blur()
      }
    },
    [query, navigate],
  )

  const handleSelect = useCallback(
    (term: string) => {
      saveRecentSearch(term)
      setQuery(term)
      navigate(`/search?q=${encodeURIComponent(term)}`)
      inputRef.current?.blur()
    },
    [navigate],
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for restaurants or cuisines..."
            className={cn(
              'w-full rounded-2xl border bg-white py-4 pl-12 pr-14 text-base text-surface-900 placeholder:text-surface-400',
              'shadow-card transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 focus:shadow-card-hover',
              isFocused ? 'border-brand-300 shadow-card-hover' : 'border-surface-200',
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-brand p-2.5 text-white shadow-glow-brand hover:brightness-110 active:scale-95 transition-all"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-card-hover animate-scale-in">
          {recentSearches.length > 0 && (
            <div className="p-3">
              <p className="mb-2 px-2 text-xs font-medium text-surface-400 uppercase tracking-wider">Recent</p>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelect(term)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                >
                  <Clock className="h-4 w-4 text-surface-300" />
                  {term}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-surface-100 p-3">
            <p className="mb-2 px-2 text-xs font-medium text-surface-400 uppercase tracking-wider">Trending</p>
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleSelect(term)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
              >
                <TrendingUp className="h-4 w-4 text-brand-400" />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
