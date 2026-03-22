'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { MapContext, useMapContext, type FilterValue } from './MapContext'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { BottomNav } from '@/components/ui/BottomNav'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { usePOIs } from '@/lib/hooks/usePOIs'
import { useCommunityPosts } from '@/lib/hooks/useCommunityPosts'
import type { MapBounds } from '@/components/map/MapCanvas'
import type { POIWithStatus, PoiType, CommunityPost } from '@/lib/types/database'
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
  const { activeFilter, selectedPoi, setSelectedPoi, setSnap, snap, selectedCommunityPost, setSelectedCommunityPost } = useMapContext()

  const poiTypeFilter: PoiType | null =
    activeFilter && activeFilter !== 'events' && activeFilter !== 'stoppages'
      ? (activeFilter as PoiType)
      : null

  const { data: pois = [] } = usePOIs(poiTypeFilter)
  const { data: communityPosts = [] } = useCommunityPosts()

  const pinnedPosts = communityPosts.filter((p) => p.lat != null && p.lng != null)

  return (
    <DynamicMap
      pois={pois}
      selectedPoi={selectedPoi}
      communityPosts={pinnedPosts}
      selectedCommunityPost={selectedCommunityPost}
      bottomPadding={snapToBottomPadding(snap)}
      onBoundsChange={onBoundsChange}
      onPoiClick={(poi: POIWithStatus) => {
        setSelectedPoi(poi)
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
  const [selectedPoi, setSelectedPoi] = useState<POIWithStatus | null>(null)
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
          {/* Persistent header — always visible at quarter */}
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
