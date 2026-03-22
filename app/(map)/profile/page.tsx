'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMapContext } from '../MapContext'
import { useProfile } from '@/lib/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  Anchor, BookOpen, Navigation, Clock,
  UserPlus, ChevronRight, Users, Plus
} from 'lucide-react'
import type { MooringTimer, CruisingLogEntry } from '@/lib/types/database'

export default function ProfilePage() {
  const { setSnap } = useMapContext()
  const { profile, isLoading, isLoggedIn } = useProfile()

  useEffect(() => { setSnap('half') }, [setSnap])

  const { data: timer } = useQuery<MooringTimer | null>({
    queryKey: ['mooring_timer', profile?.id],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('mooring_timers')
        .select('*')
        .eq('user_id', profile!.id)
        .eq('is_active', true)
        .single()
      return (data as MooringTimer) ?? null
    },
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  const { data: logEntries = [] } = useQuery<CruisingLogEntry[]>({
    queryKey: ['cruising_log', profile?.id],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('cruising_log')
        .select('*')
        .eq('user_id', profile!.id)
        .order('date', { ascending: false })
        .limit(5)
      return (data ?? []) as CruisingLogEntry[]
    },
    enabled: !!profile?.id,
    staleTime: 60_000,
  })

  if (isLoading) {
    return <div className="py-12 text-center text-green-400">Loading...</div>
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <UserPlus size={24} className="text-green-500" />
        </div>
        <h2 className="font-display text-h1 text-green-800 font-bold mb-1">Your profile</h2>
        <p className="text-body text-green-400 mb-5">
          Sign in to log miles, track your route, and connect with fellow boaters.
        </p>
        <div className="flex gap-3">
          <Link href="/auth/sign-in" className="flex-1">
            <Button className="w-full">Sign in</Button>
          </Link>
          <Link href="/auth/sign-up" className="flex-1">
            <Button variant="secondary" className="w-full">Create account</Button>
          </Link>
        </div>
      </div>
    )
  }

  const daysMoored = timer
    ? Math.floor((Date.now() - new Date(timer.started_at).getTime()) / 86400000)
    : null

  return (
    <div className="pb-4">
      {/* Identity row */}
      <div className="px-4 pb-4 flex items-center gap-3">
        <Avatar
          src={profile.avatar_url}
          name={profile.boat_name || profile.handle}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-h1 text-green-800 font-bold leading-tight truncate">
            {profile.boat_name || 'Unnamed boat'}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-sm text-green-400">@{profile.handle}</p>
            <span
              className="w-2.5 h-2.5 rounded-full border border-green-200"
              style={{ background: profile.boat_colour }}
            />
            <span className="text-xs text-green-300 capitalize">
              {profile.boat_type.replace('_', ' ')}
            </span>
            {profile.is_cc && (
              <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-sm font-medium">
                CC
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-green-100 border-y border-green-100 mb-4">
        {[
          { label: 'Miles', value: profile.total_miles?.toFixed(1) ?? '0' },
          { label: 'Locks', value: profile.total_locks ?? 0 },
          { label: 'Trust', value: profile.trust_score },
        ].map(({ label, value }) => (
          <div key={label} className="bg-bg-surface py-3 text-center">
            <p className="font-display text-h2 text-green-800 font-bold">{value}</p>
            <p className="text-xs text-green-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="px-4 space-y-1 mb-4">
        <div className="bg-bg-surface border border-green-100 rounded-lg overflow-hidden">
          {[
            { label: 'Edit profile', href: '/profile/edit', icon: <ChevronRight size={16} className="text-green-300" /> },
            { label: 'Friends', href: '/friends', icon: <Users size={14} className="text-green-400 mr-1" /> },
            { label: 'Create event', href: '/events/create', icon: <Plus size={14} className="text-green-400 mr-1" /> },
            { label: 'Plan a route', href: '/routes/new', icon: <ChevronRight size={16} className="text-green-300" /> },
          ].map((item, i, arr) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-between px-4 py-3
                hover:bg-bg-elevated transition-colors
                ${i < arr.length - 1 ? 'border-b border-green-50' : ''}
              `}
            >
              <span className="text-body text-green-700">{item.label}</span>
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* 14-day mooring timer */}
      {timer && daysMoored !== null && (
        <div className="px-4 mb-4">
          <div
            className={`rounded-lg p-4 border ${
              daysMoored >= 12 ? 'bg-rust-50 border-rust-500' : 'bg-bg-surface border-green-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock size={15} className={daysMoored >= 12 ? 'text-rust-500' : 'text-green-500'} />
              <h3 className="text-h3 font-semibold text-green-800">14-day timer</h3>
              <span className="ml-auto text-sm text-green-400">
                Day {daysMoored} of 14
              </span>
            </div>
            {timer.location_name && (
              <p className="text-sm text-green-500 mb-2">{timer.location_name}</p>
            )}
            <div className="h-1.5 bg-bg-recessed rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  daysMoored >= 12 ? 'bg-rust-500' : 'bg-water-500'
                }`}
                style={{ width: `${Math.min((daysMoored / 14) * 100, 100)}%` }}
              />
            </div>
            {daysMoored >= 12 && (
              <p className="text-xs text-rust-700 mt-1.5">
                {14 - daysMoored} day{14 - daysMoored !== 1 ? 's' : ''} remaining — time to move on!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cruising log */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-h3 font-semibold text-green-800 flex items-center gap-2">
            <BookOpen size={15} className="text-green-500" />
            Cruising log
          </h3>
          <Link href="/profile/log" className="text-sm text-green-500">
            Add entry
          </Link>
        </div>

        {logEntries.length > 0 ? (
          <div className="bg-bg-surface border border-green-100 rounded-lg overflow-hidden">
            {logEntries.map((entry, i) => (
              <div
                key={entry.id}
                className={`px-4 py-3 flex items-center gap-3 ${
                  i < logEntries.length - 1 ? 'border-b border-green-50' : ''
                }`}
              >
                <div className="flex-shrink-0 text-center w-9">
                  <p className="text-xs text-green-400 leading-none">
                    {new Date(entry.date).toLocaleDateString('en-GB', { month: 'short' })}
                  </p>
                  <p className="text-h3 font-bold text-green-800">
                    {new Date(entry.date).getDate()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  {entry.from_location && entry.to_location && (
                    <p className="text-sm font-medium text-green-700 truncate">
                      {entry.from_location} → {entry.to_location}
                    </p>
                  )}
                  <div className="flex gap-3 text-xs text-green-400 mt-0.5">
                    {entry.miles && <span>{entry.miles} mi</span>}
                    {entry.locks_worked > 0 && (
                      <span className="flex items-center gap-1">
                        <Anchor size={10} /> {entry.locks_worked} locks
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-bg-surface border border-green-100 rounded-lg p-5 text-center">
            <Navigation size={20} className="text-green-300 mx-auto mb-2" />
            <p className="text-sm text-green-400">
              Start logging your cruises to track miles and locks.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
