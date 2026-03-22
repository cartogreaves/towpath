'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/database'

export type FriendWithLocation = Profile & {
  location_lng: number
  location_lat: number
  location_updated_at: string
  heading?: number
  friendship_id: string
}

export function useFriendLocations() {
  const [friends, setFriends] = useState<FriendWithLocation[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get accepted friendships where location sharing is enabled
      const { data: friendships } = await supabase
        .from('friendships')
        .select('id, requester_id, addressee_id')
        .eq('status', 'accepted')
        .eq('share_location', true)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

      if (!friendships?.length) return

      const friendIds = friendships.map(f =>
        f.requester_id === user.id ? f.addressee_id : f.requester_id
      )

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000).toISOString()

      const { data: locations } = await supabase
        .from('boat_locations')
        .select(`
          user_id, heading, updated_at,
          profiles!inner(*)
        `)
        .in('user_id', friendIds)
        .gte('updated_at', sevenDaysAgo)

      // Note: location geometry requires raw SQL — use rpc for production
      // For now return profiles without coordinates (geo data needs rpc)
      setFriends([])
    }

    load()

    // Subscribe to location updates
    const channel = supabase
      .channel('friend-locations')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'boat_locations',
      }, () => load())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { friends }
}
