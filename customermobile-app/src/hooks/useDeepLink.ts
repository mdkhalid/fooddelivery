import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useNavigation, NavigationAction } from '@react-navigation/native';

export const useDeepLink = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      const parsed = Linking.parse(url);
      const path = parsed.path;

      if (path) {
        const segments = path.split('/').filter(Boolean);
        
        if (segments[0] === 'order' && segments[1]) {
          navigation.dispatch({
            type: 'NAVIGATE',
            payload: {
              name: 'OrdersTab',
              params: {
                screen: 'OrderTracking',
                params: { orderId: segments[1] },
              },
            },
          } as NavigationAction);
        } else if (segments[0] === 'restaurant' && segments[1]) {
          navigation.dispatch({
            type: 'NAVIGATE',
            payload: {
              name: 'HomeTab',
              params: {
                screen: 'RestaurantDetail',
                params: { restaurantId: segments[1] },
              },
            },
          } as NavigationAction);
        }
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);
};
