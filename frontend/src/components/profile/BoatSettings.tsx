import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from '../../contexts/ThemeContext';
import { MAP_STYLES } from '../../constants/mapStyles';

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
  
  const [boats, setBoats] = useState<Boat[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    latitude: 51.3475,
    longitude: -2.2507
  });

  const fetchBoats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/boats/my-boats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBoats(response.data);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to fetch boats'
      });
    }
  };

  useEffect(() => {
    fetchBoats();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || (!isAddingNew && !selectedBoat)) return;

    console.log('Initializing map...');
    
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

    marker.current = new maplibregl.Marker({
      color: '#3b82f6',
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
  }, [isDarkMode, isAddingNew, selectedBoat, formData.latitude, formData.longitude]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light);
    }
  }, [isDarkMode]);

  const handleSelectBoat = (boat: Boat) => {
    setSelectedBoat(boat);
    setIsAddingNew(false);
    setFormData({
      name: boat.name,
      latitude: boat.latitude,
      longitude: boat.longitude
    });

    if (map.current && marker.current) {
      map.current.setCenter([boat.longitude, boat.latitude]);
      marker.current.setLngLat([boat.longitude, boat.latitude]);
    }
  };

  const handleAddNew = () => {
    setSelectedBoat(null);
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

      if (selectedBoat) {
        await axios.put(
          `http://localhost:8000/boats/${selectedBoat.id}`,
          formData,
          { headers }
        );
        setMessage({ type: 'success', text: 'Boat updated successfully' });
      } else {
        await axios.post('http://localhost:8000/boats/', formData, { headers });
        setMessage({ type: 'success', text: 'Boat created successfully' });
      }

      await fetchBoats();
      setIsAddingNew(false);
      setSelectedBoat(null);
      setFormData({ name: '', latitude: 51.3475, longitude: -2.2507 });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to save boat'
      });
    }
  };

  const handleDelete = async (boatId: number) => {
    if (!window.confirm('Are you sure you want to delete this boat?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/boats/${boatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Boat deleted successfully' });
      await fetchBoats();
      
      if (selectedBoat?.id === boatId) {
        setSelectedBoat(null);
        setFormData({ name: '', latitude: 51.3475, longitude: -2.2507 });
      }
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
              Your Boats
            </h3>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add New Boat
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {boats.length === 0 ? (
              <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No boats added yet. Click "Add New Boat" to get started.
              </p>
            ) : (
              boats.map(boat => (
                <div
                  key={boat.id}
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    selectedBoat?.id === boat.id
                      ? isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                      : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {boat.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {boat.latitude.toFixed(6)}, {boat.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectBoat(boat)}
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
              ))
            )}
          </div>
        </div>
      </div>

      {(isAddingNew || selectedBoat) && (
        <div className={`rounded-lg shadow p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedBoat ? 'Edit Boat' : 'Add New Boat'}
          </h3>
          
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
              <div className="mt-2 grid grid-cols-2 gap-4">
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                {selectedBoat ? 'Save Changes' : 'Add Boat'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setSelectedBoat(null);
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
        </div>
      )}
    </div>
  );
}