import { useQuery } from '@tanstack/react-query';
import { searchNearby, BoundingBox } from '../services/maps/googlePlaces';
import { mockShops } from '../mocks/shops';
import { Shop } from '../types/shop';

// Soho/West End bounding box — central enough to get a good spread of shops
const SOHO_BOX: BoundingBox = {
  swLat: 51.5078, swLng: -0.1456,
  neLat: 51.5198, neLng: -0.1336,
};

export function useSplashShops(): Shop[] {
  const { data } = useQuery({
    queryKey: ['splashShops'],
    queryFn: () => searchNearby(SOHO_BOX),
    staleTime: 1000 * 60 * 60, // 1 hour
    select: (results) =>
      results.map((p, i): Shop => ({
        ...mockShops[i % mockShops.length],
        id: p.id,
        googlePlaceId: p.id,
        name: p.name,
        address: p.address,
        photoUrl: p.photoUrl,
      })),
  });

  return data ?? mockShops;
}
