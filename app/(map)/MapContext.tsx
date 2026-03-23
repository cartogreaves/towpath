'use client'

import { createContext, useContext } from 'react'
import type { MapBounds } from '@/components/map/MapCanvas'
import type { InfrastructurePoint } from '@/lib/hooks/useCanalInfrastructure'
import type { CommunityPost } from '@/lib/types/database'
import type { SnapPoint } from '@/components/ui/BottomSheet'

export type FilterValue = 'lock' | 'winding_hole' | 'bridge' | 'aqueduct' | 'tunnel_portal' | 'weir' | null

export interface MapContextValue {
  bounds: MapBounds | null
  activeFilter: FilterValue
  setActiveFilter: (f: FilterValue) => void
  selectedPoi: InfrastructurePoint | null
  setSelectedPoi: (p: InfrastructurePoint | null) => void
  selectedCommunityPost: CommunityPost | null
  setSelectedCommunityPost: (p: CommunityPost | null) => void
  snap: SnapPoint
  setSnap: (s: SnapPoint) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const MapContext = createContext<MapContextValue>({
  bounds: null,
  activeFilter: null,
  setActiveFilter: () => {},
  selectedPoi: null,
  setSelectedPoi: () => {},
  selectedCommunityPost: null,
  setSelectedCommunityPost: () => {},
  snap: 'quarter',
  setSnap: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
})

export function useMapContext() {
  return useContext(MapContext)
}
