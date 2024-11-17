import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

export default function TowpathMenu() {
  const { isDarkMode } = useTheme()

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="relative inline-block group">
        <button 
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center
            ${isDarkMode ? 'bg-gray-800' : 'bg-white/90 hover:bg-gray-100'}`}
          aria-label="Toggle towpath menu"
        >
          <span className="text-blue-600 font-bold text-2xl">T</span>
        </button>
        
        <div className="invisible group-hover:visible absolute left-0 top-full pt-2">
          <div className={`w-56 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden
            ${isDarkMode ? 'bg-gray-800' : 'bg-white/90'}`}>
            <Link 
              to="/"
              className={`block px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`}
            >
              <div className="text-lg font-semibold text-blue-600">Towpath</div>
              <div className={`text-[13px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Community</div>
            </Link>
            <div className="py-1">
              <button className={`block px-4 py-2 text-sm w-full text-left
                ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                Waterway Features
              </button>
              <button className={`block px-4 py-2 text-sm w-full text-left
                ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                Community Posts
              </button>
              <button className={`block px-4 py-2 text-sm w-full text-left
                ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                Boat Locations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}