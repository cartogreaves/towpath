'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateBoatLocation(
  lat: number,
  lng: number,
  heading?: number,
  accuracy?: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.rpc('update_boat_location', {
    p_lat: lat,
    p_lng: lng,
    p_heading: heading ?? null,
    p_accuracy: accuracy ?? null,
  })

  if (error) return { error: error.message }
  return { success: true }
}
