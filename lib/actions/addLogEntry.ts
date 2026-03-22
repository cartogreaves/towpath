'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addLogEntry(entry: {
  date: string
  miles?: number
  locks_worked?: number
  from_location?: string
  to_location?: string
  canal_id?: string
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('cruising_log').insert({
    user_id: user.id,
    date: entry.date,
    miles: entry.miles ?? null,
    locks_worked: entry.locks_worked ?? 0,
    from_location: entry.from_location ?? null,
    to_location: entry.to_location ?? null,
    canal_id: entry.canal_id ?? null,
    notes: entry.notes ?? null,
  })

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}

export async function startMooringTimer(
  lat: number,
  lng: number,
  locationName?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Deactivate existing active timers
  await supabase
    .from('mooring_timers')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('is_active', true)

  const { error } = await supabase.from('mooring_timers').insert({
    user_id: user.id,
    started_at: new Date().toISOString(),
    location: `POINT(${lng} ${lat})`,
    location_name: locationName ?? null,
    is_active: true,
  })

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}
