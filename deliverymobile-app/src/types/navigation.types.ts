import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OtpVerification: { phone: string };
  DocumentUpload: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  EarningsTab: NavigatorScreenParams<EarningsStackParamList>;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  OrderDetail: { orderId: string };
  Navigation: { orderId: string; destination: 'restaurant' | 'customer' };
};

export type EarningsStackParamList = {
  Earnings: undefined;
  PayoutHistory: undefined;
  PayoutSettings: undefined;
};

export type HistoryStackParamList = {
  DeliveryHistory: undefined;
  DeliveryDetail: { deliveryId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Vehicle: undefined;
  Documents: undefined;
  Availability: undefined;
  Rating: undefined;
  Support: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
