import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const requestBackgroundLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === 'granted';
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const checkLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
};