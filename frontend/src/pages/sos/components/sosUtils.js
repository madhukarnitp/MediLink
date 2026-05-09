import { API_BASE_URL } from "../../../services/api";

export const EMERGENCY_NUMBER = "108";

const toRad = (value) => (value * Math.PI) / 180;

const distanceKm = (from, to) => {
  const earthRadius = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (km) => {
  if (!Number.isFinite(km)) return "Nearby";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
};

export const mapsLink = (lat, lng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

export const currentLocationLink = (location) =>
  location
    ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
    : "";

export const hospitalSearchLink = (location) =>
  location
    ? `https://www.google.com/maps/search/hospitals/@${location.lat},${location.lng},14z`
    : "https://www.google.com/maps/search/nearest+hospitals";

export async function fetchNearbyHospitals(location) {
  const response = await fetch(
    `${API_BASE_URL}/public/nearby-hospitals?lat=${encodeURIComponent(location.lat)}&lng=${encodeURIComponent(location.lng)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message =
      "Could not load nearby hospitals right now. Open Maps or Google Maps for live results.";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {}
    throw new Error(
      message,
    );
  }

  const data = await response.json();
  return Array.isArray(data.data)
    ? data.data.map((item) => ({
        ...item,
        distance:
          Number.isFinite(Number(item.distance))
            ? Number(item.distance)
            : distanceKm(location, { lat: item.lat, lng: item.lng }),
      }))
    : [];
}
