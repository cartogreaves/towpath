'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import type { CommunityPost, BoatLocationWithProfile, SavedRouteWithGeojson } from '@/lib/types/database'
import type { CanalSegment } from '@/lib/hooks/useCanalNetwork'
import type { InfrastructurePoint } from '@/lib/hooks/useCanalInfrastructure'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export interface MapBounds {
  lng1: number; lat1: number; lng2: number; lat2: number
}

// Colour per infrastructure type for data-driven circle styling
const INFRA_COLOURS: Record<string, string> = {
  lock:          '#8A7558',
  winding_hole:  '#C8B89E',
  bridge:        '#6B5A42',
  culvert:       '#7A8E66',
  aqueduct:      '#4A8B6E',
  tunnel_portal: '#4A5A3A',
  weir:          '#5E7048',
  reservoir:     '#4A8B6E',
  wharf:         '#C4704A',
}

// Build a Mapbox match expression from the colour map
function infraColourExpression(): mapboxgl.Expression {
  const pairs: (string | mapboxgl.Expression)[] = ['match', ['get', 'type']]
  for (const [type, colour] of Object.entries(INFRA_COLOURS)) {
    pairs.push(type, colour)
  }
  pairs.push('#5E7048') // default
  return pairs as mapboxgl.Expression
}

interface MapCanvasProps {
  selectedPoi?: InfrastructurePoint | null
  communityPosts?: CommunityPost[]
  selectedCommunityPost?: CommunityPost | null
  savedRoutes?: SavedRouteWithGeojson[]
  boatLocations?: BoatLocationWithProfile[]
  canalSegments?: CanalSegment[]
  infrastructure?: InfrastructurePoint[]
  bottomPadding?: number
  isDark?: boolean
  onBoundsChange?: (bounds: MapBounds) => void
  onCommunityPostClick?: (post: CommunityPost) => void
  onInfrastructureClick?: (point: InfrastructurePoint) => void
  className?: string
}

