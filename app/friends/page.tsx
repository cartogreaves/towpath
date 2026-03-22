import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BoatCard } from '@/components/ui/BoatCard'
import { BottomNav } from '@/components/ui/BottomNav'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { UserPlus, Users, ChevronLeft } from 'lucide-react'
import type { Profile, Friendship } from '@/lib/types/database'

export default async function FriendsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in?returnTo=/friends')

  // Get all friendships
  const { data: friendships } = await supabase
    .from('friendships')
    .select('*')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

  const acceptedIds = (friendships ?? [])
    .filter((f: Friendship) => f.status === 'accepted')
    .map((f: Friendship) => f.requester_id === user.id ? f.addressee_id : f.requester_id)

  const pendingReceived = (friendships ?? [])
    .filter((f: Friendship) => f.status === 'pending' && f.addressee_id === user.id)

  const pendingSent = (friendships ?? [])
    .filter((f: Friendship) => f.status === 'pending' && f.requester_id === user.id)

  // Fetch friend profiles
  const { data: friends } = acceptedIds.length
    ? await supabase.from('profiles').select('*').in('id', acceptedIds)
    : { data: [] }

  // Fetch pending requester profiles
  const pendingRequesters = pendingReceived.map((f: Friendship) => f.requester_id)
  const { data: pendingProfiles } = pendingRequesters.length
    ? await supabase.from('profiles').select('*').in('id', pendingRequesters)
    : { data: [] }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="bg-green-800 px-4 pt-safe pb-4">
        <div className="flex items-center gap-3 pt-4">
          <Link href="/profile" className="text-green-300">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="font-display text-h1 text-bg-elevated font-bold">Friends</h1>
          <Link href="/friends/add" className="ml-auto">
            <Button size="sm" variant="secondary" className="border-green-600 text-green-200">
              <UserPlus size={14} />
              Add friend
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Pending requests */}
        {pendingProfiles && pendingProfiles.length > 0 && (
          <section>
            <h2 className="text-h3 font-semibold text-green-800 mb-3">
              Friend requests ({pendingProfiles.length})
            </h2>
            <div className="space-y-3">
              {pendingProfiles.map((p: Profile) => (
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
                  <div className="flex gap-2">
                    <form action={`/api/friends/accept`} method="POST">
                      <input type="hidden" name="friendId" value={p.id} />
                      <Button size="sm" type="submit">Accept</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Friends list */}
        <section>
          <h2 className="text-h3 font-semibold text-green-800 mb-3">
            {friends && friends.length > 0
              ? `${friends.length} friend${friends.length !== 1 ? 's' : ''}`
              : 'Friends'
            }
          </h2>
          {friends && friends.length > 0 ? (
            <div className="space-y-3">
              {friends.map((f: Profile) => (
                <BoatCard key={f.id} profile={f} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users size={32} className="text-green-300 mx-auto mb-3" />
              <p className="font-display text-h2 text-green-800 mb-2">No friends yet</p>
              <p className="text-body text-green-400 mb-4">
                Add friends to see their location and message them.
              </p>
              <Link href="/friends/add">
                <Button>
                  <UserPlus size={16} />
                  Find boaters
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
