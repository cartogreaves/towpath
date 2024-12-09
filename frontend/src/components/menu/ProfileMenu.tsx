import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useBoat } from '../../contexts/BoatContext';

export default function ProfileMenu() {
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
    <div className="absolute top-4 right-4 z-10">
      <div className="relative inline-block group">
        <button 
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-gray-800 text-white"
          aria-label="Profile menu"
        >
          <span className="text-xl">{avatar}</span>
        </button>

        <div className="invisible group-hover:visible absolute right-0 top-full pt-2">
          <div className="w-[132px] backdrop-blur-sm rounded-lg shadow-lg py-1 bg-gray-800 text-white">
            {token ? (
              <>
                <Link 
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block px-4 py-2 text-sm hover:bg-gray-700"
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