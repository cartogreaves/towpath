'use client'

import { useState } from 'react'
import { Globe, Users, MapPin, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { PostType, PostVisibility } from '@/lib/types/database'

interface CreatePostFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const [type, setType]             = useState<PostType>('ask')
  const [visibility, setVisibility] = useState<PostVisibility>('public')
  const [title, setTitle]           = useState('')
  const [body, setBody]             = useState('')
  const [pinLocation, setPinLocation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not signed in'); setSubmitting(false); return }

    const { error: err } = await supabase.from('community_posts').insert({
      author_id:  user.id,
      type,
      title:      title.trim(),
      body:       body.trim() || null,
      visibility,
      // Location pinning from GPS will be added in a follow-up
    })

    setSubmitting(false)
    if (err) { setError(err.message); return }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-surface border border-green-100 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-sans font-semibold text-green-800 text-sm">New post</p>
        <button type="button" onClick={onCancel} className="text-green-300 hover:text-green-500">
          <X size={18} />
        </button>
      </div>

      {/* Type toggle */}
      <div className="flex gap-2">
        {(['ask', 'offer'] as PostType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              type === t
                ? t === 'ask'
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-teal-50 border-teal-300 text-teal-700'
                : 'bg-transparent border-green-100 text-green-400'
            }`}
          >
            {t === 'ask' ? 'Ask' : 'Offer'}
          </button>
        ))}
      </div>

      {/* Title */}
      <Input
        placeholder={type === 'ask' ? 'What do you need?' : 'What can you offer?'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Body */}
      <textarea
        placeholder="More detail (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-green-100 bg-bg-primary px-3 py-2 text-sm text-green-800 placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
      />

      {/* Visibility toggle */}
      <div className="flex gap-2">
        {([['public', Globe, 'Everyone'], ['friends', Users, 'Friends only']] as const).map(([v, Icon, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setVisibility(v as PostVisibility)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border transition-colors ${
              visibility === v
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-transparent border-green-100 text-green-400'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Pin to map toggle */}
      <button
        type="button"
        onClick={() => setPinLocation(!pinLocation)}
        className={`w-full flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs border transition-colors ${
          pinLocation
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-transparent border-green-100 text-green-400'
        }`}
      >
        <MapPin size={12} />
        {pinLocation ? 'Using your current location' : 'Pin to your current location'}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button type="submit" disabled={submitting || !title.trim()} className="w-full">
        {submitting ? 'Posting…' : 'Post'}
      </Button>
    </form>
  )
}
