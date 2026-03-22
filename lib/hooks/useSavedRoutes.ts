'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { SavedRouteWithGeojson } from '@/lib/types/database'

async function fetchSavedRoutes(): Promise<SavedRouteWithGeojson[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase.rpc('get_saved_routes_geojson')
  if (error) throw error
  return (data ?? []) as SavedRouteWithGeojson[]
}

export function useSavedRoutes(options: { enabled?: boolean } = {}) {
  return useQuery<SavedRouteWithGeojson[]>({
    queryKey: ['saved_routes'],
    queryFn: fetchSavedRoutes,
    enabled: options.enabled ?? true,
    staleTime: 60_000,
  })
}
