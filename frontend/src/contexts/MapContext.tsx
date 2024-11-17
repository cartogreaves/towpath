// src/contexts/MapContext.tsx
import { createContext, useContext } from 'react'
import type { Map } from 'maplibre-gl'

export const MapContext = createContext<Map | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
}