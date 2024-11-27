import { useState, useContext } from 'react';
import TowpathHomeButton from '../components/menu/TowpathHomeButton';
import ProfileMenu from '../components/menu/ProfileMenu';
import AccountSettings from '../components/profile/AccountSettings';
import BoatSettings from '../components/profile/BoatSettings';
import { useTheme } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account');
  const { isDarkMode } = useTheme();
  const { username } = useContext(UserContext);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TowpathHomeButton />
      <ProfileMenu />
      
      {/* Main content container with padding for fixed elements */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow rounded-lg`}>
          {/* Header */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className="text-2xl font-semibold">Your Towpath Profile</h1>
          </div>

          {/* Navigation */}
          <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex -mb-px">
              {['account', 'boat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content area with scrolling */}
          <div className="p-6 overflow-y-auto">
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'boat' && <BoatSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}