import { MapStyleElement } from 'react-native-maps';

// N1che map theme — paper/ink palette, clear road hierarchy, no POI clutter.
// Feels like a printed city map; still fully navigable.
const mapStyle: MapStyleElement[] = [

  // ── Base ────────────────────────────────────────────────────────────────────
  { elementType: 'geometry',              stylers: [{ color: '#EDE9E0' }] },
  { elementType: 'labels.text.fill',      stylers: [{ color: '#333333' }] },
  { elementType: 'labels.text.stroke',    stylers: [{ color: '#EDE9E0' }] },

  // ── Landscape ───────────────────────────────────────────────────────────────
  { featureType: 'landscape.man_made',    elementType: 'geometry', stylers: [{ color: '#E8E2D6' }] },
  { featureType: 'landscape.natural',     elementType: 'geometry', stylers: [{ color: '#D4DCBA' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry', stylers: [{ visibility: 'off' }] },

  // ── Parks ───────────────────────────────────────────────────────────────────
  { featureType: 'poi.park',              elementType: 'geometry', stylers: [{ color: '#C8D9A8' }] },
  { featureType: 'poi.park',              elementType: 'labels.text.fill', stylers: [{ color: '#8A8680' }] },

  // ── All other POIs — off (we render our own markers) ────────────────────────
  { featureType: 'poi',                   elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.business',          elementType: 'all',    stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.attraction',        elementType: 'all',    stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical',           elementType: 'all',    stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.government',        elementType: 'all',    stylers: [{ visibility: 'off' }] },

  // ── Roads — white cuts through the cream base, hierarchy via weight ──────────
  { featureType: 'road',                  elementType: 'geometry',           stylers: [{ color: '#FAFAF8' }] },
  { featureType: 'road',                  elementType: 'geometry.stroke',    stylers: [{ color: '#D8D4CC' }] },
  { featureType: 'road',                  elementType: 'labels.text.fill',   stylers: [{ color: '#8A8680' }] },
  { featureType: 'road',                  elementType: 'labels.text.stroke', stylers: [{ color: '#EDE9E0' }] },

  { featureType: 'road.highway',          elementType: 'geometry.fill',   stylers: [{ color: '#E8D9A8' }] },
  { featureType: 'road.highway',          elementType: 'geometry.stroke', stylers: [{ color: '#D4C490' }] },
  { featureType: 'road.highway',          elementType: 'labels.text.fill', stylers: [{ color: '#5A5650' }] },

  { featureType: 'road.arterial',         elementType: 'geometry.fill',   stylers: [{ color: '#F5F2EC' }] },
  { featureType: 'road.local',            elementType: 'geometry.fill',   stylers: [{ color: '#FAFAF8' }] },

  // ── Transit — lines subtly visible, stations off ────────────────────────────
  { featureType: 'transit',              elementType: 'labels',   stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.line',         elementType: 'geometry', stylers: [{ color: '#C8C4BC' }, { lightness: 40 }] },
  { featureType: 'transit.station',      elementType: 'labels.text.fill',  stylers: [{ color: '#5A5650' }] },
  { featureType: 'transit.station',      elementType: 'labels.text.stroke', stylers: [{ color: '#EDE9E0' }] },
  { featureType: 'transit.station',      elementType: 'labels.icon',        stylers: [{ visibility: 'on' }] },

  // ── Water ───────────────────────────────────────────────────────────────────
  { featureType: 'water',                elementType: 'geometry',         stylers: [{ color: '#B0C8D4' }] },
  { featureType: 'water',                elementType: 'labels.text.fill', stylers: [{ color: '#8A8680' }] },

  // ── Administrative — keep city/borough names, hide minor boundaries ──────────
  { featureType: 'administrative',       elementType: 'geometry.stroke',        stylers: [{ color: '#C8C4BC' }, { weight: 1 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill',   stylers: [{ color: '#111111' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#8A8680' }] },
];

export default mapStyle;
