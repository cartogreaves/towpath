'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types/database'

async function fetchProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return (data as Profile) ?? null
}

export function useProfile() {
  const queryClient = useQueryClient()

  // Invalidate on auth state changes (sign in / sign out)
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    })
    return () => subscription.unsubscribe()
  }, [queryClient])

  const { data: profile, isLoading } = useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 60_000,
  })

  return { profile: profile ?? null, isLoading, isLoggedIn: !!profile }
}
