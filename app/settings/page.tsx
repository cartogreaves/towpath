import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/ui/BottomNav'
import { ChevronLeft, ChevronRight, LogOut, Moon, Bell, MapPin, Shield } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in?returnTo=/settings')

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { label: 'Edit profile', href: '/profile/edit', icon: <ChevronRight size={16} className="text-green-300" /> },
        { label: 'Location sharing', href: '/settings/location', icon: <MapPin size={14} className="text-green-400 mr-1" /> },
        { label: 'Notifications', href: '/settings/notifications', icon: <Bell size={14} className="text-green-400 mr-1" /> },
      ],
    },
    {
      title: 'Appearance',
      items: [
        { label: 'Dark mode', href: '/settings/appearance', icon: <Moon size={14} className="text-green-400 mr-1" /> },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { label: 'Privacy settings', href: '/settings/privacy', icon: <Shield size={14} className="text-green-400 mr-1" /> },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="bg-green-800 px-4 pt-safe pb-4">
        <div className="flex items-center gap-3 pt-4">
          <Link href="/profile" className="text-green-300">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="font-display text-h1 text-bg-elevated font-bold">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {settingsSections.map(section => (
          <section key={section.title}>
            <h2 className="text-label text-green-400 uppercase tracking-widest mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-bg-surface border border-green-100 rounded-lg overflow-hidden">
              {section.items.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-4 py-3
                    hover:bg-bg-elevated transition-colors
                    ${i < section.items.length - 1 ? 'border-b border-green-50' : ''}
                  `}
                >
                  <span className="text-body text-green-700">{item.label}</span>
                  <ChevronRight size={16} className="text-green-300" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Sign out */}
        <section>
          <div className="bg-bg-surface border border-green-100 rounded-lg overflow-hidden">
            <form action="/auth/sign-out" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger-light transition-colors"
              >
                <LogOut size={16} />
                <span className="text-body font-medium">Sign out</span>
              </button>
            </form>
          </div>
        </section>

        <p className="text-xs text-green-300 text-center">
          Towpath v0.1 · alongthetowpath.com
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
