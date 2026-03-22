'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CommunityPost } from '@/lib/types/database'

async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      id, author_id, type, title, body, canal_id, visibility,
      is_resolved, created_at, expires_at,
      ST_Y(location::geometry) as lat,
      ST_X(location::geometry) as lng,
      profiles!author_id (handle, boat_name, avatar_url)
    `)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error

  return ((data ?? []) as any[]).map((row) => ({
    id:               row.id,
    author_id:        row.author_id,
    author_handle:    row.profiles?.handle ?? 'unknown',
    author_boat_name: row.profiles?.boat_name ?? null,
    author_avatar_url:row.profiles?.avatar_url ?? null,
    type:             row.type,
    title:            row.title,
    body:             row.body,
    lat:              row.lat ?? null,
    lng:              row.lng ?? null,
    canal_id:         row.canal_id,
    visibility:       row.visibility,
    is_resolved:      row.is_resolved,
    created_at:       row.created_at,
    expires_at:       row.expires_at,
  }))
}

export function useCommunityPosts() {
  return useQuery<CommunityPost[]>({
    queryKey: ['community_posts'],
    queryFn: fetchCommunityPosts,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}
