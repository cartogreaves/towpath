'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function rsvpEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Toggle — check if already RSVP'd
  const { data: existing } = await supabase
    .from('event_rsvps')
    .select('event_id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    revalidatePath('/events')
    return { success: true, rsvpd: false }
  }

  const { error } = await supabase
    .from('event_rsvps')
    .insert({ event_id: eventId, user_id: user.id })

  if (error) return { error: error.message }
  revalidatePath('/events')
  return { success: true, rsvpd: true }
}
