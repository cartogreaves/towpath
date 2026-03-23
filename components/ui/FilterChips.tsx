'use client'

import {
  BetweenVerticalStart, RotateCcw, Waves, ArrowLeftRight, Milestone, AlertTriangle,
  GitMerge, Droplets, Anchor, Eye, EyeOff
} from 'lucide-react'
import type { FilterValue } from '@/app/(map)/MapContext'

interface Chip {
  value: FilterValue
  label: string
  icon: React.ReactNode
}

const chips: Chip[] = [
  { value: 'lock',          label: 'Locks',         icon: <BetweenVerticalStart size={14} /> },
  { value: 'winding_hole',  label: 'Winding holes', icon: <RotateCcw size={14} /> },
  { value: 'bridge',        label: 'Bridges',       icon: <ArrowLeftRight size={14} /> },
  { value: 'aqueduct',      label: 'Aqueducts',     icon: <Waves size={14} /> },
  { value: 'tunnel_portal', label: 'Tunnels',       icon: <Milestone size={14} /> },
  { value: 'weir',          label: 'Weirs',         icon: <AlertTriangle size={14} /> },
  { value: 'culvert',       label: 'Culverts',      icon: <GitMerge size={14} /> },
  { value: 'reservoir',     label: 'Reservoirs',    icon: <Droplets size={14} /> },
  { value: 'wharf',         label: 'Wharves',       icon: <Anchor size={14} /> },
]

interface FilterChipsProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
  hiddenTypes: Set<string>
  onToggleType: (type: string) => void
}

export function FilterChips({ active, onChange, hiddenTypes, onToggleType }: FilterChipsProps) {
  return (
    <div className="chips-scroll flex gap-2 px-4 pb-1">
      {chips.map((chip) => {
        const isActive  = active === chip.value
        const isHidden  = hiddenTypes.has(chip.value as string)

        return (
          <div
            key={chip.value}
            className={`
              flex-shrink-0 inline-flex items-center h-8 rounded-full overflow-hidden
              transition-all duration-150 select-none
              ${isHidden
                ? 'bg-bg-elevated opacity-50'
                : isActive
                  ? 'bg-green-600'
                  : 'bg-bg-elevated'
              }
            `}
          >
            {/* Filter toggle */}
            <button
              onClick={() => !isHidden && onChange(isActive ? null : chip.value)}
              disabled={isHidden}
              className={`
                inline-flex items-center gap-1.5 h-full pl-3 pr-2 text-sm
                ${isHidden ? 'cursor-not-allowed text-green-400' : isActive ? 'text-bg-elevated' : 'text-green-500 hover:text-green-700'}
              `}
            >
              {chip.icon}
              {chip.label}
            </button>

            {/* Visibility toggle */}
            <button
              onClick={() => onToggleType(chip.value as string)}
              className={`
                inline-flex items-center justify-center h-full pl-1 pr-2.5
                ${isActive && !isHidden ? 'text-green-200 hover:text-white' : 'text-green-300 hover:text-green-600'}
              `}
              aria-label={isHidden ? `Show ${chip.label}` : `Hide ${chip.label}`}
            >
              {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
            </button>
          </div>
        )
      })}
    </div>
  )
}