function createBoatSVG(colour: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="12" viewBox="0 0 32 12">
    <path d="M28 2H6L2 6l4 4h22l3-3V5l-3-3z" fill="${colour}" stroke="#2C3A2A" stroke-width="1"/>
    <path d="M28 2l2 3-2 3" fill="none" stroke="#2C3A2A" stroke-width="1"/>
  </svg>`
}

export function MapCanvas({
  selectedPoi = null,
  communityPosts = [],
  selectedCommunityPost = null,
  savedRoutes = [],
  boatLocations = [],
  canalSegments = [],
  infrastructure = [],
  bottomPadding = 0,
  isDark = false,
  onBoundsChange,
  onCommunityPostClick,
  onInfrastructureClick,
  className = '',
}: MapCanvasProps) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const mapRef          = useRef<mapboxgl.Map | null>(null)
  const boundsTimer     = useRef<ReturnType<typeof setTimeout>>(null)
  const pulseMarker     = useRef<mapboxgl.Marker | null>(null)
  const boatMarkersRef  = useRef<mapboxgl.Marker[]>([])

  const emitBounds = useCallback((map: mapboxgl.Map) => {
    if (!onBoundsChange) return
    const b = map.getBounds()
    if (!b) return
    onBoundsChange({ lng1: b.getWest(), lat1: b.getSouth(), lng2: b.getEast(), lat2: b.getNorth() })
  }, [onBoundsChange])

  // Initialise map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/outdoors-v12',
      center: [-1.5, 52.3],
      zoom: 9,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right')
    map.addControl(
      new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
      'top-right'
    )

    map.on('style.load', () => {
      try {
        map.setPaintProperty('land', 'background-color', '#F3F0E8')
        ;['water', 'water-shadow'].forEach(id => {
          if (map.getLayer(id)) map.setPaintProperty(id, 'fill-color', 'rgba(141,187,168,0.3)')
        })
      } catch { /* layer names vary by style version */ }

      map.addSource('friends', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addSource('routes',  { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addLayer({
        id: 'route-line', type: 'line', source: 'routes',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#4A8B6E', 'line-width': 4, 'line-opacity': 0.8 },
      })

      // Community posts layer
      map.addSource('community', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      map.addLayer({
        id: 'community-ask',   type: 'circle', source: 'community',
        filter: ['==', ['get', 'postType'], 'ask'],
        paint: {
          'circle-radius': 10, 'circle-color': '#F59E0B',
          'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      })
      map.addLayer({
        id: 'community-offer', type: 'circle', source: 'community',
        filter: ['==', ['get', 'postType'], 'offer'],
        paint: {
          'circle-radius': 10, 'circle-color': '#0D9488',
          'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      })

      for (const layerId of ['community-ask', 'community-offer']) {
        map.on('click', layerId, (e) => {
          if (!e.features?.[0] || !onCommunityPostClick) return
          const props = e.features[0].properties
          if (props) onCommunityPostClick(JSON.parse(props.post) as CommunityPost)
        })
        map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = '' })
      }

      // ── Canal network (permanent base layer) ──────────────────────────────
      map.addSource('canal-network', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })
      map.addLayer({
        id: 'canal-network-line',
        type: 'line',
        source: 'canal-network',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': [
            'match', ['get', 'sapnavstatus'],
            'Fully Navigable',    '#4A8B6E',
            'Partially Navigable','#7AB89E',
            '#B0C4B8', // default (non-navigable / unknown)
          ],
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 14, 3],
          'line-opacity': 0.7,
        },
      })

      // ── CRT Infrastructure (POI replacement) ─────────────────────────────
      map.addSource('infrastructure', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true, clusterMaxZoom: 13, clusterRadius: 40,
      })
      map.addLayer({
        id: 'infra-clusters',
        type: 'circle',
        source: 'infrastructure',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#E8EBE2',
          'circle-radius': 16,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#5E7048',
        },
      })
      map.addLayer({
        id: 'infra-cluster-count',
        type: 'symbol',
        source: 'infrastructure',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: { 'text-color': '#2C3A2A' },
      })
      map.addLayer({
        id: 'infra-points',
        type: 'circle',
        source: 'infrastructure',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 4, 15, 8],
          'circle-color': infraColourExpression(),
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      })

      map.on('click', 'infra-points', (e) => {
        if (!e.features?.[0] || !onInfrastructureClick) return
        const props = e.features[0].properties
        if (props) {
          onInfrastructureClick({
            id: props.id,
            sap_description: props.sap_description,
            type: props.type,
            waterway_name: props.waterway_name,
            lng: (e.features[0].geometry as GeoJSON.Point).coordinates[0],
            lat: (e.features[0].geometry as GeoJSON.Point).coordinates[1],
          })
        }
      })
      map.on('mouseenter', 'infra-points', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'infra-points', () => { map.getCanvas().style.cursor = '' })

      emitBounds(map)
    })

    map.on('moveend', () => {
      if (boundsTimer.current) clearTimeout(boundsTimer.current)
      boundsTimer.current = setTimeout(() => emitBounds(map), 300)
    })

    mapRef.current = map

    return () => {
      if (boundsTimer.current) clearTimeout(boundsTimer.current)
      pulseMarker.current?.remove()
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update canal network lines
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('canal-network') as mapboxgl.GeoJSONSource
    if (!source) return
    source.setData({
      type: 'FeatureCollection',
      features: canalSegments.map((seg) => ({
        type: 'Feature' as const,
        geometry: JSON.parse(seg.geojson),
        properties: { id: seg.id, name: seg.name, sapnavstatus: seg.sapnavstatus },
      })),
    })
  }, [canalSegments])

  // Update infrastructure points
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('infrastructure') as mapboxgl.GeoJSONSource
    if (!source) return
    source.setData({
      type: 'FeatureCollection',
      features: infrastructure.map((pt) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point', coordinates: [pt.lng, pt.lat] },
        properties: {
          id: pt.id,
          sap_description: pt.sap_description,
          type: pt.type,
          waterway_name: pt.waterway_name,
        },
      })),
    })
  }, [infrastructure])

  // Update community post pins
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('community') as mapboxgl.GeoJSONSource
    if (!source) return
    source.setData({
      type: 'FeatureCollection',
      features: communityPosts
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [p.lng!, p.lat!] },
          properties: { postType: p.type, post: JSON.stringify(p) },
        })),
    })
  }, [communityPosts])

  // Fly to selected community post
  useEffect(() => {
    const map = mapRef.current
    if (!selectedCommunityPost?.lat || !map) return
    map.flyTo({
      center: [selectedCommunityPost.lng!, selectedCommunityPost.lat!],
      zoom: Math.max(map.getZoom(), 14),
      duration: 500,
      essential: true,
    })
  }, [selectedCommunityPost])

  // React to selectedPoi: fly to it and show a pulsing ring
  useEffect(() => {
    const map = mapRef.current

    // Always clean up previous marker
    pulseMarker.current?.remove()
    pulseMarker.current = null

    if (!selectedPoi || !map) return

    // Fly to the selected POI
    map.flyTo({
      center: [selectedPoi.lng, selectedPoi.lat],
      zoom: Math.max(map.getZoom(), 15),
      duration: 500,
      essential: true,
    })

    // Pulsing highlight ring using a custom DOM element
    const el = document.createElement('div')
    el.className = 'poi-pulse'
    pulseMarker.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([selectedPoi.lng, selectedPoi.lat])
      .addTo(map)

    return () => {
      pulseMarker.current?.remove()
      pulseMarker.current = null
    }
  }, [selectedPoi])

  // Render saved route lines
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('routes') as mapboxgl.GeoJSONSource
    if (!source) return
    source.setData({
      type: 'FeatureCollection',
      features: savedRoutes
        .filter((r) => r.geojson)
        .map((r) => ({
          type: 'Feature' as const,
          geometry: r.geojson!,
          properties: { id: r.id, name: r.name },
        })),
    })
    // Fit map to routes if any
    if (savedRoutes.length > 0 && savedRoutes[0].geojson) {
      const coords = savedRoutes.flatMap((r) => r.geojson?.coordinates ?? [])
      if (coords.length > 0) {
        const bounds = coords.reduce(
          (b, c) => b.extend(c as [number, number]),
          new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
        )
        map.fitBounds(bounds, { padding: 60, duration: 600 })
      }
    }
  }, [savedRoutes])

  // Render boat location markers (own + friends)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // Remove old markers
    boatMarkersRef.current.forEach((m) => m.remove())
    boatMarkersRef.current = []
    // Add new markers
    boatLocations.forEach((bl) => {
      const el = document.createElement('div')
      el.className = bl.is_own ? 'boat-marker boat-marker--own' : 'boat-marker'
      el.style.transform = `rotate(${bl.heading ?? 0}deg)`
      el.innerHTML = createBoatSVG(bl.boat_colour || '#4A5A3A')
      // Label
      const label = document.createElement('div')
      label.className = 'boat-label'
      label.textContent = bl.boat_name ?? bl.handle
      el.appendChild(label)
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([bl.lng, bl.lat])
        .addTo(map)
      boatMarkersRef.current.push(marker)
    })
    return () => {
      boatMarkersRef.current.forEach((m) => m.remove())
      boatMarkersRef.current = []
    }
  }, [boatLocations])

  // Shift map centre to account for sheet coverage
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.easeTo({ padding: { bottom: bottomPadding, top: 0, left: 0, right: 0 }, duration: 300 })
  }, [bottomPadding])

  return <div ref={containerRef} className={`map-container ${className}`} />
}
