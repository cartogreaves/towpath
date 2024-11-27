// src/utils/mapLayers.ts
import type { Map } from 'maplibre-gl';

export const addCanalsLayer = (map: Map) => {
  map.addSource('canals', {
    type: 'vector',
    tiles: ['http://localhost:8000/features/mvt/canals/{z}/{x}/{y}'],
    maxzoom: 14
  });

  // Glow layers
  map.addLayer({
    id: 'canals-glow-wide',
    type: 'line',
    source: 'canals',
    'source-layer': 'canals',
    paint: {
      'line-color': '#4a80f5',
      'line-width': 12,
      'line-opacity': 0.1
    }
  });

  map.addLayer({
    id: 'canals-glow-medium',
    type: 'line',
    source: 'canals',
    'source-layer': 'canals',
    paint: {
      'line-color': '#4a80f5',
      'line-width': 8,
      'line-opacity': 0.15
    }
  });

  map.addLayer({
    id: 'canals-line',
    type: 'line',
    source: 'canals',
    'source-layer': 'canals',
    paint: {
      'line-color': '#4a80f5',
      'line-width': 3,
      'line-opacity': 0.8
    }
  });
};