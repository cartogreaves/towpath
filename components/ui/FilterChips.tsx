'use client'

import {
  BetweenVerticalStart, RotateCcw, Waves, ArrowLeftRight, Milestone, AlertTriangle
} from 'lucide-react'
import type { FilterValue } from '@/app/(map)/MapContext'

interface Chip {
  value: FilterValue
  label: string
  icon: React.ReactNode
}

const chips: Chip[] = [
  { value: 'lock',          label: 'Locks',        icon: <BetweenVerticalStart size={14} /> },
  { value: 'winding_hole',  label: 'Winding holes', icon: <RotateCcw size={14} /> },
  { value: 'bridge',        label: 'Bridges',       icon: <ArrowLeftRight size={14} /> },
  { value: 'aqueduct',      label: 'Aqueducts',     icon: <Waves size={14} /> },
  { value: 'tunnel_portal', label: 'Tunnels',       icon: <Milestone size={14} /> },
  { value: 'weir',          label: 'Weirs',         icon: <AlertTriangle size={14} /> },
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
