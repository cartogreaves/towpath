'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { MapContext, useMapContext, type FilterValue } from './MapContext'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { BottomNav } from '@/components/ui/BottomNav'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { useCommunityPosts } from '@/lib/hooks/useCommunityPosts'
import { useSavedRoutes } from '@/lib/hooks/useSavedRoutes'
import { useFriendLocations } from '@/lib/hooks/useFriendLocations'
import { useProfile } from '@/lib/hooks/useProfile'
import { useCanalNetwork } from '@/lib/hooks/useCanalNetwork'
import { useCanalInfrastructure } from '@/lib/hooks/useCanalInfrastructure'
import type { MapBounds } from '@/components/map/MapCanvas'
import type { CommunityPost } from '@/lib/types/database'
import type { InfrastructurePoint } from '@/lib/hooks/useCanalInfrastructure'
import type { SnapPoint } from '@/components/ui/BottomSheet'

const DynamicMap = dynamic(
  () => import('@/components/map/MapCanvas').then((m) => m.MapCanvas),
  { ssr: false }
)

function snapToBottomPadding(snap: SnapPoint): number {
  if (snap === 'quarter') return 292
  if (typeof window === 'undefined') return 0
  if (snap === 'half')   return window.innerHeight * 0.5
  return window.innerHeight - 56
}

function MapLayer({ onBoundsChange }: { onBoundsChange: (b: MapBounds) => void }) {
  const pathname = usePathname()
  const { activeFilter, selectedPoi, setSelectedPoi, setSnap, snap,
          selectedCommunityPost, setSelectedCommunityPost } = useMapContext()
  const { profile } = useProfile()

  const isMapTab       = pathname === '/'
  const isRoutesTab    = pathname.startsWith('/routes')
  const isCommunityTab = pathname.startsWith('/community')
  const isProfileTab   = pathname.startsWith('/profile')

  const infraTypeFilter: string | null = activeFilter ?? null

  // Canal network is always visible (permanent base data)
  const { data: canalSegments = [] } = useCanalNetwork()

  // Infrastructure replaces POIs on the map tab
  const { data: allInfra = [] } = useCanalInfrastructure(isMapTab ? infraTypeFilter : null)

  const { data: allCommunity = [] }  = useCommunityPosts()
  const { data: savedRoutes = [] }   = useSavedRoutes({ enabled: isRoutesTab && !!profile?.id })
  const { data: boatLocations = [] } = useFriendLocations({ enabled: isProfileTab })

  // Each tab shows its own overlay; others get empty arrays
  const infrastructure = isMapTab       ? allInfra                                           : []
  const communityPins  = isCommunityTab ? allCommunity.filter((p) => p.lat != null)          : []
  const routes         = isRoutesTab    ? savedRoutes                                         : []
  const boats          = isProfileTab   ? boatLocations                                       : []

  return (
    <DynamicMap
      canalSegments={canalSegments}
      infrastructure={infrastructure}
      selectedPoi={selectedPoi}
      communityPosts={communityPins}
      selectedCommunityPost={selectedCommunityPost}
      savedRoutes={routes}
      boatLocations={boats}
      bottomPadding={snapToBottomPadding(snap)}
      onBoundsChange={onBoundsChange}
      onInfrastructureClick={(pt: InfrastructurePoint) => {
        setSelectedPoi(pt)
        setSnap('half')
      }}
      onCommunityPostClick={(post: CommunityPost) => {
        setSelectedCommunityPost(post)
        setSnap('half')
      }}
    />
  )
}

export function MapShell({ children }: { children: React.ReactNode }) {
  const [bounds, setBounds] = useState<MapBounds | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>(null)
  const [selectedPoi, setSelectedPoi] = useState<InfrastructurePoint | null>(null)
  const [selectedCommunityPost, setSelectedCommunityPost] = useState<CommunityPost | null>(null)
  const [snap, setSnap] = useState<SnapPoint>('quarter')
  const [searchQuery, setSearchQuery] = useState('')

  const handleBoundsChange = useCallback((b: MapBounds) => setBounds(b), [])

  return (
    <MapContext.Provider
      value={{
        bounds,
        activeFilter,
        setActiveFilter,
        selectedPoi,
        setSelectedPoi,
        selectedCommunityPost,
        setSelectedCommunityPost,
        snap,
        setSnap,
        searchQuery,
        setSearchQuery,
      }}
    >
      <main className="relative w-full h-screen overflow-hidden bg-bg-primary">
        <MapLayer onBoundsChange={handleBoundsChange} />

        <BottomSheet snap={snap} onSnapChange={setSnap} showBackdrop={snap === 'full'}>
          <div className="px-4 pt-0.5 pb-1">
            <h1 className="font-display text-h1 text-green-800 font-bold mb-2 leading-none">
              Towpath
            </h1>
            <div onFocus={() => { if (snap === 'quarter') setSnap('half') }}>
              <SearchBar
                placeholder="Search along the Towpath..."
                onSearch={(q) => {
                  setSearchQuery(q)
                  if (q.length > 0) setSnap('half')
                }}
                className="mb-2"
              />
            </div>
          </div>

          <FilterChips
            active={activeFilter}
            onChange={(v) => {
              setActiveFilter(v)
              setSelectedPoi(null)
              setSnap('half')
            }}
          />

          <div className="mt-3">
            {children}
          </div>
        </BottomSheet>

        <BottomNav onNavigate={() => setSnap('half')} />
      </main>
    </MapContext.Provider>
  )
}
