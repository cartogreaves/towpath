import { useEffect, useRef, useState } from 'react';
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
import { MAP_STYLES } from '../constants/mapStyles';
import { useBoat } from '../contexts/BoatContext';

interface Boat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
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
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const boatRef = useRef<Boat | null>(null);
  const { isDarkMode } = useTheme();
  const { setClearBoatMarker } = useBoat();

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

  useEffect(() => {
    setClearBoatMarker(() => clearBoatMarker);
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

      map.on('load', () => {
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
    }
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setStyle(isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light);
      updateMarkerTheme();
      
      // Update popup theme if it exists
      if (boatRef.current) {
        popupRef.current?.remove();
        popupRef.current = createPopup(boatRef.current);
      }
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