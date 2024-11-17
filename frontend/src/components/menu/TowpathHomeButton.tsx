// src/components/menu/TowpathHomeButton.tsx
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

export default function TowpathHomeButton() {
  const { isDarkMode } = useTheme()

  return (
    <div className="absolute top-4 left-4 z-10">
      <Link 
        to="/"
        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center
          ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/90 hover:bg-gray-100'}`}
        aria-label="Return to home"
      >
        <span className="text-blue-600 font-bold text-2xl">T</span>
      </Link>
    </div>
  )
}