import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchNearby, PlaceResult, BoundingBox } from '../services/maps/googlePlaces';
import { MockShop, MOCK_SHOPS_BY_NICHE } from '../screens/Map/mockShops';

export function useNearbyShops(niche: string, bounds: BoundingBox | null): MockShop[] {
  const mockTemplate = MOCK_SHOPS_BY_NICHE[niche] ?? MOCK_SHOPS_BY_NICHE.goth;

  const { data } = useQuery({
    queryKey: ['nearbyShops', niche, bounds?.swLat, bounds?.swLng, bounds?.neLat, bounds?.neLng],
    queryFn: () => searchNearby(bounds!),
    enabled: bounds != null,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
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
