'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BottomNav } from '@/components/ui/BottomNav'
import { useProfile } from '@/lib/hooks/useProfile'
import {
  BetweenVerticalStart, RotateCcw, Waves, ArrowLeftRight, Milestone, AlertTriangle,
  Navigation, Search
} from 'lucide-react'
import type { InfrastructurePoint } from '@/lib/hooks/useCanalInfrastructure'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  lock:          <BetweenVerticalStart size={16} strokeWidth={1.5} />,
  winding_hole:  <RotateCcw size={16} strokeWidth={1.5} />,
  bridge:        <ArrowLeftRight size={16} strokeWidth={1.5} />,
  aqueduct:      <Waves size={16} strokeWidth={1.5} />,
  tunnel_portal: <Milestone size={16} strokeWidth={1.5} />,
  weir:          <AlertTriangle size={16} strokeWidth={1.5} />,
}

const TYPE_LABELS: Record<string, string> = {
  lock: 'Lock', winding_hole: 'Winding hole', bridge: 'Bridge',
  aqueduct: 'Aqueduct', tunnel_portal: 'Tunnel portal', weir: 'Weir',
  culvert: 'Culvert', reservoir: 'Reservoir', wharf: 'Wharf',
}

export default function SearchPage() {
  useProfile() // keep auth state warm
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<InfrastructurePoint[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    setLoading(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('canal_infrastructure')
      .select('id, sap_description, type, waterway_name')
      .ilike('sap_description', `%${q}%`)
      .limit(20)

    setResults(
      (data ?? []).map((r) => ({
        id: r.id,
        sap_description: r.sap_description ?? '',
        type: r.type ?? '',
        waterway_name: r.waterway_name ?? '',
        lng: 0,
        lat: 0,
      }))
    )
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
              Search locks, bridges, aqueducts, tunnels...
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-bg-surface border border-green-100 rounded-lg overflow-hidden">
            {results.map((pt, i) => (
              <div
                key={pt.id}
                className={`
                  flex items-center gap-3 px-4 py-3
                  ${i < results.length - 1 ? 'border-b border-green-50' : ''}
                `}
              >
                <span className="flex-shrink-0 text-green-400">
                  {TYPE_ICONS[pt.type] ?? <Navigation size={16} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-green-700 truncate">{pt.sap_description}</p>
                  <p className="text-sm text-green-400">
                    {TYPE_LABELS[pt.type] ?? pt.type.replace(/_/g, ' ')}
                    {pt.waterway_name ? ` · ${pt.waterway_name}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
