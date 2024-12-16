import { useState } from 'react';
import TowpathHomeButton from '../components/menu/TowpathHomeButton';
import AccountSettings from '../components/profile/AccountSettings';
import BoatSettings from '../components/profile/BoatSettings';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen bg-gray-900">
      <TowpathHomeButton />
      
      {/* Main content container with padding for fixed elements */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-800 text-white shadow rounded-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-semibold">Your Towpath Profile</h1>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px">
              {['account', 'boat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
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