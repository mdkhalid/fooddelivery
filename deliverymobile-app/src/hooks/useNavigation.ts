import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useUIStore } from '../stores/uiStore';

export const useNavigation = () => {
  const { navigationApp } = useUIStore();

  const openNavigation = useCallback(async (latitude: number, longitude: number, label?: string) => {
    const destination = `${latitude},${longitude}`;
    const encodedLabel = encodeURIComponent(label || 'Destination');
    let url: string;
    switch (navigationApp) {
      case 'waze':
        url = `https://waze.com/ul?ll=${destination}&navigate=yes`;
        break;
      case 'apple_maps':
        url = `maps://app?daddr=${destination}&dirflg=d`;
        break;
      default:
        url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${encodedLabel}`;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
  }, [navigationApp]);

  return { openNavigation };
};