import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLibreSearchControl } from "@stadiamaps/maplibre-search-box";
import "@stadiamaps/maplibre-search-box/dist/style.css";

const fetchMapData = async (collectionId, apiKey) => {
    const response = await fetch(`https://api.os.uk/maps/vector/ngd/ota/v1/collections/${collectionId}/styles/3857`);
  
    if (response.ok) {
      const data = await response.json();
      data.sources[collectionId].tiles = [`${data.sources[collectionId].url}/{z}/{y}/{x}?key=${apiKey}`];
      delete data.sources[collectionId].url;
      return data;
    } else {
      throw new Error('Failed to fetch map data');
    }
  };

const Map = () => {
    const mapContainer = useRef(null);
  
    useEffect(() => {
      const apiKey = process.env.REACT_APP_OS_API_KEY;
      const collectionId = 'ngd-base'; // 'ngd-base|asu-bdy|wtr-ctch'
  
      const initializeMap = async () => {
        try {
            const control = new MapLibreSearchControl({
                onResultSelected: feature => {
                  // You can add code here to take some action when a result is selected.
                  console.log(feature.geometry.coordinates);
                },
                // You can also use our EU endpoint to keep traffic within the EU using the basePath option:
                // baseUrl: "https://api-eu.stadiamaps.com",
            });
            const mapData = await fetchMapData(collectionId, apiKey);
            
            const map = new maplibregl.Map({
              container: mapContainer.current,
              minZoom: 6,
              maxZoom: 19,
              maxBounds: [[-8.74, 49.84], [1.96, 60.9]],
              style: mapData,
              center: [-2.354940, 51.377182],
              zoom: 17,
              attributionControl: false,
            });
          
            map.dragRotate.disable();
            map.touchZoomRotate.disableRotation();
            map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
            map.addControl(control, "top-left");
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };
  
      initializeMap();
    }, []);
  
    return <div ref={mapContainer} style={{ height: '100vh' }} />;
  };

export default Map;