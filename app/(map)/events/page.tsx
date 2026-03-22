'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMapContext } from '../MapContext'
import { useEvents } from '@/lib/hooks/useEvents'
import { useProfile } from '@/lib/hooks/useProfile'
import { EventCard } from '@/components/ui/EventCard'
import { Button } from '@/components/ui/Button'
import { AccountGate } from '@/components/ui/AccountGate'
import { Plus } from 'lucide-react'

export default function EventsPage() {
  const { setSnap } = useMapContext()
  const { isLoggedIn } = useProfile()
  const [showGate, setShowGate] = useState(false)
  const router = useRouter()

  useEffect(() => { setSnap('half') }, [setSnap])

  const { data: events = [], isLoading } = useEvents()

  function handleCreate() {
    if (!isLoggedIn) { setShowGate(true); return }
    router.push('/events/create')
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-h1 text-green-800 font-bold">Events</h2>
        <Button size="sm" onClick={handleCreate}>
          <Plus size={14} />
          Create
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-8 text-center text-green-400">Loading...</div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-display text-h2 text-green-800 mb-2">No events nearby</p>
            <p className="text-body text-green-400 mb-4">
              Be the first to create one along this stretch.
            </p>
            <Button onClick={handleCreate}>
              <Plus size={16} />
              Create event
            </Button>
          </div>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} isLoggedIn={isLoggedIn} />
          ))
        )}
      </div>

      {showGate && <AccountGate action="rsvp" onClose={() => setShowGate(false)} />}
    </div>
  )
}
