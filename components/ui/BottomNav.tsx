'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Route, Users, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',          label: 'Map',       icon: Map   },
  { href: '/routes',    label: 'Routes',    icon: Route },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/profile',   label: 'Profile',   icon: User  },
]

interface BottomNavProps {
  onNavigate?: () => void
}

export function BottomNav({ onNavigate }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] px-3 pt-2 pb-safe" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 8px, 12px)' }}>
      <div className="flex bg-bg-surface/95 backdrop-blur-md rounded-2xl border border-green-100 p-1 gap-0.5"
        style={{ boxShadow: '0 2px 16px rgba(44,58,42,0.10), 0 0 0 4px rgba(44,58,42,0.04)' }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5
                transition-all duration-200 select-none
                ${isActive
                  ? 'bg-green-700 text-white'
                  : 'text-green-300 hover:text-green-500 hover:bg-green-50'
                }
              `}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
