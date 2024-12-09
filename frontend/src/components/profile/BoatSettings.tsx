import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import ReactDOM from 'react-dom';
import { MAP_STYLE } from '../../constants/mapStyles';
import BoatMarker from '../markers/BoatMarker';
import { addCanalsLayer } from '../../utils/mapLayers';

interface Boat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  share_location_with_friends: boolean;
}

export default function BoatSettings() {
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
    longitude: -2.2507,
    share_location_with_friends: false
  });

  const fetchBoat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:8000/boats/my-boats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.length > 0) {
        setBoat(response.data[0]);
        setFormData({
          name: response.data[0].name,
          latitude: response.data[0].latitude,
          longitude: response.data[0].longitude,
          share_location_with_friends: response.data[0].share_location_with_friends
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
      style: MAP_STYLE,
      center: [formData.longitude, formData.latitude],
      zoom: 15,
      attributionControl: false
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    map.current.on('load', async () => {
      addCanalsLayer(map.current!);

      const el = document.createElement('div');
      markerElRef.current = el;
      
      ReactDOM.render(
        <BoatMarker size={36} />,
        el
      );

      marker.current = new maplibregl.Marker({
        element: el,
        draggable: true
      })
        .setLngLat([formData.longitude, formData.latitude])
        .addTo(map.current!);

      marker.current.on('dragend', () => {
        if (!marker.current) return;
        const lngLat = marker.current.getLngLat();
        setFormData(prev => ({
          ...prev,
          latitude: lngLat.lat,
          longitude: lngLat.lng
        }));
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isAddingNew, boat, formData.latitude, formData.longitude]);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      latitude: 51.3475,
      longitude: -2.2507,
      share_location_with_friends: false
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
      setFormData({ 
        name: '', 
        latitude: 51.3475, 
        longitude: -2.2507,
        share_location_with_friends: false 
      });
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
        <div className={`p-4 rounded-lg ${
          message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {message.text}
        </div>
      )}

      <div className="rounded-lg shadow bg-gray-800">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">
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
            <div className="flex items-center justify-center py-8 text-gray-400">
              <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">Loading...</span>
            </div>
          ) : !boat && !isAddingNew ? (
            <p className="text-center text-gray-400">
              No boat registered yet. Click "Register Your Boat" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {boat && !isAddingNew ? (
                <div className="p-4 rounded-lg bg-gray-700/50">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">
                      {boat.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {boat.latitude.toFixed(6)}, {boat.longitude.toFixed(6)}
                    </p>
                    <p className="text-sm mt-2 text-gray-400">
                      Location sharing with friends: {boat.share_location_with_friends ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="px-3 py-1 rounded text-sm hover:bg-gray-600 text-gray-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(boat.id)}
                      className="px-3 py-1 text-sm text-red-500 hover:bg-red-500/10 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200">
                      Boat Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md shadow-sm p-2
                        bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Enter boat name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200">
                      Location
                    </label>
                    <div 
                      ref={mapContainer} 
                      className="mt-1 w-full h-64 rounded-lg overflow-hidden border border-gray-600"
                      style={{ minHeight: '256px' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <button
                        role="switch"
                        aria-checked={formData.share_location_with_friends}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          share_location_with_friends: !prev.share_location_with_friends
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                          formData.share_location_with_friends ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.share_location_with_friends ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <label className="text-sm font-medium text-gray-200">
                        Share boat location with friends
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">
                      By enabling this option, you agree to share your boat's location with your accepted friends on Towpath.
                      You can disable this at any time.
                    </p>
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
                            longitude: boat.longitude,
                            share_location_with_friends: boat.share_location_with_friends
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600"
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