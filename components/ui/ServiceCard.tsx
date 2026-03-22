'use client'

import { useState } from 'react'
import {
  Droplets, Anchor, BetweenVerticalStart, RotateCcw,
  Beer, Waves, Store, Wrench, Calendar,
  Navigation, Flag, ChevronRight
} from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Button } from './Button'
import { AccountGate } from './AccountGate'
import type { POIWithStatus } from '@/lib/types/database'
import type { PoiType, ServiceStatus } from '@/lib/types/database'

const poiIcons: Record<PoiType, { icon: React.ReactNode; colour: string }> = {
  water_point: { icon: <Droplets size={20} strokeWidth={1.5} />, colour: 'text-water-500' },
  mooring: { icon: <Anchor size={20} strokeWidth={1.5} />, colour: 'text-green-600' },
  lock: { icon: <BetweenVerticalStart size={20} strokeWidth={1.5} />, colour: 'text-earth-500' },
  winding_hole: { icon: <RotateCcw size={20} strokeWidth={1.5} />, colour: 'text-earth-300' },
  pub: { icon: <Beer size={20} strokeWidth={1.5} />, colour: 'text-rust-500' },
  waste_services: { icon: <Waves size={20} strokeWidth={1.5} />, colour: 'text-green-400' },
  pump_out: { icon: <Waves size={20} strokeWidth={1.5} />, colour: 'text-green-400' },
  shop: { icon: <Store size={20} strokeWidth={1.5} />, colour: 'text-green-500' },
  boatyard: { icon: <Wrench size={20} strokeWidth={1.5} />, colour: 'text-earth-700' },
  fuel: { icon: <Wrench size={20} strokeWidth={1.5} />, colour: 'text-earth-700' },
  launderette: { icon: <Store size={20} strokeWidth={1.5} />, colour: 'text-green-500' },
  post_office: { icon: <Store size={20} strokeWidth={1.5} />, colour: 'text-green-500' },
}

const poiLabels: Record<PoiType, string> = {
  water_point: 'Water point',
  mooring: 'Mooring',
  lock: 'Lock',
  winding_hole: 'Winding hole',
  waste_services: 'Waste services',
  pump_out: 'Pump out',
  pub: 'Pub / food',
  shop: 'Shop',
  boatyard: 'Boatyard',
  fuel: 'Fuel',
  launderette: 'Launderette',
  post_office: 'Post office',
}

interface ServiceCardProps {
  poi: POIWithStatus
  isLoggedIn?: boolean
  distanceM?: number
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`
  return `${(m / 1609).toFixed(1)}mi`
}

export function ServiceCard({ poi, isLoggedIn = false, distanceM }: ServiceCardProps) {
  const [showGate, setShowGate] = useState(false)
  const { icon, colour } = poiIcons[poi.type] ?? poiIcons.shop
  const label = poiLabels[poi.type] ?? 'Service'

  function handleReport() {
    if (!isLoggedIn) {
      setShowGate(true)
      return
    }
    // TODO: open report form
  }

  return (
    <>
      <div className="bg-bg-surface border border-green-100 rounded-lg p-4 shadow-card">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`mt-0.5 ${colour}`}>{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-green-400 mb-0.5">{label}</p>
            <h3 className="font-display text-h2 text-green-800 font-bold leading-tight truncate">
              {poi.name}
            </h3>
          </div>
          {distanceM !== undefined && (
            <span className="text-sm text-green-300 flex-shrink-0">
              {formatDistance(distanceM)}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={poi.current_status} />
          {poi.report_count > 0 && (
            <span className="text-sm text-green-300">
              · {poi.report_count} report{poi.report_count !== 1 ? 's' : ''}
            </span>
          )}
          {poi.latest_report && (
            <span className="text-sm text-green-300 ml-auto">
              {formatTimeAgo(poi.latest_report)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(
                  `https://maps.google.com/?daddr=${poi.lat},${poi.lng}`,
                  '_blank'
                )
              }
            }}
          >
            <Navigation size={14} />
            Navigate
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleReport}
          >
            <Flag size={14} />
            Report status
            {!isLoggedIn && <span className="text-green-300">*</span>}
          </Button>
        </div>
      </div>

      {showGate && (
        <AccountGate
          action="report"
          onClose={() => setShowGate(false)}
        />
      )}
    </>
  )
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}
