export interface Location {
  latitude: number;
  longitude: number;
}

export const calculateDistance = (coord1: Location, coord2: Location): number => {
  const R = 6371e3;
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const isWithinRadius = (center: Location, point: Location, radiusMeters: number): boolean => {
  return calculateDistance(center, point) <= radiusMeters;
};

export const getCenter = (locations: Location[]): Location => {
  if (locations.length === 0) return { latitude: 0, longitude: 0 };
  const sum = locations.reduce(
    (acc, loc) => ({ latitude: acc.latitude + loc.latitude, longitude: acc.longitude + loc.longitude }),
    { latitude: 0, longitude: 0 }
  );
  return { latitude: sum.latitude / locations.length, longitude: sum.longitude / locations.length };
};