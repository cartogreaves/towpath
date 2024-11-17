import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import LayersMenu from '../components/menu/TowpathMenu'
import ProfileMenu from '../components/menu/ProfileMenu'
import ZoomControl from '../components/menu/ZoomControl'
import { MapContext } from '../contexts/MapContext'

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [-2.2517, 51.341], // Bradford on Avon Top Lock
      zoom: 17
    })

    setMapInstance(map)

    return () => {
      map.remove()
    }
  }, [])

  return (
    <MapContext.Provider value={mapInstance}>
      <div className="relative h-screen">
        <LayersMenu />
        <ZoomControl />
        <ProfileMenu />
        <div ref={mapContainer} className="h-full" />
      </div>
    </MapContext.Provider>
  )
}