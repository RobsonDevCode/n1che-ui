const EARTH_RADIUS_MILES  = 3958.8;
const EARTH_RADIUS_METERS = 6_371_000;

export function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Returns the forward azimuth (0–360°) from point 1 to point 2.
export function computeBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const lat1R = lat1 * Math.PI / 180;
  const lat2R = lat2 * Math.PI / 180;
  const dLng  = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2R);
  const x = Math.cos(lat1R) * Math.sin(lat2R) - Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

// Returns the point reached by travelling distanceMeters along bearingDeg from lat/lng.
export function offsetPosition(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceMeters: number,
): { latitude: number; longitude: number } {
  const latR     = lat * Math.PI / 180;
  const lngR     = lng * Math.PI / 180;
  const bearingR = bearingDeg * Math.PI / 180;
  const angDist  = distanceMeters / EARTH_RADIUS_METERS;

  const lat2R = Math.asin(
    Math.sin(latR) * Math.cos(angDist) +
    Math.cos(latR) * Math.sin(angDist) * Math.cos(bearingR),
  );
  const lng2R = lngR + Math.atan2(
    Math.sin(bearingR) * Math.sin(angDist) * Math.cos(latR),
    Math.cos(angDist) - Math.sin(latR) * Math.sin(lat2R),
  );

  return { latitude: lat2R * 180 / Math.PI, longitude: lng2R * 180 / Math.PI };
}
