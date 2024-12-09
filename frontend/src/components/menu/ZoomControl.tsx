import { useMap } from '../../contexts/MapContext'
import { Plus, Minus } from 'lucide-react'

export default function ZoomControl() {
  const map = useMap()

  return (
    <div className="absolute top-4 right-16 z-10 flex gap-2">
      <div className="backdrop-blur-sm rounded-full shadow-lg flex items-center bg-gray-800">
        <button 
          onClick={() => map?.zoomOut()}
          className="w-10 h-10 flex items-center justify-center rounded-l-full hover:bg-gray-700"
          aria-label="Zoom out"
        >
          <Minus 
            className="h-5 w-5 text-blue-600" 
          />
        </button>
        <button 
          onClick={() => map?.zoomIn()}
          className="w-10 h-10 flex items-center justify-center rounded-r-full border-l border-gray-700 hover:bg-gray-700"
          aria-label="Zoom in"
        >
          <Plus 
            className="h-5 w-5 text-blue-600" 
          />
        </button>
      </div>
    </div>
  )
}