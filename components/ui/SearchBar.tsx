'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onSubmit?: (query: string) => void
  onFilterClick?: () => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  onSubmit,
  onFilterClick,
  placeholder = 'Search the cut...',
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setValue(q)
    onSearch?.(q)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit?.(value)
    }
  }

  function handleClear() {
    setValue('')
    onSearch?.('')
    onSubmit?.('')
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
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          flex-1 bg-transparent text-green-700 font-sans text-body
          placeholder:text-green-300 focus:outline-none
        "
      />
      {value && (
        <button
          onClick={handleClear}
          className="text-green-300 hover:text-green-500 transition-colors p-1 -mr-1"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
      {onFilterClick && !value && (
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
