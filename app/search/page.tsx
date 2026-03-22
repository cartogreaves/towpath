'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { BottomNav } from '@/components/ui/BottomNav'
import { StatusDot } from '@/components/ui/StatusBadge'
import { useProfile } from '@/lib/hooks/useProfile'
import {
  Droplets, Anchor, BetweenVerticalStart, Beer,
  Store, Wrench, RotateCcw, Search, Waves
} from 'lucide-react'
import type { POIWithStatus, PoiType } from '@/lib/types/database'

const POI_ICONS: Partial<Record<PoiType, React.ReactNode>> = {
  water_point: <Droplets size={16} strokeWidth={1.5} className="text-water-500" />,
  mooring: <Anchor size={16} strokeWidth={1.5} className="text-green-600" />,
  lock: <BetweenVerticalStart size={16} strokeWidth={1.5} className="text-earth-500" />,
  winding_hole: <RotateCcw size={16} strokeWidth={1.5} className="text-earth-300" />,
  pub: <Beer size={16} strokeWidth={1.5} className="text-rust-500" />,
  waste_services: <Waves size={16} strokeWidth={1.5} className="text-green-400" />,
  shop: <Store size={16} strokeWidth={1.5} className="text-green-500" />,
  boatyard: <Wrench size={16} strokeWidth={1.5} className="text-earth-700" />,
  fuel: <Wrench size={16} strokeWidth={1.5} className="text-earth-700" />,
}

export default function SearchPage() {
  const { isLoggedIn } = useProfile()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<POIWithStatus[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    setLoading(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('pois')
      .select('id, name, type, canal_id, mile_marker, metadata')
      .ilike('name', `%${q}%`)
      .limit(20)

    // Flatten to POIWithStatus shape (no geo coords from REST)
    const mapped = (data ?? []).map((p: { id: string; name: string; type: PoiType; canal_id: string | null; mile_marker: number | null; metadata: Record<string, unknown> }) => ({
      ...p,
      lng: 0,
      lat: 0,
      current_status: null,
      report_count: 0,
      latest_report: null,
    })) as POIWithStatus[]

    setResults(mapped)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="bg-green-800 px-4 pt-safe pb-4">
        <div className="pt-4">
          <h1 className="font-display text-h1 text-bg-elevated font-bold mb-3">Search</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300" />
            <input
              type="search"
              placeholder="Search the cut..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              autoFocus
              className="
                w-full h-11 pl-9 pr-4 bg-bg-surface border border-transparent rounded-lg
                text-green-700 font-sans text-body placeholder:text-green-300
                focus:outline-none focus:border-water-500
              "
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {loading && (
          <p className="text-sm text-green-400 py-4 text-center">Searching...</p>
        )}

        {!loading && results.length === 0 && query.length >= 2 && (
          <p className="text-sm text-green-400 py-4 text-center">
            No results for &quot;{query}&quot;
          </p>
        )}

        {!loading && results.length === 0 && query.length < 2 && (
          <div className="py-8 text-center">
            <Search size={32} className="text-green-300 mx-auto mb-3" />
            <p className="text-body text-green-400">
              Search canals, services, pubs, locks...
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-bg-surface border border-green-100 rounded-lg overflow-hidden">
            {results.map((poi, i) => (
              <button
                key={poi.id}
                onClick={() => router.push(`/?poi=${poi.id}`)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left
                  hover:bg-bg-elevated transition-colors
                  ${i < results.length - 1 ? 'border-b border-green-50' : ''}
                `}
              >
                <span className="flex-shrink-0">
                  {POI_ICONS[poi.type] ?? <Store size={16} className="text-green-400" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-green-700 truncate">{poi.name}</p>
                  <p className="text-sm text-green-400 capitalize">
                    {poi.type.replace(/_/g, ' ')}
                  </p>
                </div>
                <StatusDot status={poi.current_status} />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
