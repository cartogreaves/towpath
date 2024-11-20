import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ReactDOM from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { MAP_STYLES } from '../../constants/mapStyles';
import BoatMarker from '../markers/BoatMarker';

interface Boat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function BoatSettings() {
  const { isDarkMode } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  
  const [boat, setBoat] = useState<Boat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    latitude: 51.3475,
    longitude: -2.2507
  });

  const fetchBoat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/boats/my-boats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.length > 0) {
        setBoat(response.data[0]);
        setFormData({
          name: response.data[0].name,
          latitude: response.data[0].latitude,
          longitude: response.data[0].longitude
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to fetch boat'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoat();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || (!isAddingNew && !boat)) return;
    
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light,
      center: [formData.longitude, formData.latitude],
      zoom: 13,
      attributionControl: false
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    // Create marker element
    const el = document.createElement('div');
    markerElRef.current = el;
    
    // Render boat marker
    ReactDOM.render(
      <BoatMarker size={36} isDarkMode={isDarkMode} />,
      el
    );

    marker.current = new maplibregl.Marker({
      element: el,
      draggable: true
    })
      .setLngLat([formData.longitude, formData.latitude])
      .addTo(map.current);

    marker.current.on('dragend', () => {
      if (!marker.current) return;
      const lngLat = marker.current.getLngLat();
      setFormData(prev => ({
        ...prev,
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }));
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isDarkMode, isAddingNew, boat, formData.latitude, formData.longitude]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light);
    }
  }, [isDarkMode]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      latitude: 51.3475,
      longitude: -2.2507
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (boat) {
        await axios.put(
          `http://localhost:8000/boats/${boat.id}`,
          formData,
          { headers }
        );
        setMessage({ type: 'success', text: 'Boat updated successfully' });
      } else {
        await axios.post('http://localhost:8000/boats/', formData, { headers });
        setMessage({ type: 'success', text: 'Boat created successfully' });
      }

      await fetchBoat();
      setIsAddingNew(false);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to save boat'
      });
    }
  };

  const handleDelete = async (boatId: number) => {
    if (!window.confirm('Are you sure you want to delete your boat?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/boats/${boatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Boat deleted successfully' });
      setBoat(null);
      setFormData({ name: '', latitude: 51.3475, longitude: -2.2507 });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to delete boat'
      });
    }
  };

  return (
    <div className="space-y-6">
      {message.text && (
        <div 
          className={`p-4 rounded-lg ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className={`rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Boat
            </h3>
            {!isLoading && !boat && !isAddingNew && (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Register Your Boat
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className={`flex items-center justify-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">Loading...</span>
            </div>
          ) : !boat && !isAddingNew ? (
            <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No boat registered yet. Click "Register Your Boat" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {boat && !isAddingNew ? (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex-1">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {boat.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {boat.latitude.toFixed(6)}, {boat.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className={`px-3 py-1 rounded text-sm ${
                        isDarkMode
                          ? 'hover:bg-gray-600 text-gray-300'
                          : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(boat.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Boat Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter boat name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <div 
                      ref={mapContainer} 
                      className="mt-1 w-full h-64 rounded-lg overflow-hidden border border-gray-300"
                      style={{ minHeight: '256px' }}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      {boat ? 'Save Changes' : 'Register Boat'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        if (boat) {
                          setFormData({
                            name: boat.name,
                            latitude: boat.latitude,
                            longitude: boat.longitude
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}