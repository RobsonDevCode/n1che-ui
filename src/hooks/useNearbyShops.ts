import { useQuery } from '@tanstack/react-query';
import { searchNearby, PlaceResult, BoundingBox } from '../services/maps/googlePlaces';
import { MockShop, MOCK_SHOPS_BY_NICHE } from '../screens/Map/mockShops';

// Round to a ~110m grid so minor panning doesn't fire a new fetch
const GRID_PRECISION = 1_000;
const q = (n: number) => Math.round(n * GRID_PRECISION) / GRID_PRECISION;

export function useNearbyShops(niche: string, bounds: BoundingBox | null): MockShop[] {
  const mockTemplate = MOCK_SHOPS_BY_NICHE[niche] ?? MOCK_SHOPS_BY_NICHE.goth;

  const { data } = useQuery({
    queryKey: ['nearbyShops', niche, bounds && q(bounds.swLat), bounds && q(bounds.swLng), bounds && q(bounds.neLat), bounds && q(bounds.neLng)],
    queryFn: () => searchNearby(bounds!, 20),
    enabled: bounds != null,
    gcTime: 0,
    select: (results) =>
      results.map((p: PlaceResult, i: number): MockShop => ({
        ...mockTemplate[i % mockTemplate.length],
        id: p.id,
        name: p.name,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        photoUrl: p.photoUrl,
      })),
  });

  return data ?? [];
}
