// src/components/menu/ProfileMenu.tsx
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../contexts/ThemeContext'

export default function ProfileMenu() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="relative inline-block group">
        <button 
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white/90 hover:bg-gray-100'}`}
          aria-label="Profile menu"
        >
          <FontAwesomeIcon 
            icon={faUser} 
            className="h-5 w-5 text-blue-600" 
          />
        </button>

        <div className="invisible group-hover:visible absolute right-0 top-full pt-2">
          <div className={`w-[132px] backdrop-blur-sm rounded-lg shadow-lg py-1
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white/90'}`}>
            {token ? (
              <>
                <Link 
                  to="/profile"
                  className={`block px-4 py-2 text-sm 
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  Profile
                </Link>
                <button 
                  onClick={toggleDarkMode}
                  className={`block w-full px-4 py-2 text-sm text-left
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={isDarkMode ? faSun : faMoon} 
                      className="mr-2" 
                    />
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </div>
                </button>
                <button 
                  onClick={handleLogout}
                  className={`block w-full px-4 py-2 text-sm text-left
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className={`block px-4 py-2 text-sm
                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}