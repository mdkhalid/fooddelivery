import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../stores/locationStore';
import { locationService } from '../services/location.service';
import { requestLocationPermission } from '../utils/permissions';
import { LOCATION_UPDATE_INTERVAL } from '../utils/constants';

export const useLocation = () => {
  const { currentLocation, permissionGranted, isTracking, setCurrentLocation, setPermissionGranted, setIsTracking } = useLocationStore();
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      setPermissionGranted(granted);
      if (granted) {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      }
    })();
  }, []);

  const startTracking = async () => {
    if (!permissionGranted) {
      const granted = await requestLocationPermission();
      if (!granted) return;
      setPermissionGranted(true);
    }
    setIsTracking(true);
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: LOCATION_UPDATE_INTERVAL, distanceInterval: 10 },
      async (location) => {
        const coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        setCurrentLocation(coords);
        try { await locationService.updateLocation(coords.latitude, coords.longitude); } catch {}
      }
    );
  };

  const stopTracking = () => {
    watchRef.current?.remove();
    watchRef.current = null;
    setIsTracking(false);
  };

  return { currentLocation, permissionGranted, isTracking, startTracking, stopTracking };
};