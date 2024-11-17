import { useContext } from 'react'
import { MapContext } from '../../contexts/MapContext'

export default function ZoomControl() {
  const map = useContext(MapContext)

  const handleZoomIn = () => {
    map?.zoomIn()
  }

  const handleZoomOut = () => {
    map?.zoomOut()
  }

  return (
    <div className="absolute top-4 right-16 z-10 flex gap-2">
      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex">
        <button 
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-l-full"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button 
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-r-full border-l border-gray-200"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}