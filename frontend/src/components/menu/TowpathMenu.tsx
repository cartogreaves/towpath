import { Link } from 'react-router-dom'
import FriendsMenu from './FriendsMenu'

export default function TowpathMenu() {
  const token = localStorage.getItem('token')

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="relative inline-block group">
        <button 
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-gray-800"
          aria-label="Toggle towpath menu"
        >
          <span className="text-blue-600 font-bold text-2xl">T</span>
        </button>
        
        <div className="invisible group-hover:visible absolute left-0 top-full pt-2">
          <div className="w-56 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden bg-gray-800">
            <Link 
              to="/"
              className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
            >
              <div className="text-lg font-semibold text-blue-600">Towpath</div>
              <div className="text-[13px] font-bold text-gray-400">Community</div>
            </Link>
            <div className="py-1">
              {token && <FriendsMenu />}
              <button className="block px-4 py-2 text-sm w-full text-left text-white hover:bg-gray-700">
                Waterway Features
              </button>
              <button className="block px-4 py-2 text-sm w-full text-left text-white hover:bg-gray-700">
                Community Posts
              </button>
              <button className="block px-4 py-2 text-sm w-full text-left text-white hover:bg-gray-700">
                Boat Locations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}