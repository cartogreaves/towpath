import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice'

export default function TowpathMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const isTouchDevice = useIsTouchDevice()

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className={`relative inline-block ${!isTouchDevice ? 'group' : ''}`}>
        <button 
          onClick={() => isTouchDevice && setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-white/90 shadow-lg hover:bg-gray-100 flex items-center justify-center"
          aria-label="Toggle towpath menu"
        >
          <span className="text-blue-600 font-bold text-2xl">T</span>
        </button>
        
        <div className={`
          absolute mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden
          ${isTouchDevice ? isOpen ? 'block' : 'hidden' : 'hidden group-hover:block'}
        `}>
          <Link 
            to="/"
            className="block px-4 py-2 border-b border-gray-200 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <div className="text-lg font-semibold text-blue-600">Towpath</div>
            <div className="text-[13px] font-bold text-gray-500 -mt-1 mb-1">Community</div>
          </Link>
          <div className="py-1">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Waterway Features
            </button>
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Community Posts
            </button>
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Boat Locations
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}