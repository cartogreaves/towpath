// src/components/menu/ProfileMenu.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const isTouchDevice = useIsTouchDevice()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
    setIsOpen(false)
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className={`relative inline-block ${!isTouchDevice ? 'group' : ''}`}>
        <button 
          onClick={() => isTouchDevice && setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-white/90 shadow-lg hover:bg-gray-100 flex items-center justify-center"
          aria-label="Profile menu"
        >
          <FontAwesomeIcon 
            icon={faUser} 
            className="h-5 w-5 text-blue-600" 
          />
        </button>

        <div className={`
          absolute right-0 mt-2 w-[132px] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg py-1
          ${isTouchDevice ? isOpen ? 'block' : 'hidden' : 'hidden group-hover:block'}
        `}>
          {token ? (
            <>
              <Link 
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}