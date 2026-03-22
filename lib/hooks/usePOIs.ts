'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useContext } from 'react'
import { MapContext } from '@/app/(map)/MapContext'
import { createClient } from '@/lib/supabase/client'
import type { POIWithStatus, PoiType } from '@/lib/types/database'

export function usePOIs(typeFilter: PoiType | null = null) {
  const { bounds } = useContext(MapContext)

  return useQuery<POIWithStatus[]>({
    queryKey: ['pois', bounds, typeFilter],
    queryFn: async () => {
      if (!bounds) return []
      const supabase = createClient()
      const { data, error } = await supabase.rpc('pois_in_bbox', {
        p_lng1: bounds.lng1,
        p_lat1: bounds.lat1,
        p_lng2: bounds.lng2,
        p_lat2: bounds.lat2,
        ...(typeFilter ? { p_type: typeFilter } : {}),
      })
      if (error) throw error
      return (data as POIWithStatus[]) ?? []
    },
    enabled: !!bounds,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}
