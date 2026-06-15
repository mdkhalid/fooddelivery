import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EarningsStackParamList } from '../types/navigation.types';
import { EarningsScreen } from '../screens/Earnings/EarningsScreen';
import { PayoutHistoryScreen } from '../screens/Earnings/PayoutHistoryScreen';
import { PayoutSettingsScreen } from '../screens/Earnings/PayoutSettingsScreen';

const Stack = createStackNavigator<EarningsStackParamList>();

export const EarningsStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="PayoutHistory" component={PayoutHistoryScreen} />
      <Stack.Screen name="PayoutSettings" component={PayoutSettingsScreen} />
    </Stack.Navigator>
  );
};
