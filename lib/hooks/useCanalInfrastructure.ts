'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useContext } from 'react'
import { MapContext } from '@/app/(map)/MapContext'
import { createClient } from '@/lib/supabase/client'

export interface InfrastructurePoint {
  id: number
  sap_description: string
  type: string
  waterway_name: string
  lng: number
  lat: number
}

export function useCanalInfrastructure(typeFilter: string | null = null) {
  const { bounds } = useContext(MapContext)

  return useQuery<InfrastructurePoint[]>({
    queryKey: ['canal-infrastructure', bounds, typeFilter],
    queryFn: async () => {
      if (!bounds) return []
      const supabase = createClient()
      const { data, error } = await supabase.rpc('infrastructure_in_bbox', {
        p_lng1: bounds.lng1,
        p_lat1: bounds.lat1,
        p_lng2: bounds.lng2,
        p_lat2: bounds.lat2,
        ...(typeFilter ? { p_type: typeFilter } : {}),
      })
      if (error) throw error
      return (data as InfrastructurePoint[]) ?? []
    },
    enabled: !!bounds,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}
