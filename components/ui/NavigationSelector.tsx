'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Waves, ChevronDown, Search, X } from 'lucide-react'
import { useNavigations } from '@/lib/hooks/useNavigations'
import type { Navigation } from '@/lib/hooks/useNavigations'

interface NavigationSelectorProps {
  selectedId?: number | null
  onSelect: (nav: Navigation) => void
}

export function NavigationSelector({ selectedId, onSelect }: NavigationSelectorProps) {
  const { data: navigations = [] } = useNavigations()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = navigations.find(n => n.id === selectedId) ?? null

  const filtered = useMemo(() => {
    if (!query.trim()) return navigations
    const q = query.toLowerCase()
    return navigations.filter(n => n.name.toLowerCase().includes(q))
  }, [navigations, query])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  function handleSelect(nav: Navigation) {
    onSelect(nav)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger pill */}
      <button
        onClick={() => setOpen(o => !o)}
        className="
          flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-full
          bg-bg-surface shadow-md border border-green-100
          text-sm font-sans font-medium text-green-700
          hover:bg-bg-elevated transition-colors
          max-w-[200px]
        "
      >
        <Waves size={14} className="text-water-500 flex-shrink-0" />
        <span className="truncate">
          {selected ? selected.name : 'Choose waterway'}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 text-green-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute top-full mt-2 left-0 w-72
          bg-bg-surface rounded-xl shadow-xl border border-green-100
          overflow-hidden z-50
        ">
          {/* Search */}
          <div className="p-2 border-b border-green-50">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-300" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search waterways..."
                className="
                  w-full h-8 pl-8 pr-7 rounded-md bg-bg-elevated
                  text-sm text-green-700 font-sans placeholder:text-green-300
                  focus:outline-none focus:ring-2 focus:ring-water-500/30
                "
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-300 hover:text-green-500"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-64 overscroll-contain">
            {filtered.length === 0 ? (
              <p className="text-sm text-green-400 text-center py-4">No results</p>
            ) : (
              filtered.map(nav => (
                <button
                  key={nav.id}
                  onClick={() => handleSelect(nav)}
                  className={`
                    w-full text-left px-3 py-2.5 text-sm font-sans
                    transition-colors border-b border-green-50 last:border-0
                    ${nav.id === selectedId
                      ? 'bg-water-500/10 text-water-700 font-medium'
                      : 'text-green-700 hover:bg-bg-elevated'
                    }
                  `}
                >
                  {nav.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
