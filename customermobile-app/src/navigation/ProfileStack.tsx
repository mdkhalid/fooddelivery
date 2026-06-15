import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from '../types/navigation.types';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { AddressListScreen } from '../screens/Profile/AddressListScreen';
import { AddAddressScreen } from '../screens/Profile/AddAddressScreen';
import { WalletScreen } from '../screens/Profile/WalletScreen';
import { FavoritesScreen } from '../screens/Profile/FavoritesScreen';
import { NotificationsScreen } from '../screens/Profile/NotificationsScreen';
import { SettingsScreen } from '../screens/Profile/SettingsScreen';
import { TasteProfileScreen } from '../screens/Profile/TasteProfileScreen';
import { TasteOnboardingScreen } from '../screens/Profile/TasteOnboardingScreen';
import { LoyaltyScreen } from '../screens/Profile/LoyaltyScreen';
import { RecommendationsScreen } from '../screens/Profile/RecommendationsScreen';
import { DisputeListScreen } from '../screens/Profile/DisputeListScreen';
import { DisputeDetailScreen } from '../screens/Profile/DisputeDetailScreen';
import { InvoiceScreen } from '../screens/Profile/InvoiceScreen';
import { ScheduledOrdersScreen } from '../screens/Profile/ScheduledOrdersScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TasteProfile" component={TasteProfileScreen} />
      <Stack.Screen name="TasteOnboarding" component={TasteOnboardingScreen} />
      <Stack.Screen name="Loyalty" component={LoyaltyScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="DisputeList" component={DisputeListScreen} />
      <Stack.Screen name="DisputeDetail" component={DisputeDetailScreen} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} />
      <Stack.Screen name="ScheduledOrders" component={ScheduledOrdersScreen} />
    </Stack.Navigator>
  );
};
