'use client'

import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { MapContext } from '@/app/(map)/MapContext'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/types/database'

export type EventWithMeta = Event & { rsvp_count: number }

async function fetchEvents(): Promise<EventWithMeta[]> {
  const supabase = createClient()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('events')
    .select('*, event_rsvps(count)')
    .gte('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(50)

  return ((data ?? []) as (Event & { event_rsvps: { count: number }[] })[]).map(e => ({
    ...e,
    rsvp_count: e.event_rsvps?.[0]?.count ?? 0,
  }))
}

export function useEvents() {
  const { bounds } = useContext(MapContext)

  return useQuery<EventWithMeta[]>({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!bounds,
    staleTime: 60_000,
    placeholderData: [],
  })
}
