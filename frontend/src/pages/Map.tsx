import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import ReactDOM from 'react-dom';
import TowpathMenu from '../components/menu/TowpathMenu';
import ProfileMenu from '../components/menu/ProfileMenu';
import ZoomControl from '../components/menu/ZoomControl';
import { MapContext } from '../contexts/MapContext';
import { useTheme } from '../contexts/ThemeContext';
import BoatMarker from '../components/markers/BoatMarker';
import FriendBoatMarker from '../components/markers/FriendBoatMarker';
import { MAP_STYLES } from '../constants/mapStyles';
import { useBoat } from '../contexts/BoatContext';
import { useFriends } from '../contexts/FriendsContext';
import { addCanalsLayer } from '../utils/mapLayers';

interface Boat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface FriendBoat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  user_id: number;
  user_avatar: string;
  user_username: string;
}

const MAP_LOCATIONS = {
  DEFAULT: {
    center: [-2.2507, 51.3415],
    zoom: 15
  },
  LOGGED_IN: {
    center: [-2.2507, 51.3415],
    zoom: 15
  }
};

const BoatPopup = ({ name, isDarkMode }: { name: string; isDarkMode: boolean }) => (
  <div className={`px-3 py-1.5 rounded-full text-blue-600 font-medium text-sm ${
    isDarkMode 
      ? 'bg-gray-800/90' 
      : 'bg-white/90'
  }`}>
    {name}
  </div>
);

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const friendMarkerRefs = useRef<{ [key: number]: maplibregl.Marker }>({});
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const boatRef = useRef<Boat | null>(null);
  const { isDarkMode } = useTheme();
  const { setClearBoatMarker } = useBoat();
  const [friendBoats, setFriendBoats] = useState<FriendBoat[]>([]);
  const { setRefreshFriendBoats } = useFriends();

  const updateMarkerTheme = () => {
    if (markerElRef.current) {
      ReactDOM.render(
        <BoatMarker size={25} isDarkMode={isDarkMode} />,
        markerElRef.current
      );
    }
  };

  const createPopup = (boat: Boat) => {
    const popupEl = document.createElement('div');
    ReactDOM.render(
      <BoatPopup name={boat.name} isDarkMode={isDarkMode} />,
      popupEl
    );

    return new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
      className: 'boat-name-popup'
    }).setDOMContent(popupEl);
  };

  const createFriendPopup = (boat: FriendBoat) => {
    const popupEl = document.createElement('div');
    ReactDOM.render(
      <div className={`px-3 py-1.5 rounded-full text-blue-600 font-medium text-sm ${
        isDarkMode 
          ? 'bg-gray-800/90' 
          : 'bg-white/90'
      }`}>
        {boat.user_username}'s {boat.name}
      </div>,
      popupEl
    );

    return new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
      className: 'boat-name-popup'
    }).setDOMContent(popupEl);
  };


  const createMarker = (boat: Boat, map: maplibregl.Map) => {
    // Clean up existing marker and popup
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (popupRef.current) {
      popupRef.current.remove();
    }
  
    // Create marker element
    const el = document.createElement('div');
    markerElRef.current = el;
    
    // Create popup
    popupRef.current = createPopup(boat);
  
    // Render boat marker
    ReactDOM.render(
      <BoatMarker size={25} isDarkMode={isDarkMode} />,
      el
    );
  
    // Create and add marker to map
    markerRef.current = new maplibregl.Marker({
      element: el,
      anchor: 'center', // Add this to ensure consistent positioning
    })
      .setLngLat([boat.longitude, boat.latitude])
      .addTo(map);
  
    // Add hover events
    el.addEventListener('mouseenter', () => {
      if (popupRef.current && markerRef.current) {
        popupRef.current
          .setLngLat(markerRef.current.getLngLat())
          .addTo(map);
      }
    });
  
    el.addEventListener('mouseleave', () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    });
  };
  
  const createFriendMarker = (boat: FriendBoat, map: maplibregl.Map) => {
    // Remove existing marker if it exists
    if (friendMarkerRefs.current[boat.id]) {
      friendMarkerRefs.current[boat.id].remove();
    }
  
    const el = document.createElement('div');
    ReactDOM.render(
      <FriendBoatMarker size={25} isDarkMode={isDarkMode} avatar={boat.user_avatar} />,
      el
    );
  
    const popup = createFriendPopup(boat);
  
    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center', // Add this to ensure consistent positioning
    })
      .setLngLat([boat.longitude, boat.latitude])
      .addTo(map);
  
    // Add hover events
    el.addEventListener('mouseenter', () => {
      popup.setLngLat([boat.longitude, boat.latitude]).addTo(map);
    });
  
    el.addEventListener('mouseleave', () => {
      popup.remove();
    });
  
    friendMarkerRefs.current[boat.id] = marker;
  };

  const determineMapCenter = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return MAP_LOCATIONS.DEFAULT;
    }

    try {
      const response = await axios.get('http://localhost:8000/boats/my-boats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.length > 0) {
        const boat = response.data[0];
        return {
          center: [boat.longitude, boat.latitude],
          zoom: 15
        };
      }

      return MAP_LOCATIONS.LOGGED_IN;
    } catch (error) {
      console.error('Failed to fetch boat:', error);
      return MAP_LOCATIONS.LOGGED_IN;
    }
  };

  const fetchAndDisplayBoat = async (map: maplibregl.Map) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:8000/boats/my-boats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.length > 0) {
        const boat = response.data[0];
        boatRef.current = boat;
        createMarker(boat, map);
      }
    } catch (error) {
      console.error('Failed to fetch boat:', error);
    }
  };

  const fetchFriendBoats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !mapInstance) return;

      const response = await axios.get('http://localhost:8000/boats/friends-boats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFriendBoats(response.data);

      // Update markers for all friend boats
      Object.values(friendMarkerRefs.current).forEach(marker => marker.remove());
      friendMarkerRefs.current = {};

      response.data.forEach((boat: FriendBoat) => {
        createFriendMarker(boat, mapInstance);
      });
    } catch (error) {
      console.error('Failed to fetch friend boats:', error);
    }
  }, [mapInstance, isDarkMode]);

  // Add useEffect for refresh function
  useEffect(() => {
    setRefreshFriendBoats(() => fetchFriendBoats);
    return () => setRefreshFriendBoats(() => () => {});
  }, [fetchFriendBoats, setRefreshFriendBoats]);

  useEffect(() => {
    if (!mapInstance) return;

    const token = localStorage.getItem('token');
    if (!token) {
      clearFriendMarkers();
      return;
    }

    fetchFriendBoats();
    const interval = setInterval(fetchFriendBoats, 30000);

    return () => {
      clearInterval(interval);
      clearFriendMarkers();
    };
  }, [mapInstance, fetchFriendBoats]);

  const clearBoatMarker = () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    if (markerElRef.current) {
      ReactDOM.unmountComponentAtNode(markerElRef.current);
      markerElRef.current = null;
    }
    boatRef.current = null;
  };

  const clearFriendMarkers = () => {
    Object.values(friendMarkerRefs.current).forEach(marker => marker.remove());
    friendMarkerRefs.current = {};
    setFriendBoats([]);
  };

  useEffect(() => {
    setClearBoatMarker(() => {
      return () => {
        clearBoatMarker();
        clearFriendMarkers(); // Add this line
      };
    });
    return () => setClearBoatMarker(() => () => {});
  }, []);

  // Initial map setup
  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      const initialLocation = await determineMapCenter();
      
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light,
        center: initialLocation.center,
        zoom: initialLocation.zoom,
        attributionControl: false
      });

      map.on('load', async () => {
        // Add the canals layer first so it appears below markers
        addCanalsLayer(map);
        setMapInstance(map);
        fetchAndDisplayBoat(map);
      });
    };

    initializeMap();

    return () => {
      if (markerElRef.current) {
        ReactDOM.unmountComponentAtNode(markerElRef.current);
      }
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
      if (mapInstance) {
        mapInstance.remove();
      }
      // Clean up friend markers
      Object.values(friendMarkerRefs.current).forEach(marker => marker.remove());
      friendMarkerRefs.current = {};
    }
  }, []);

  // Fetch friend boats periodically
  useEffect(() => {
    if (!mapInstance) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      clearFriendMarkers();
      return;
    }
  
    fetchFriendBoats();
    const interval = setInterval(fetchFriendBoats, 30000);
  
    return () => {
      clearInterval(interval);
      clearFriendMarkers();
    };
  }, [mapInstance]);

  // Handle theme changes
  useEffect(() => {
    if (mapInstance) {
      
      mapInstance.setStyle(isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light);
      
      // Wait for the style to load before re-adding the canals layer
      mapInstance.once('style.load', () => {
        addCanalsLayer(mapInstance);
        updateMarkerTheme();
        
        if (boatRef.current) {
          popupRef.current?.remove();
          popupRef.current = createPopup(boatRef.current);
        }

        friendBoats.forEach(boat => {
          createFriendMarker(boat, mapInstance);
        });
      });
    }
  }, [isDarkMode]);

  return (
    <MapContext.Provider value={mapInstance}>
      <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TowpathMenu />
        <ZoomControl />
        <ProfileMenu />
        <div ref={mapContainer} className="flex-grow" />
      </div>
    </MapContext.Provider>
  );
}