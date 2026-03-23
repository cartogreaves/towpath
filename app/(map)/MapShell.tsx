'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MapContext, useMapContext, type FilterValue, type NavigationBounds } from './MapContext'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { BottomNav } from '@/components/ui/BottomNav'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { NavigationSelector } from '@/components/ui/NavigationSelector'
import { useCommunityPosts } from '@/lib/hooks/useCommunityPosts'
import { useSavedRoutes } from '@/lib/hooks/useSavedRoutes'
import { useFriendLocations } from '@/lib/hooks/useFriendLocations'
import { useProfile } from '@/lib/hooks/useProfile'
import { useCanalNetwork } from '@/lib/hooks/useCanalNetwork'
import { useCanalInfrastructure } from '@/lib/hooks/useCanalInfrastructure'
import { useNavigations } from '@/lib/hooks/useNavigations'
import type { MapBounds } from '@/components/map/MapCanvas'
import type { CommunityPost } from '@/lib/types/database'
import type { InfrastructurePoint } from '@/lib/hooks/useCanalInfrastructure'
import type { Navigation } from '@/lib/hooks/useNavigations'
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
          selectedCommunityPost, setSelectedCommunityPost,
          navigationBounds } = useMapContext()
  const { profile } = useProfile()

  const isMapTab       = pathname === '/'
  const isRoutesTab    = pathname.startsWith('/routes')
  const isCommunityTab = pathname.startsWith('/community')
  const isProfileTab   = pathname.startsWith('/profile')

  const infraTypeFilter: string | null = activeFilter ?? null

  const { data: canalSegments = [] } = useCanalNetwork()
  const { data: allInfra = [] }      = useCanalInfrastructure(isMapTab ? infraTypeFilter : null)
  const { data: allCommunity = [] }  = useCommunityPosts()
  const { data: savedRoutes = [] }   = useSavedRoutes({ enabled: isRoutesTab && !!profile?.id })
  const { data: boatLocations = [] } = useFriendLocations({ enabled: isProfileTab })

  const infrastructure = isMapTab       ? allInfra                                  : []
  const communityPins  = isCommunityTab ? allCommunity.filter(p => p.lat != null)   : []
  const routes         = isRoutesTab    ? savedRoutes                                : []
  const boats          = isProfileTab   ? boatLocations                              : []

  return (
    <DynamicMap
      canalSegments={canalSegments}
      infrastructure={infrastructure}
      navigationBounds={navigationBounds}
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
  const [navigationBounds, setNavigationBounds] = useState<NavigationBounds | null>(null)
  const [selectedNavId, setSelectedNavId] = useState<number | null>(null)

  const { profile } = useProfile()
  const { data: navigations = [] } = useNavigations()
  const defaultApplied = useRef(false)

  // Auto-fly to default navigation once on first load
  useEffect(() => {
    if (defaultApplied.current || !profile?.default_navigation_id || navigations.length === 0) return
    const nav = navigations.find(n => n.id === profile.default_navigation_id)
    if (!nav) return
    defaultApplied.current = true
    setSelectedNavId(nav.id)
    setNavigationBounds({ minLng: Number(nav.min_lng), minLat: Number(nav.min_lat), maxLng: Number(nav.max_lng), maxLat: Number(nav.max_lat) })
  }, [profile, navigations])

  const handleBoundsChange = useCallback((b: MapBounds) => setBounds(b), [])

  function handleNavSelect(nav: Navigation) {
    setSelectedNavId(nav.id)
    setNavigationBounds({ minLng: Number(nav.min_lng), minLat: Number(nav.min_lat), maxLng: Number(nav.max_lng), maxLat: Number(nav.max_lat) })
  }

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
        navigationBounds,
        setNavigationBounds,
      }}
    >
      <main className="relative w-full h-screen overflow-hidden bg-bg-primary">
        <MapLayer onBoundsChange={handleBoundsChange} />

        {/* Navigation selector — top-left map overlay */}
        <div className="absolute top-4 left-4 z-20 pt-safe">
          <NavigationSelector
            selectedId={selectedNavId}
            onSelect={handleNavSelect}
          />
        </div>

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
