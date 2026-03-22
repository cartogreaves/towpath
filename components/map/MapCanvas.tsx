'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import type { PoiType, POIWithStatus, ServiceStatus, CommunityPost, BoatLocationWithProfile, SavedRouteWithGeojson } from '@/lib/types/database'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

const PIN_COLOURS: Record<PoiType, string> = {
  water_point:    '#4A8B6E',
  mooring:        '#4A5A3A',
  lock:           '#8A7558',
  winding_hole:   '#C8B89E',
  waste_services: '#7A8E66',
  pump_out:       '#7A8E66',
  pub:            '#C4704A',
  shop:           '#5E7048',
  boatyard:       '#6B5A42',
  fuel:           '#6B5A42',
  launderette:    '#5E7048',
  post_office:    '#5E7048',
}

const STATUS_DOT_COLOURS: Record<ServiceStatus, string> = {
  working:        '#4A8B6E',
  issue_reported: '#C4704A',
  closed:         '#B5403A',
  unknown:        'transparent',
}

export interface MapBounds {
  lng1: number; lat1: number; lng2: number; lat2: number
}

interface MapCanvasProps {
  pois?: POIWithStatus[]
  selectedPoi?: POIWithStatus | null
  communityPosts?: CommunityPost[]
  selectedCommunityPost?: CommunityPost | null
  savedRoutes?: SavedRouteWithGeojson[]
  boatLocations?: BoatLocationWithProfile[]
  bottomPadding?: number
  isDark?: boolean
  onBoundsChange?: (bounds: MapBounds) => void
  onPoiClick?: (poi: POIWithStatus) => void
  onCommunityPostClick?: (post: CommunityPost) => void
  className?: string
}

function createPinSVG(fill: string, statusColour?: string): string {
  const dot = statusColour && statusColour !== 'transparent'
    ? `<circle cx="18" cy="22" r="3" fill="${statusColour}" stroke="white" stroke-width="1"/>`
    : ''
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z"
        fill="${fill}" stroke="#2C3A2A" stroke-width="1"/>
      ${dot}
    </svg>`
}

function svgToDataUrl(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim())
}

function createBoatSVG(colour: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="12" viewBox="0 0 32 12">
    <path d="M28 2H6L2 6l4 4h22l3-3V5l-3-3z" fill="${colour}" stroke="#2C3A2A" stroke-width="1"/>
    <path d="M28 2l2 3-2 3" fill="none" stroke="#2C3A2A" stroke-width="1"/>
  </svg>`
}

export function MapCanvas({
  pois = [],
  selectedPoi = null,
  communityPosts = [],
  selectedCommunityPost = null,
  savedRoutes = [],
  boatLocations = [],
  bottomPadding = 0,
  isDark = false,
  onBoundsChange,
  onPoiClick,
  onCommunityPostClick,
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

      map.addSource('pois', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true, clusterMaxZoom: 12, clusterRadius: 50,
      })

      map.addLayer({
        id: 'poi-clusters', type: 'circle', source: 'pois',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#E8EBE2', 'circle-radius': 18,
          'circle-stroke-width': 2, 'circle-stroke-color': '#5E7048',
        },
      })

      map.addLayer({
        id: 'poi-cluster-count', type: 'symbol', source: 'pois',
        filter: ['has', 'point_count'],
        layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 13 },
        paint: { 'text-color': '#2C3A2A' },
      })

      map.addLayer({
        id: 'poi-unclustered', type: 'symbol', source: 'pois',
        filter: ['!', ['has', 'point_count']],
        layout: { 'icon-image': ['get', 'icon'], 'icon-size': 1, 'icon-allow-overlap': true, 'icon-anchor': 'bottom' },
      })

      map.on('click', 'poi-unclustered', (e) => {
        if (!e.features?.[0] || !onPoiClick) return
        const props = e.features[0].properties
        if (props) {
          onPoiClick({
            id: props.id, name: props.name, type: props.type,
            lng: (e.features[0].geometry as GeoJSON.Point).coordinates[0],
            lat: (e.features[0].geometry as GeoJSON.Point).coordinates[1],
            canal_id: props.canal_id, mile_marker: props.mile_marker,
            metadata: props.metadata ? JSON.parse(props.metadata) : {},
            current_status: props.current_status,
            report_count: props.report_count,
            latest_report: props.latest_report,
          })
        }
      })

      map.on('mouseenter', 'poi-unclustered', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'poi-unclustered', () => { map.getCanvas().style.cursor = '' })

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

  // Update POI markers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('pois') as mapboxgl.GeoJSONSource
    if (!source) return

    const imagePromises = pois.map(async (poi) => {
      const iconKey = `pin-${poi.type}-${poi.current_status || 'unknown'}`
      if (!map.hasImage(iconKey)) {
        const fill = PIN_COLOURS[poi.type] || '#5E7048'
        const dotColour = poi.current_status ? STATUS_DOT_COLOURS[poi.current_status] : undefined
        const img = new Image(24, 32)
        img.src = svgToDataUrl(createPinSVG(fill, dotColour))
        await new Promise<void>((resolve) => {
          img.onload = () => { if (!map.hasImage(iconKey)) map.addImage(iconKey, img); resolve() }
        })
      }
      return iconKey
    })

    Promise.all(imagePromises).then(() => {
      source.setData({
        type: 'FeatureCollection',
        features: pois.map((poi) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [poi.lng, poi.lat] },
          properties: {
            id: poi.id, name: poi.name, type: poi.type,
            canal_id: poi.canal_id, mile_marker: poi.mile_marker,
            metadata: JSON.stringify(poi.metadata),
            current_status: poi.current_status,
            report_count: poi.report_count,
            latest_report: poi.latest_report,
            icon: `pin-${poi.type}-${poi.current_status || 'unknown'}`,
          },
        })),
      })
    })
  }, [pois])

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
