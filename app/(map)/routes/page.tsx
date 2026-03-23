'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMapContext } from '../MapContext'
import { useProfile } from '@/lib/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { AccountGate } from '@/components/ui/AccountGate'
import { Route, Plus, BookOpen, Lock } from 'lucide-react'
import type { SavedRoute } from '@/lib/types/database'

const PACE_LABELS: Record<string, string> = {
  relaxed: 'Relaxed',
  steady: 'Steady',
  pushing: 'Pushing',
}

export default function RoutesPage() {
  const { setSnap } = useMapContext()
  const { profile, isLoggedIn } = useProfile()
  const [showGate, setShowGate] = useState(false)

  useEffect(() => { setSnap('half') }, [setSnap])

  const { data: routes = [] } = useQuery<SavedRoute[]>({
    queryKey: ['saved_routes', profile?.id],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('saved_routes')
        .select('*')
        .order('updated_at', { ascending: false })
      return (data ?? []) as SavedRoute[]
    },
    enabled: !!profile?.id,
    staleTime: 30_000,
  })

  return (
    <div className="px-4 pb-4">
      <div className="flex justify-end mb-3">
        {isLoggedIn ? (
          <Link href="/routes/new">
            <Button size="sm">
              <Plus size={14} />
              Plan route
            </Button>
          </Link>
        ) : (
          <Button size="sm" onClick={() => setShowGate(true)}>
            <Plus size={14} />
            Plan route
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {!isLoggedIn ? (
          <div className="bg-bg-elevated rounded-lg p-5 text-center border border-green-100">
            <Route size={32} className="text-green-300 mx-auto mb-3" />
            <p className="font-display text-h2 text-green-800 font-bold mb-2">
              Plan your journey
            </p>
            <p className="text-body text-green-400 mb-4">
              Save routes with day-by-day breakdowns, lock counts, and pace settings.
            </p>
            <Button onClick={() => setShowGate(true)} className="w-full">
              Create account to plan routes
            </Button>
          </div>
        ) : routes.length === 0 ? (
          <div className="py-8 text-center">
            <Route size={32} className="text-green-300 mx-auto mb-3" />
            <p className="font-display text-h2 text-green-800 mb-2">No saved routes</p>
            <p className="text-body text-green-400">Plan your first route</p>
          </div>
        ) : (
          routes.map((route) => (
            <div
              key={route.id}
              className="bg-bg-surface border border-green-100 rounded-lg p-4 shadow-card"
            >
              <h3 className="font-display text-h2 text-green-800 font-bold mb-2">
                {route.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-green-400 mb-3">
                {route.total_miles && <span>{route.total_miles} mi</span>}
                {route.total_locks && (
                  <span className="flex items-center gap-1">
                    <Lock size={12} /> {route.total_locks} locks
                  </span>
                )}
                {route.estimated_days && <span>~{route.estimated_days} days</span>}
                <span className="ml-auto capitalize">{PACE_LABELS[route.pace]}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View on map
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <BookOpen size={14} />
                  Breakdown
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showGate && <AccountGate action="save_route" onClose={() => setShowGate(false)} />}
    </div>
  )
}
