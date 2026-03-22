'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, CheckCircle } from 'lucide-react'

export function SignUpForm() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [boatName, setBoatName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = 'Email is required'
    if (!handle) newErrors.handle = 'Handle is required'
    if (handle && !/^[a-z0-9_]+$/.test(handle)) {
      newErrors.handle = 'Only lowercase letters, numbers, and underscores'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { handle, boat_name: boatName || undefined },
        emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      },
    })

    if (err) {
      setErrors({ email: err.message })
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="font-display text-display text-green-800 font-bold">Towpath</h1>
          </Link>
          <p className="text-body text-green-400 mt-1">Join the canal community</p>
        </div>

        <div className="bg-bg-surface rounded-xl border border-green-100 p-6 shadow-card">
          {sent ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle size={40} className="text-water-500" />
              </div>
              <h2 className="font-display text-h1 text-green-800 font-bold mb-2">Check your email</h2>
              <p className="text-body text-green-600 mb-1">Magic link sent to</p>
              <p className="text-body font-medium text-green-800 mb-4">{email}</p>
              <p className="text-sm text-green-400">Click the link to complete sign-up.</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-h1 text-green-800 font-bold mb-1">Create account</h2>
              <p className="text-body text-green-400 mb-6">Free, no password required.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  error={errors.email}
                  autoFocus
                />
                <Input
                  label="Handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase())}
                  placeholder="narrowboat_adventures"
                  required
                  error={errors.handle}
                />
                <Input
                  label="Boat name (optional)"
                  type="text"
                  value={boatName}
                  onChange={(e) => setBoatName(e.target.value)}
                  placeholder="The Little Dipper"
                />
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  <Mail size={16} />
                  Send magic link
                </Button>
              </form>

              <p className="text-center text-sm text-green-400 mt-4">
                Already have an account?{' '}
                <Link
                  href={`/auth/sign-in${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                  className="text-green-600 underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
