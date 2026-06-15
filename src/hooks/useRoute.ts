import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { distanceMiles } from '../utils/geo';
import { MockShop } from '../screens/Map/mockShops';
import { BoundingBox } from '../services/maps/googlePlaces';
import { RouteFilters, RouteResponse, RouteStop } from '../types/route';

// TODO: replace with GET /routes?swLat=&swLng=&neLat=&neLng= once backend is ready.
// Backend ranks shops by upvotes, runs nearest-neighbour routing, and returns
// multiple ordered route options with stop legs.

const NEAR_THRESHOLD_MILES = 0.5;
const WALK_MPH = 3;
const MAX_STOPS = 10;

function isNearArea(shops: MockShop[], coords: { latitude: number; longitude: number }): boolean {
  return shops.some(s => distanceMiles(coords.latitude, coords.longitude, s.latitude, s.longitude) <= NEAR_THRESHOLD_MILES);
}


function totalMiles(stops: RouteStop[], mode: 'you' | 'loop', origin: { latitude: number; longitude: number } | null): number {
  let total = 0;
  const points: { latitude: number; longitude: number }[] = [
    ...(mode === 'you' && origin ? [origin] : []),
    ...stops,
    ...(mode === 'loop' && stops.length > 0 ? [stops[0]] : []),
  ];
  for (let i = 0; i < points.length - 1; i++) {
    total += distanceMiles(points[i].latitude, points[i].longitude, points[i + 1].latitude, points[i + 1].longitude);
  }
  return total;
}

function buildRoute(
  shops: MockShop[],
  coords: { latitude: number; longitude: number } | null,
  filters: RouteFilters,
  name: string,
  tag: string,
  createdBy: string,
  userId: string,
): RouteResponse {
  let candidates = filters.openNow ? shops.filter(s => s.isOpen) : [...shops];
  candidates.sort((a, b) => b.voteCount - a.voteCount);

  const maxStops = filters.maxRouteTime
    ? Math.max(2, Math.floor(filters.maxRouteTime / 20))
    : candidates.length;
  candidates = candidates.slice(0, Math.min(maxStops, MAX_STOPS));

  const mode: 'you' | 'loop' = filters.mode
    ?? (coords && candidates.length > 0 && isNearArea(candidates, coords) ? 'you' : 'loop');

  const stops: RouteStop[] = candidates.map((shop, i) => {
    const next = candidates[i + 1];
    return {
      id:        shop.id,
      name:      shop.name,
      address:   shop.address,
      latitude:  shop.latitude,
      longitude: shop.longitude,
      voteCount: shop.voteCount,
      isOpen:    shop.isOpen,
      palIdx:    shop.palIdx,
      leg: next ? {
        distanceMeters:  Math.round(distanceMiles(shop.latitude, shop.longitude, next.latitude, next.longitude) * 1609.34),
        durationSeconds: Math.round((distanceMiles(shop.latitude, shop.longitude, next.latitude, next.longitude) / WALK_MPH) * 3600),
        polyline: [],
        steps: [],
      } : undefined,
    };
  });

  const totalUpvotes = stops.reduce((s, r) => s + r.voteCount, 0);
  const dist = totalMiles(stops, mode, coords);
  const walkMins = Math.round((dist / WALK_MPH) * 60);
  const browseMin = stops.length * 15;
  const total = walkMins + browseMin;
  const hrs = Math.floor(total / 60);
  const mins = total % 60;

  return {
    id: uuidv4(),
    name,
    tag,
    createdBy,
    userId,
    stops,
    estimatedRouteTime: hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`,
    totalDistanceStr:   dist < 0.1 ? `${Math.round(dist * 5280)} ft` : `${dist.toFixed(1)} mi`,
    totalUpvotes,
    totalMinutes: total,
    mode,
  };
}

export function buildDirectRoute(
  shop: MockShop,
  coords: { latitude: number; longitude: number } | null,
  createdBy: string,
  userId: string,
): RouteResponse {
  const dist     = coords ? distanceMiles(coords.latitude, coords.longitude, shop.latitude, shop.longitude) : 0;
  const walkMins = Math.round((dist / WALK_MPH) * 60);
  const total    = walkMins + 15;
  const hrs      = Math.floor(total / 60);
  const mins     = total % 60;

  return {
    id:                 `direct-${shop.id}`,
    name:               shop.name.toUpperCase(),
    tag:                'DIRECT',
    createdBy,
    userId,
    stops: [{
      id:        shop.id,
      name:      shop.name,
      address:   shop.address,
      latitude:  shop.latitude,
      longitude: shop.longitude,
      voteCount: shop.voteCount,
      isOpen:    shop.isOpen,
      palIdx:    shop.palIdx,
    }],
    estimatedRouteTime: hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`,
    totalDistanceStr:   dist < 0.1 ? `${Math.round(dist * 5280)} ft` : `${dist.toFixed(1)} mi`,
    totalUpvotes:       shop.voteCount,
    totalMinutes:       total,
    mode:               'you',
  };
}

export function useRoute() {
  const [suggestions, setSuggestions] = useState<RouteResponse[]>([]);
  const [data,        setData]        = useState<RouteResponse | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  // TODO: replace mock with GET /routes?swLat=&swLng=&neLat=&neLng= when backend is ready.
  // _bounds is passed now so the call signature matches the future API shape.
  const findSuggestions = useCallback(async (
    shops:     MockShop[],
    coords:    { latitude: number; longitude: number } | null,
    _bounds:   BoundingBox | null,
    createdBy: string,
    userId:    string,
  ) => {
    if (shops.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await new Promise<void>(r => setTimeout(r, 600));
      const hotLine   = buildRoute(shops, coords, {},                    'THE HOT LINE', 'TOP RATED', createdBy, userId);
      const quickHits = buildRoute(shops, coords, { maxRouteTime: 60 }, 'QUICK HITS',   'UNDER 1H',  createdBy, userId);
      const hotLoop   = buildRoute(shops, coords, { mode: 'loop' },     'THE HOT LOOP', 'LOOP',      createdBy, userId);
      setSuggestions([hotLine, quickHits, hotLoop]);
    } catch {
      setError('Failed to load routes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const beginRoute = useCallback((route: RouteResponse) => {
    setData(route);
  }, []);

  const clearRoute = useCallback(() => {
    setData(null);
    setSuggestions([]);
  }, []);

  return { suggestions, data, loading, error, findSuggestions, beginRoute, clearRoute };
}
