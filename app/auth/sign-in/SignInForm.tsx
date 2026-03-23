'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, CheckCircle } from 'lucide-react'

export function SignInForm() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      },
    })

    if (err) {
      setError(err.message)
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
          <p className="text-body text-green-400 mt-1">Along the...</p>
          <Link href="/">
            <h1 className="font-display text-display text-green-800 font-bold">Towpath</h1>
          </Link>
        </div>

        <div className="bg-bg-surface rounded-xl border border-green-100 p-6 shadow-card">
          {sent ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle size={40} className="text-water-500" />
              </div>
              <h2 className="font-display text-h1 text-green-800 font-bold mb-2">
                Check your email
              </h2>
              <p className="text-body text-green-600 mb-1">We sent a magic link to</p>
              <p className="text-body font-medium text-green-800 mb-4">{email}</p>
              <p className="text-sm text-green-400">Click the link to sign in. No password needed.</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-h1 text-green-800 font-bold mb-1">Sign in</h2>
              <p className="text-body text-green-400 mb-6">We&apos;ll send a magic link to your email.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  large
                  error={error}
                  autoFocus
                />
                <Button type="submit" loading={loading} className="w-full" size="lg">
                  <Mail size={16} />
                  Send magic link
                </Button>
              </form>

              <p className="text-center text-sm text-green-400 mt-4">
                New to Towpath?{' '}
                <Link
                  href={`/auth/sign-up${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                  className="text-green-600 underline underline-offset-2"
                >
                  Create account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
