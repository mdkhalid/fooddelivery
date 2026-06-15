import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../services/notification.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true, shouldShowBanner: true, shouldShowList: true }),
});

export const useNotifications = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        Notifications.getExpoPushTokenAsync().then(token => {
          notificationService.registerPushToken(token.data).catch(() => {});
        });
      }
    }).catch(() => {});
  }, [navigation]);

  return { registerPushToken: async () => {} };
};
