'use client'

import { useState } from 'react'
import { Calendar, Navigation, Share2, Users } from 'lucide-react'
import { Button } from './Button'
import { AccountGate } from './AccountGate'
import type { Event } from '@/lib/types/database'

interface EventCardProps {
  event: Event & { rsvp_count?: number; user_has_rsvpd?: boolean }
  isLoggedIn?: boolean
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventCard({ event, isLoggedIn = false }: EventCardProps) {
  const [showGate, setShowGate] = useState(false)
  const [rsvpd, setRsvpd] = useState(event.user_has_rsvpd ?? false)

  function handleRsvp() {
    if (!isLoggedIn) {
      setShowGate(true)
      return
    }
    setRsvpd(!rsvpd)
    // TODO: server action
  }

  return (
    <>
      <div className="bg-bg-surface border border-green-100 rounded-lg p-4 shadow-card">
        {/* Date chip */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex flex-col items-center justify-center">
            <span className="text-xs text-green-400 leading-none uppercase tracking-wide">
              {new Date(event.starts_at).toLocaleDateString('en-GB', { month: 'short' })}
            </span>
            <span className="text-h3 font-bold text-green-800 leading-tight">
              {new Date(event.starts_at).getDate()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-h2 text-green-800 font-bold leading-tight">
              {event.title}
            </h3>
            {event.location_name && (
              <p className="text-sm text-green-400 mt-0.5 truncate">{event.location_name}</p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-green-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={13} strokeWidth={1.5} />
            {formatTime(event.starts_at)}
            {event.ends_at && ` – ${formatTime(event.ends_at)}`}
          </span>
          {event.rsvp_count !== undefined && (
            <span className="flex items-center gap-1">
              <Users size={13} strokeWidth={1.5} />
              {event.rsvp_count} going
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-body text-green-600 mb-3 line-clamp-2">{event.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={rsvpd ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleRsvp}
            className="flex-1"
          >
            {rsvpd ? 'Going ✓' : `RSVP${!isLoggedIn ? ' *' : ''}`}
          </Button>
          <Button variant="secondary" size="sm">
            <Navigation size={14} />
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 size={14} />
          </Button>
        </div>
      </div>

      {showGate && (
        <AccountGate action="rsvp" onClose={() => setShowGate(false)} />
      )}
    </>
  )
}
