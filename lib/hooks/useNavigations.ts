'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Navigation {
  id: number
  name: string
  min_lng: number
  min_lat: number
  max_lng: number
  max_lat: number
  center_lng: number
  center_lat: number
}

export function useNavigations() {
  return useQuery<Navigation[]>({
    queryKey: ['navigations'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('navigations')
        .select('*')
        .order('name')
      if (error) throw error
      return (data as Navigation[]) ?? []
    },
    staleTime: Infinity, // static reference data
  })
}
