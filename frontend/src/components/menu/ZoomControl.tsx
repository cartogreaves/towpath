// src/components/menu/ZoomControl.tsx
import { useMap } from '../../contexts/MapContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../contexts/ThemeContext'

export default function ZoomControl() {
  const map = useMap()
  const { isDarkMode } = useTheme()

  return (
    <div className="absolute top-4 right-16 z-10 flex gap-2">
      <div className={`backdrop-blur-sm rounded-full shadow-lg flex items-center
        ${isDarkMode ? 'bg-gray-800' : 'bg-white/90'}`}>
        <button 
          onClick={() => map?.zoomOut()}
          className={`w-10 h-10 flex items-center justify-center rounded-l-full 
            ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="Zoom out"
        >
          <FontAwesomeIcon 
            icon={faMinus} 
            className="h-5 w-5 text-blue-600" 
          />
        </button>
        <button 
          onClick={() => map?.zoomIn()}
          className={`w-10 h-10 flex items-center justify-center rounded-r-full border-l 
            ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`}
          aria-label="Zoom in"
        >
          <FontAwesomeIcon 
            icon={faPlus} 
            className="h-5 w-5 text-blue-600" 
          />
        </button>
      </div>
    </div>
  )
}