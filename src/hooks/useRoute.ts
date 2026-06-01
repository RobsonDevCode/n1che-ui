import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { distanceMiles } from '../utils/geo';
import { MockShop } from '../screens/Map/mockShops';
import { RouteFilters, RouteResponse, RouteStop } from '../types/route';

// TODO: replace with GET /route?swLat=&swLng=&neLat=&neLng=&budget=&maxRouteTime=&openNow=&mode=
// Backend: ranks shops by upvotes, runs nearest-neighbour routing, returns ordered stops with legs.

const NEAR_THRESHOLD_MILES = 0.5; // within this distance → "from you" mode
const WALK_MPH = 3;               // assumed walking speed

function isNearArea(shops: MockShop[], coords: { latitude: number; longitude: number }): boolean {
  return shops.some(s => distanceMiles(coords.latitude, coords.longitude, s.latitude, s.longitude) <= NEAR_THRESHOLD_MILES);
}

function walkTime(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): string {
  const mins = Math.round((distanceMiles(a.latitude, a.longitude, b.latitude, b.longitude) / WALK_MPH) * 60);
  return `${Math.max(1, mins)} min`;
}

function walkDist(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): string {
  const mi = distanceMiles(a.latitude, a.longitude, b.latitude, b.longitude);
  return mi < 0.1 ? `${Math.round(mi * 5280)} ft` : `${mi.toFixed(1)} mi`;
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
): RouteResponse {
  let candidates = filters.openNow ? shops.filter(s => s.isOpen) : [...shops];

  // Rank by upvotes
  candidates.sort((a, b) => b.voteCount - a.voteCount);

  // Cap by time budget (roughly 20 min per stop + walk)
  const maxStops = filters.maxRouteTime
    ? Math.max(2, Math.floor(filters.maxRouteTime / 20))
    : candidates.length;
  candidates = candidates.slice(0, maxStops);

  // Determine mode
  const mode: 'you' | 'loop' = filters.mode
    ?? (coords && candidates.length > 0 && isNearArea(candidates, coords) ? 'you' : 'loop');

  // Build stops with per-leg walk times calculated from actual coordinates
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
      leg: next ? { walkTime: walkTime(shop, next), walkDist: walkDist(shop, next) } : undefined,
    };
  });

  // Totals
  const totalUpvotes = stops.reduce((s, r) => s + r.voteCount, 0);
  const dist = totalMiles(stops, mode, coords);
  const walkMins = Math.round((dist / WALK_MPH) * 60);
  const browseMin = stops.length * 15; // ~15 min per shop
  const total = walkMins + browseMin;
  const hrs = Math.floor(total / 60);
  const mins = total % 60;

  const name = mode === 'loop' ? 'THE HOT LOOP' : 'THE HOT LINE';
  const id = uuidv4();

  return {
    id,
    name,
    stops,
    estimatedRouteTime: hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`,
    totalDistanceStr:   dist < 0.1 ? `${Math.round(dist * 5280)} ft` : `${dist.toFixed(1)} mi`,
    totalUpvotes,
    mode,
  };
}

export function useRoute() {
  const [data,    setData]    = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const findRoute = useCallback(async (
    shops:   MockShop[],
    coords:  { latitude: number; longitude: number } | null,
    filters: RouteFilters,
  ) => {
    if (shops.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      // Simulate API round-trip
      await new Promise<void>(r => setTimeout(r, 600));
      setData(buildRoute(shops, coords, filters));
    } catch {
      setError('Failed to load route.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => setData(null), []);

  return { data, loading, error, findRoute, clearRoute };
}
