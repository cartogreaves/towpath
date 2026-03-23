'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import type { Profile, BoatType } from '@/lib/types/database'
import { ChevronLeft } from 'lucide-react'
import { useNavigations } from '@/lib/hooks/useNavigations'

const BOAT_TYPES: { value: BoatType; label: string }[] = [
  { value: 'narrowboat', label: 'Narrowboat' },
  { value: 'widebeam', label: 'Widebeam' },
  { value: 'cruiser', label: 'Cruiser' },
  { value: 'dutch_barge', label: 'Dutch barge' },
  { value: 'tug', label: 'Tug' },
  { value: 'butty', label: 'Butty' },
  { value: 'other', label: 'Other' },
]

const BOAT_COLOURS = [
  '#C93B3B', '#E07030', '#3B7AC9', '#2C8A5A', '#8A2C8A',
  '#C9A83B', '#2C3A8A', '#8A6B3B', '#3B8A8A', '#6B3B8A',
]

export default function EditProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    handle: '',
    boat_name: '',
    boat_colour: '#C93B3B',
    boat_type: 'narrowboat' as BoatType,
    is_cc: true,
    bio: '',
    whatsapp_number: '',
    whatsapp_enabled: false,
    default_navigation_id: null as number | null,
  })
  const { data: navigations = [] } = useNavigations()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/sign-in'); return }
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setProfile(data)
            setForm({
              handle: data.handle,
              boat_name: data.boat_name ?? '',
              boat_colour: data.boat_colour,
              boat_type: data.boat_type,
              is_cc: data.is_cc,
              bio: data.bio ?? '',
              whatsapp_number: data.whatsapp_number ?? '',
              whatsapp_enabled: data.whatsapp_enabled,
              default_navigation_id: (data as Profile & { default_navigation_id?: number | null }).default_navigation_id ?? null,
            })
          }
        })
    })
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      handle: form.handle,
      boat_name: form.boat_name || null,
      boat_colour: form.boat_colour,
      boat_type: form.boat_type,
      is_cc: form.is_cc,
      bio: form.bio || null,
      whatsapp_number: form.whatsapp_enabled ? form.whatsapp_number : null,
      whatsapp_enabled: form.whatsapp_enabled,
      default_navigation_id: form.default_navigation_id,
    }).eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/profile') }, 1500)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-green-800 px-4 pt-safe pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-green-300 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-display text-h1 text-bg-elevated font-bold">Edit profile</h1>
      </div>

      <form onSubmit={handleSave} className="px-4 py-6 space-y-5 pb-24">
        {/* Avatar */}
        <div className="flex justify-center">
          <Avatar
            src={profile?.avatar_url}
            name={form.boat_name || form.handle}
            size={64}
          />
        </div>

        <Input
          label="Handle"
          value={form.handle}
          onChange={e => setForm(f => ({ ...f, handle: e.target.value.toLowerCase() }))}
          placeholder="narrowboat_adventures"
        />

        <Input
          label="Boat name"
          value={form.boat_name}
          onChange={e => setForm(f => ({ ...f, boat_name: e.target.value }))}
          placeholder="The Little Dipper"
        />

        {/* Boat type */}
        <div>
          <label className="text-label text-green-600 font-medium block mb-1.5">Boat type</label>
          <div className="grid grid-cols-2 gap-2">
            {BOAT_TYPES.map(bt => (
              <button
                key={bt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, boat_type: bt.value }))}
                className={`
                  py-2 px-3 rounded-md text-sm border text-left transition-colors
                  ${form.boat_type === bt.value
                    ? 'bg-green-600 text-bg-elevated border-green-600'
                    : 'bg-bg-surface border-green-200 text-green-700'
                  }
                `}
              >
                {bt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Boat colour */}
        <div>
          <label className="text-label text-green-600 font-medium block mb-1.5">Boat colour</label>
          <div className="flex gap-2 flex-wrap">
            {BOAT_COLOURS.map(colour => (
              <button
                key={colour}
                type="button"
                onClick={() => setForm(f => ({ ...f, boat_colour: colour }))}
                className={`
                  w-8 h-8 rounded-full border-2 transition-transform
                  ${form.boat_colour === colour ? 'border-green-800 scale-110' : 'border-transparent'}
                `}
                style={{ background: colour }}
              />
            ))}
          </div>
        </div>

        {/* CC toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_cc}
            onChange={e => setForm(f => ({ ...f, is_cc: e.target.checked }))}
            className="w-5 h-5 rounded border-green-200 text-green-600"
          />
          <div>
            <p className="text-body font-medium text-green-700">Continuous cruiser</p>
            <p className="text-sm text-green-400">No fixed mooring — moves regularly</p>
          </div>
        </label>

        {/* Default waterway */}
        <div>
          <label className="text-label text-green-600 font-medium block mb-1.5">Home waterway</label>
          <p className="text-sm text-green-400 mb-2">The app will fly here when you open the map</p>
          <select
            value={form.default_navigation_id ?? ''}
            onChange={e => setForm(f => ({ ...f, default_navigation_id: e.target.value ? Number(e.target.value) : null }))}
            className="
              w-full h-11 px-3 bg-bg-surface border border-green-200 rounded-md
              text-green-700 font-sans text-body
              focus:outline-none focus:border-water-500 focus:ring-[3px] focus:ring-water-500/15
            "
          >
            <option value="">None — start at default view</option>
            {navigations.map(nav => (
              <option key={nav.id} value={nav.id}>{nav.name}</option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="text-label text-green-600 font-medium block mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="A bit about you and your boat..."
            rows={3}
            className="
              w-full bg-bg-surface border border-green-200 rounded-md p-3
              text-green-700 text-body font-sans placeholder:text-green-300
              focus:outline-none focus:border-water-500 focus:ring-[3px] focus:ring-water-500/15
              resize-none
            "
          />
        </div>

        {/* WhatsApp */}
        <div className="bg-bg-surface border border-green-100 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={form.whatsapp_enabled}
              onChange={e => setForm(f => ({ ...f, whatsapp_enabled: e.target.checked }))}
              className="w-5 h-5 rounded border-green-200 text-green-600"
            />
            <div>
              <p className="text-body font-medium text-green-700">Enable WhatsApp messaging</p>
              <p className="text-sm text-green-400">Friends can message you via WhatsApp</p>
            </div>
          </label>
          {form.whatsapp_enabled && (
            <Input
              label="WhatsApp number"
              type="tel"
              value={form.whatsapp_number}
              onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
              placeholder="+44 7700 900000"
            />
          )}
        </div>

        <Button type="submit" loading={saving} className="w-full" size="lg">
          {saved ? 'Saved ✓' : 'Save profile'}
        </Button>
      </form>
    </div>
  )
}
