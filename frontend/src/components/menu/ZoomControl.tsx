import { useMap } from '../../contexts/MapContext'
import { Plus, Minus } from 'lucide-react'

export default function ZoomControl() {
  const map = useMap()

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <div className="backdrop-blur-sm rounded-lg shadow-lg flex items-center bg-component-navy">
        <button 
          onClick={() => map?.zoomIn()}
          className="w-12 h-12 flex items-center justify-center rounded-l-lg hover:bg-gray-700"
          aria-label="Zoom in"
        >
          <Plus 
            className="h-6 w-6 text-major-blue" 
          />
        </button>
        <button 
          onClick={() => map?.zoomOut()}
          className="w-12 h-12 flex items-center justify-center rounded-r-lg border-l border-gray-700 hover:bg-gray-700"
          aria-label="Zoom out"
        >
          <Minus 
            className="h-6 w-6 text-major-blue" 
          />
        </button>
      </div>
    </div>
  )
}