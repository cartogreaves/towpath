import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import ReactDOM from 'react-dom';
import TowpathMenu from '../components/menu/TowpathMenu';
import ZoomControl from '../components/menu/ZoomControl';
import { MapContext } from '../contexts/MapContext';
import BoatMarker from '../components/markers/BoatMarker';
import FriendBoatMarker from '../components/markers/FriendBoatMarker';
import { MAP_STYLE, MAPBOX_ACCESS_TOKEN } from '../constants/mapConfig';
import { useBoat } from '../contexts/BoatContext';
import { useFriends } from '../contexts/FriendsContext';
import { addCanalsLayer } from '../utils/mapLayers';
import InfoPill from '../components/features/InfoPill';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface SelectedFeature {
  id: number;
  type: string;
  properties: {
    name?: string;
    region?: string;
    sap_canal_code?: string;
    sap_nav_status?: string;
    [key: string]: any;
  };
  geometry: any;
}

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

const BoatPopup = ({ name }: { name: string }) => (
  <div className="px-3 py-1.5 rounded-full text-blue-600 font-medium text-sm bg-gray-800/90">
    {name}
  </div>
);

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const friendMarkerRefs = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const boatRef = useRef<Boat | null>(null);
  const { setClearBoatMarker } = useBoat();
  const [friendBoats, setFriendBoats] = useState<FriendBoat[]>([]);
  const { setRefreshFriendBoats } = useFriends();
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  const setupFeatureInteractions = useCallback((map: mapboxgl.Map) => {
    map.on('click', 'canals-line', (e) => {
      if (e.features && e.features.length > 0) {
        setSelectedFeature(e.features[0] as SelectedFeature);
      }
    });

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['canals-line']
      });
      if (features.length === 0) {
        setSelectedFeature(null);
      }
    });

    map.on('mouseenter', 'canals-line', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'canals-line', () => {
      map.getCanvas().style.cursor = '';
    });
  }, []);

  const createPopup = (boat: Boat) => {
    const popupEl = document.createElement('div');
    ReactDOM.render(
      <BoatPopup name={boat.name} />,
      popupEl
    );

    return new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
      className: 'boat-name-popup'
    }).setDOMContent(popupEl);
  };

  const createFriendPopup = (boat: FriendBoat) => {
    const popupEl = document.createElement('div');
    ReactDOM.render(
      <div className="px-3 py-1.5 rounded-full text-blue-600 font-medium text-sm bg-gray-800/90">
        {boat.user_username}'s {boat.name}
      </div>,
      popupEl
    );

    return new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20],
      className: 'boat-name-popup'
    }).setDOMContent(popupEl);
  };

  const createMarker = (boat: Boat, map: mapboxgl.Map) => {
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (popupRef.current) {
      popupRef.current.remove();
    }
  
    const el = document.createElement('div');
    markerElRef.current = el;
    
    popupRef.current = createPopup(boat);
  
    ReactDOM.render(
      <BoatMarker size={25} />,
      el
    );
  
    markerRef.current = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([boat.longitude, boat.latitude])
      .addTo(map);
  
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
  
  const createFriendMarker = (boat: FriendBoat, map: mapboxgl.Map) => {
    if (friendMarkerRefs.current[boat.id]) {
      friendMarkerRefs.current[boat.id].remove();
    }
  
    const el = document.createElement('div');
    ReactDOM.render(
      <FriendBoatMarker size={25} avatar={boat.user_avatar} />,
      el
    );
  
    const popup = createFriendPopup(boat);
  
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([boat.longitude, boat.latitude])
      .addTo(map);
  
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

  const fetchAndDisplayBoat = async (map: mapboxgl.Map) => {
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

      Object.values(friendMarkerRefs.current).forEach(marker => marker.remove());
      friendMarkerRefs.current = {};

      response.data.forEach((boat: FriendBoat) => {
        createFriendMarker(boat, mapInstance);
      });
    } catch (error) {
      console.error('Failed to fetch friend boats:', error);
    }
  }, [mapInstance]);

  useEffect(() => {
    setRefreshFriendBoats(() => fetchFriendBoats);
    return () => setRefreshFriendBoats(() => () => {});
  }, [fetchFriendBoats, setRefreshFriendBoats]);

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
        clearFriendMarkers();
      };
    });
    return () => setClearBoatMarker(() => () => {});
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      const initialLocation = await determineMapCenter();
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: initialLocation.center,
        zoom: initialLocation.zoom,
        attributionControl: false
      });

      map.on('load', async () => {
        addCanalsLayer(map);
        setupFeatureInteractions(map);
        setMapInstance(map);
        fetchAndDisplayBoat(map);
      });
    };

    initializeMap();

    return () => {
      setSelectedFeature(null);

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
      Object.values(friendMarkerRefs.current).forEach(marker => marker.remove());
      friendMarkerRefs.current = {};
    }
  }, []);

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

  return (
    <MapContext.Provider value={mapInstance}>
      <div className="h-screen flex flex-col bg-gray-900">
        {selectedFeature && (
          <InfoPill 
            title={selectedFeature.properties.name || 'Canal'}
            feature={selectedFeature}
          />
        )}
        <TowpathMenu />
        <ZoomControl />
        <div ref={mapContainer} className="flex-grow" />
      </div>
    </MapContext.Provider>
  );
}