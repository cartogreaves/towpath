// src/pages/Profile.tsx
import { useState } from 'react'
import TowpathHomeButton from '../components/menu/TowpathHomeButton'
import ProfileMenu from '../components/menu/ProfileMenu'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <TowpathHomeButton />
      <ProfileMenu />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-20">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`${
                    activeTab === 'account'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('boat')}
                  className={`${
                    activeTab === 'boat'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
                >
                  Boat Details
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`${
                    activeTab === 'preferences'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center px-6 py-4 border-b-2 font-medium text-sm`}
                >
                  Preferences
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'account' && (
                <div>Account Content</div>
              )}
              {activeTab === 'boat' && (
                <div>Boat Details Content</div>
              )}
              {activeTab === 'preferences' && (
                <div>Preferences Content</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}