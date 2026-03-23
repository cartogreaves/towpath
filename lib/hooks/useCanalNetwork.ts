'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useContext } from 'react'
import { MapContext } from '@/app/(map)/MapContext'
import { createClient } from '@/lib/supabase/client'

export interface CanalSegment {
  id: number
  name: string
  sapnavstatus: string
  geojson: string
}

export function useCanalNetwork() {
  const { bounds } = useContext(MapContext)

  return useQuery<CanalSegment[]>({
    queryKey: ['canal-network', bounds],
    queryFn: async () => {
      if (!bounds) return []
      const supabase = createClient()
      const { data, error } = await supabase.rpc('canal_network_in_bbox', {
        p_lng1: bounds.lng1,
        p_lat1: bounds.lat1,
        p_lng2: bounds.lng2,
        p_lat2: bounds.lat2,
      })
      if (error) throw error
      return (data as CanalSegment[]) ?? []
    },
    enabled: !!bounds,
    staleTime: 300_000, // 5 min — canal network is static
    placeholderData: keepPreviousData,
  })
}
