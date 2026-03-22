'use client'

import {
  Droplets, Anchor, BetweenVerticalStart, Wrench,
  Beer, Calendar, AlertTriangle, Fuel
} from 'lucide-react'
import type { PoiType } from '@/lib/types/database'

type FilterValue = PoiType | 'events' | 'stoppages' | null

interface Chip {
  value: FilterValue
  label: string
  icon: React.ReactNode
}

const chips: Chip[] = [
  { value: 'water_point', label: 'Water', icon: <Droplets size={14} /> },
  { value: 'mooring', label: 'Moorings', icon: <Anchor size={14} /> },
  { value: 'lock', label: 'Locks', icon: <BetweenVerticalStart size={14} /> },
  { value: 'fuel', label: 'Fuel', icon: <Fuel size={14} /> },
  { value: 'pub', label: 'Pubs', icon: <Beer size={14} /> },
  { value: 'events', label: 'Events', icon: <Calendar size={14} /> },
  { value: 'stoppages', label: 'Stoppages', icon: <AlertTriangle size={14} /> },
]

interface FilterChipsProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="chips-scroll flex gap-2 px-4 pb-1">
      {chips.map((chip) => {
        const isActive = active === chip.value
        return (
          <button
            key={chip.value}
            onClick={() => onChange(isActive ? null : chip.value)}
            className={`
              flex-shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full
              text-sm transition-all duration-150 select-none
              ${isActive
                ? 'bg-green-600 text-bg-elevated'
                : 'bg-bg-elevated text-green-500 hover:bg-green-50'
              }
            `}
          >
            {chip.icon}
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
