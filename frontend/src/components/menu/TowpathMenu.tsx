import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import FriendsMenu from './FriendsMenu'
import { UserContext } from '../../contexts/UserContext'
import { useBoat } from '../../contexts/BoatContext'

export default function TowpathMenu() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { avatar, resetUser } = useContext(UserContext);
  const { clearBoatMarker } = useBoat();

  const handleLogout = () => {
    clearBoatMarker();
    localStorage.removeItem('token');
    resetUser();
    navigate('/');
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="relative inline-block group font-ubuntu">
        {/* Header button with avatar */}
        <div className="w-56 backdrop-blur-sm rounded-lg group-hover:rounded-t-lg group-hover:rounded-b-none shadow-lg bg-component-navy transition-[border-radius] duration-200">
          <div className="px-4 py-2 flex items-center justify-between">
            <div>
              <div className="text-2xl font-medium text-major-blue">Towpath</div>
            </div>
            <div className="flex items-center justify-center text-2xl">
              <span>{token ? avatar : '👤'}</span>
            </div>
          </div>
        </div>
        
        {/* Dropdown menu content */}
        <div className="invisible group-hover:visible absolute left-0 w-full">
          <div className="w-56 backdrop-blur-sm rounded-b-lg shadow-lg overflow-hidden bg-component-navy">
            <div className="py-1 border-b border-gray-700">
            {token && (
              <Link 
                to="/profile"
                className="block px-4 py-2 text-base text-white hover:bg-gray-700"
              >
                Profile
              </Link>
            )}
            {token && <FriendsMenu />}
            </div>
            <button className="block px-4 py-2 text-base w-full text-left text-white hover:bg-gray-700">
              Facilities
            </button>
            {token ? (
              <button 
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-base text-left text-white hover:bg-gray-700 border-t border-gray-700"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className="block px-4 py-2 text-base text-white hover:bg-gray-700 border-t border-gray-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}