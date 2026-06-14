/**
 * Calculate road distance between two points using the Haversine formula.
 * For production, this should use Google Maps / Mapbox routing API.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Estimate delivery time in minutes based on distance and average speed.
 */
export function estimateDeliveryTime(distanceKm: number, averageSpeedKmh = 30): number {
  return Math.ceil((distanceKm / averageSpeedKmh) * 60);
}

/**
 * Check if a point is within a GeoJSON polygon (simple ray-casting algorithm).
 */
export function isPointInPolygon(
  lat: number,
  lng: number,
  polygon: number[][][] // GeoJSON Polygon coordinates
): boolean {
  const point = [lng, lat]; // GeoJSON uses [lng, lat]
  const vs = polygon[0]; // Exterior ring
  let inside = false;

  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];

    const intersect = ((yi > point[1]) !== (yj > point[1]))
      && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}
