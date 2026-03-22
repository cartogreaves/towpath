'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ServiceStatus } from '@/lib/types/database'

export async function reportStatus(
  poiId: string,
  status: ServiceStatus,
  comment?: string,
  photos?: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('status_reports').insert({
    poi_id: poiId,
    user_id: user.id,
    status,
    comment: comment || null,
    photos: photos?.length ? photos : null,
  })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function confirmReport(reportId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.rpc('confirm_report', {
    p_report_id: reportId,
  })

  if (error) return { error: error.message }
  return { success: true }
}
