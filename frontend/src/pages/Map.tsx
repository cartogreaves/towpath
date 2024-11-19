import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import TowpathMenu from '../components/menu/TowpathMenu'
import ProfileMenu from '../components/menu/ProfileMenu'
import ZoomControl from '../components/menu/ZoomControl'
import { MapContext } from '../contexts/MapContext'
import { useTheme } from '../contexts/ThemeContext'

const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/bright',
  dark: 'https://api.maptiler.com/maps/basic-v2-dark/style.json?key=iyDUwVavsj7dSscbvWWe'
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light,
      center: [-2.2507, 51.3475],
      zoom: 16,
      attributionControl: false // Remove map attribution
    })

    map.on('load', () => {
      setMapInstance(map)
    })

    return () => {
      map.remove()
    }
  }, []) // Initial map setup

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setStyle(isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light)
    }
  }, [isDarkMode])

  return (
    <MapContext.Provider value={mapInstance}>
      <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TowpathMenu />
        <ZoomControl />
        <ProfileMenu />
        <div ref={mapContainer} className="flex-grow" />
      </div>
    </MapContext.Provider>
  )
}