'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { BoatLocationWithProfile } from '@/lib/types/database'

async function fetchBoatLocations(): Promise<BoatLocationWithProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_visible_boat_locations')
  if (error) throw error
  return (data ?? []) as BoatLocationWithProfile[]
}

export function useFriendLocations(options: { enabled?: boolean } = {}) {
  return useQuery<BoatLocationWithProfile[]>({
    queryKey: ['boat_locations'],
    queryFn: fetchBoatLocations,
    enabled: options.enabled ?? true,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
