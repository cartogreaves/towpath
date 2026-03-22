import type { ServiceStatus } from '@/lib/types/database'

interface StatusBadgeProps {
  status: ServiceStatus | null
  compact?: boolean
}

const statusConfig: Record<
  ServiceStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  working: {
    bg: 'bg-water-50',
    text: 'text-water-700',
    dot: 'bg-water-500',
    label: 'Working',
  },
  issue_reported: {
    bg: 'bg-rust-50',
    text: 'text-rust-700',
    dot: 'bg-rust-500',
    label: 'Issue reported',
  },
  closed: {
    bg: 'bg-danger-light',
    text: 'text-danger',
    dot: 'bg-danger',
    label: 'Closed',
  },
  unknown: {
    bg: 'bg-bg-recessed',
    text: 'text-green-400',
    dot: '',
    label: 'No reports',
  },
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const config = status ? statusConfig[status] : statusConfig.unknown
  const resolvedStatus = status ?? 'unknown'
  const cfg = statusConfig[resolvedStatus]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5
        ${cfg.bg} ${cfg.text}
        ${compact ? 'text-xs' : 'text-sm'}
      `}
    >
      {cfg.dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  )
}

// Minimal dot-only version for map overlays
export function StatusDot({ status }: { status: ServiceStatus | null }) {
  if (!status || status === 'unknown') return null

  const dotColour: Record<Exclude<ServiceStatus, 'unknown'>, string> = {
    working: 'bg-water-500',
    issue_reported: 'bg-rust-500',
    closed: 'bg-danger',
  }

  return (
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColour[status as Exclude<ServiceStatus, 'unknown'>]}`}
    />
  )
}
