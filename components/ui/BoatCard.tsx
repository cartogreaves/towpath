'use client'

import { MessageCircle, MapPin } from 'lucide-react'
import { Avatar } from './Avatar'
import { Button } from './Button'
import type { Profile } from '@/lib/types/database'

interface BoatCardProps {
  profile: Profile & { distance_m?: number; location_updated_at?: string; near?: string }
  onViewOnMap?: () => void
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDistance(m?: number): string {
  if (!m) return ''
  if (m < 1000) return `${Math.round(m)}m away`
  return `${(m / 1609).toFixed(1)}mi away`
}

export function BoatCard({ profile, onViewOnMap }: BoatCardProps) {
  function handleWhatsApp() {
    if (!profile.whatsapp_enabled || !profile.whatsapp_number) return
    window.open(
      `https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent('Hi from Towpath!')}`,
      '_blank'
    )
  }

  return (
    <div className="bg-bg-surface border border-green-100 rounded-lg p-4 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        {/* Boat colour indicator */}
        <div className="relative">
          <Avatar
            src={profile.avatar_url}
            name={profile.boat_name || profile.handle}
            size={40}
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-surface"
            style={{ background: profile.boat_colour }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-body font-bold text-green-800 truncate">
            {profile.boat_name || 'Unnamed boat'}
          </h3>
          <p className="text-sm text-green-400">
            @{profile.handle}
            {profile.distance_m !== undefined && (
              <> · {formatDistance(profile.distance_m)}</>
            )}
          </p>
        </div>
      </div>

      {(profile.near || profile.location_updated_at) && (
        <div className="flex items-center gap-1.5 text-sm text-green-400 mb-3">
          <MapPin size={13} strokeWidth={1.5} />
          {profile.near && <span>{profile.near}</span>}
          {profile.location_updated_at && (
            <span className="ml-auto">{formatTimeAgo(profile.location_updated_at)}</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {profile.whatsapp_enabled ? (
          <Button
            variant="whatsapp"
            size="sm"
            className="flex-1"
            onClick={handleWhatsApp}
          >
            <MessageCircle size={14} />
            WhatsApp
          </Button>
        ) : (
          <Button variant="secondary" size="sm" className="flex-1" disabled>
            <MessageCircle size={14} />
            Messaging off
          </Button>
        )}
        {onViewOnMap && (
          <Button variant="secondary" size="sm" className="flex-1" onClick={onViewOnMap}>
            <MapPin size={14} />
            View on map
          </Button>
        )}
      </div>
    </div>
  )
}
