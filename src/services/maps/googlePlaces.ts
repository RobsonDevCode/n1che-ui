import axios from 'axios';
import Constants from 'expo-constants';

const PLACES_BASE      = 'https://places.googleapis.com/v1';
const AUTOCOMPLETE_BASE = 'https://maps.googleapis.com/maps/api/place';

// Earth's circumference gives ~111,320 metres per degree of latitude (constant).
// Longitude metres-per-degree shrinks with cos(lat) — applied at query time.
const METERS_PER_DEGREE = 111_320;
const PHOTO_MAX_WIDTH   = 400;

function apiKey(): string {
  return Constants.expoConfig?.extra?.googleMapsApiKey ?? '';
}

export interface BoundingBox {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

// searchNearby uses a circle (the only shape Places API v1 supports for this endpoint).
// We derive the enclosing circle from the bounding box so the caller can always think in
// viewport coords — and the backend will receive the real rectangle once live.
// TODO: swap with GET /shops/nearby?swLat=&swLng=&neLat=&neLng= once backend is live
export async function searchNearby(box: BoundingBox, count: number): Promise<PlaceResult[]> {
  const key       = apiKey();
  const centerLat = (box.swLat + box.neLat) / 2;
  const centerLng = (box.swLng + box.neLng) / 2;
  const latM      = (box.neLat - box.swLat) * METERS_PER_DEGREE / 2;
  const lngM      = (box.neLng - box.swLng) * METERS_PER_DEGREE * Math.cos(centerLat * Math.PI / 180) / 2;
  const radius    = Math.ceil(Math.sqrt(latM ** 2 + lngM ** 2));

  const { data } = await axios.post(
    `${PLACES_BASE}/places:searchNearby`,
    {
      includedTypes: ['clothing_store'],
      maxResultCount: count,
      locationRestriction: {
        circle: { center: { latitude: centerLat, longitude: centerLng }, radius },
      },
    },
    {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.shortFormattedAddress,places.photos,places.location',
      },
    },
  );

  return (data.places ?? []).map((p: any): PlaceResult => ({
    id: p.id,
    name: p.displayName?.text ?? p.id,
    address: p.shortFormattedAddress ?? '',
    latitude: p.location?.latitude ?? 0,
    longitude: p.location?.longitude ?? 0,
    // TODO: replace with `{apiBaseUrl}/photos/{ref}` once GET /photos/:ref proxy is live (key moves server-side)
    photoUrl: p.photos?.[0]?.name
      ? `${PLACES_BASE}/${p.photos[0].name}/media?maxWidthPx=${PHOTO_MAX_WIDTH}&key=${key}`
      : undefined,
  }));
}

export async function autocomplete(query: string): Promise<PlaceSuggestion[]> {
  const key = apiKey();
  const url = `${AUTOCOMPLETE_BASE}/autocomplete/json?input=${encodeURIComponent(query)}&types=geocode&key=${key}`;
  const res  = await fetch(url);
  const json = await res.json();
  if (json.status !== 'OK') return [];
  return json.predictions.map((p: any): PlaceSuggestion => ({
    description: p.description,
    placeId: p.place_id,
  }));
}
