'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from './Button'

type GatedAction =
  | 'report'
  | 'comment'
  | 'save_route'
  | 'rsvp'
  | 'message'
  | 'location'

interface AccountGateProps {
  action: GatedAction
  returnTo?: string
  onClose: () => void
}

const actionCopy: Record<GatedAction, string> = {
  report: 'report a service status',
  comment: 'add a comment',
  save_route: 'save this route',
  rsvp: 'RSVP to this event',
  message: 'message this boater',
  location: 'share your location',
}

export function AccountGate({ action, returnTo, onClose }: AccountGateProps) {
  const router = useRouter()
  const copy = actionCopy[action]
  const returnParam = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''

  function goSignUp() {
    router.push(`/auth/sign-up${returnParam}`)
  }

  function goSignIn() {
    router.push(`/auth/sign-in${returnParam}`)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-green-900/20"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-bg-surface rounded-t-xl border-t border-green-100
          p-6 pb-10 shadow-overlay
          animate-in slide-in-from-bottom duration-300
        "
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h2 className="font-display text-h2 text-green-800 font-bold mb-2">
              Create a free account to {copy}
            </h2>
            <p className="text-body text-green-400">
              Join the community helping cruisers across the network.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-green-300 hover:text-green-600 transition-colors mt-0.5"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <Button onClick={goSignUp} className="flex-1">
            Create account
          </Button>
          <Button variant="secondary" onClick={goSignIn} className="flex-1">
            Sign in
          </Button>
        </div>
      </div>
    </>
  )
}
