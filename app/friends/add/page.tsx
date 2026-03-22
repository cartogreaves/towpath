'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ChevronLeft, UserPlus, Search } from 'lucide-react'
import type { Profile } from '@/lib/types/database'

export default function AddFriendPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<Record<string, boolean>>({})

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('handle', `%${query}%`)
      .limit(10)

    setResults(data ?? [])
    setLoading(false)
  }

  async function handleAdd(profileId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('friendships').insert({
      requester_id: user.id,
      addressee_id: profileId,
    })

    setSent(s => ({ ...s, [profileId]: true }))
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-green-800 px-4 pt-safe pb-4">
        <div className="flex items-center gap-3 pt-4">
          <button onClick={() => router.back()} className="text-green-300">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-display text-h1 text-bg-elevated font-bold">Add a friend</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by handle..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" loading={loading}>
            <Search size={16} />
          </Button>
        </form>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map(p => (
              <div
                key={p.id}
                className="bg-bg-surface border border-green-100 rounded-lg p-4 shadow-card flex items-center gap-3"
              >
                <Avatar src={p.avatar_url} name={p.boat_name || p.handle} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-body font-bold text-green-800 truncate">
                    {p.boat_name || 'Unnamed boat'}
                  </p>
                  <p className="text-sm text-green-400">@{p.handle}</p>
                </div>
                <Button
                  size="sm"
                  variant={sent[p.id] ? 'secondary' : 'primary'}
                  onClick={() => !sent[p.id] && handleAdd(p.id)}
                  disabled={sent[p.id]}
                >
                  <UserPlus size={14} />
                  {sent[p.id] ? 'Sent' : 'Add'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && query && !loading && (
          <div className="text-center py-8">
            <p className="text-body text-green-400">No boaters found for &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}
