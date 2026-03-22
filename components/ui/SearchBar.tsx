'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterClick?: () => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  onFilterClick,
  placeholder = 'Search the cut...',
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div
      className={`
        flex items-center gap-2 h-11 px-3
        bg-bg-surface border border-green-100 rounded-lg shadow-float
        ${className}
      `}
    >
      <Search size={16} className="text-green-300 flex-shrink-0" />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          flex-1 bg-transparent text-green-700 font-sans text-body
          placeholder:text-green-300 focus:outline-none
        "
      />
      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className="text-green-400 hover:text-green-600 transition-colors p-1 -mr-1"
          aria-label="Filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      )}
    </div>
  )
}
