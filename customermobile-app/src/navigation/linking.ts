import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fooddelivery://'],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: 'reset-password/:token',
          OtpVerification: 'otp/:phone',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: '',
              RestaurantDetail: 'restaurant/:restaurantId',
            },
          },
          OrdersTab: {
            screens: {
              OrderTracking: 'order/:orderId',
            },
          },
        },
      },
    },
  },
};
