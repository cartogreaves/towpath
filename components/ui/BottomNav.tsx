'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Route, Users, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',          label: 'Map',       icon: <Map   size={24} strokeWidth={1.5} /> },
  { href: '/routes',    label: 'Routes',    icon: <Route size={24} strokeWidth={1.5} /> },
  { href: '/community', label: 'Community', icon: <Users size={24} strokeWidth={1.5} /> },
  { href: '/profile',   label: 'Profile',   icon: <User  size={24} strokeWidth={1.5} /> },
]

interface BottomNavProps {
  onNavigate?: () => void
}

export function BottomNav({ onNavigate }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] flex bg-bg-surface border-t border-green-100 pb-safe"
      style={{ height: '56px' }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`
              flex-1 flex flex-col items-center justify-center gap-0.5
              transition-colors duration-150 select-none
              ${isActive ? 'text-green-600' : 'text-green-300'}
            `}
          >
            {item.icon}
            {isActive && (
              <span className="text-xs font-medium font-sans leading-none">
                {item.label}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
