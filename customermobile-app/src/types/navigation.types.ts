import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  OtpVerification: { phone: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  RestaurantDetail: { restaurantId: string };
  Cart: undefined;
  Checkout: undefined;
};

export type SearchStackParamList = {
  Search: undefined;
  RestaurantDetail: { restaurantId: string };
};

export type OrdersStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: string };
  OrderTracking: { orderId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  AddressList: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  Wallet: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Settings: undefined;
  TasteProfile: undefined;
  TasteOnboarding: undefined;
  Loyalty: undefined;
  Recommendations: undefined;
  DisputeList: undefined;
  DisputeDetail: { disputeId: string };
  Invoice: { orderId: string };
  ScheduledOrders: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
