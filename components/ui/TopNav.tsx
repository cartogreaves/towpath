import Link from 'next/link'
import { User } from 'lucide-react'
import { Avatar } from './Avatar'
import type { Profile } from '@/lib/types/database'

interface TopNavProps {
  profile?: Profile | null
}

export function TopNav({ profile }: TopNavProps) {
  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-40
        flex items-center justify-between px-6
        bg-green-800
      "
      style={{ height: '56px' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <span className="font-display text-h2 text-bg-elevated font-bold tracking-tight">
          Towpath
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link href="/services" className="text-green-100 hover:text-white text-body transition-colors">
          Services
        </Link>
        <Link href="/routes" className="text-green-100 hover:text-white text-body transition-colors">
          Routes
        </Link>
        <Link href="/events" className="text-green-100 hover:text-white text-body transition-colors">
          Events
        </Link>
      </div>

      {/* Auth area */}
      <div className="flex items-center gap-3">
        {profile ? (
          <Link href="/profile">
            <Avatar
              src={profile.avatar_url}
              name={profile.boat_name || profile.handle}
              size={32}
              className="ring-2 ring-bg-elevated/30 hover:ring-bg-elevated/60 transition-all"
            />
          </Link>
        ) : (
          <Link
            href="/auth/sign-in"
            className="text-green-100 hover:text-white text-body transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
