import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../stores/locationStore';
import { requestLocationPermission, getCurrentLocation } from '../utils/permissions';

export const useGeolocation = () => {
  const { currentLocation, setCurrentLocation } = useLocationStore();
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const requestLocation = async () => {
    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLocationError('Location permission denied');
        setIsLocationLoading(false);
        return null;
      }

      const location = await getCurrentLocation();
      if (location) {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(coords);
        setIsLocationLoading(false);
        return coords;
      }

      setLocationError('Unable to get location');
      setIsLocationLoading(false);
      return null;
    } catch (error) {
      setLocationError('Failed to get location');
      setIsLocationLoading(false);
      return null;
    }
  };

  const startWatching = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCurrentLocation(coords);
        }
      );
    } catch (error) {
      console.error('Failed to start location watching:', error);
    }
  };

  const stopWatching = () => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  return {
    currentLocation,
    isLocationLoading,
    locationError,
    requestLocation,
    startWatching,
    stopWatching,
  };
};
