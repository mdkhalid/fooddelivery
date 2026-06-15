import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation, NavigationAction } from '@react-navigation/native';
import { notificationService } from '../services';
import { useAuthStore } from '../stores/authStore';
import { requestNotificationPermission } from '../utils/permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotifications = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuthStore();
  const notificationSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const responseSubscriptionRef = useRef<{ remove: () => void } | null>(null);

  const registerForPushNotifications = async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return null;

      const { data } = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id',
      });
      return data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  };

  const schedulePushToken = async () => {
    const token = await registerForPushNotifications();
    if (token && isAuthenticated) {
      try {
        await notificationService.registerPushToken(token);
      } catch (error) {
        console.error('Failed to register push token:', error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      schedulePushToken();
    }

    notificationSubscriptionRef.current = Notifications.addNotificationReceivedListener((notification) => {
      // Handle foreground notification
    });

    responseSubscriptionRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      
      if (data && data.orderId) {
        navigation.dispatch({
          type: 'NAVIGATE',
          payload: {
            name: 'OrdersTab',
            params: {
              screen: 'OrderTracking',
              params: { orderId: data.orderId },
            },
          },
        } as NavigationAction);
      } else if (data && data.screen) {
        navigation.dispatch({
          type: 'NAVIGATE',
          payload: {
            name: data.screen,
            params: data.params,
          },
        } as NavigationAction);
      }
    });

    return () => {
      if (notificationSubscriptionRef.current) {
        notificationSubscriptionRef.current.remove();
      }
      if (responseSubscriptionRef.current) {
        responseSubscriptionRef.current.remove();
      }
    };
  }, [isAuthenticated]);

  const sendLocalNotification = async (title: string, body: string, data?: Record<string, any>) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null,
    });
  };

  return {
    registerForPushNotifications,
    sendLocalNotification,
  };
};
