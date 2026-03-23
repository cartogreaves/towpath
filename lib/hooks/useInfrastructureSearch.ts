'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { InfrastructurePoint } from './useCanalInfrastructure'

export function useInfrastructureSearch(query: string) {
  return useQuery<InfrastructurePoint[]>({
    queryKey: ['infrastructure-search', query.trim()],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('search_infrastructure', {
        p_query: query.trim(),
      })
      if (error) throw error
      return (data ?? []) as InfrastructurePoint[]
    },
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}
