export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

export const getRegionForCoordinates = (
  coordinates: Coordinates[],
  padding: number = 0.01
): { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } => {
  if (coordinates.length === 0) {
    return { latitude: 0, longitude: 0, latitudeDelta: 0.1, longitudeDelta: 0.1 };
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach((coord) => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const latDelta = maxLat - minLat + padding * 2;
  const lngDelta = maxLng - minLng + padding * 2;

  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

export const isWithinRadius = (
  point: Coordinates,
  center: Coordinates,
  radiusKm: number
): boolean => {
  return calculateDistance(point, center) <= radiusKm;
};
