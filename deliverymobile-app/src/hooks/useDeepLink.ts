import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useDeepLink = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const path = url.replace(/.*:\/\//, '/');
      if (path.includes('/order/')) {
        const orderId = path.split('/order/')[1]?.split('?')[0];
        if (orderId) navigation.navigate('OrderDetail', { orderId });
      }
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => { if (url) handleDeepLink({ url }); });
    return () => subscription.remove();
  }, [navigation]);
};
