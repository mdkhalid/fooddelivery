import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HistoryStackParamList } from '../types/navigation.types';
import { DeliveryHistoryScreen } from '../screens/History/DeliveryHistoryScreen';
import { DeliveryDetailScreen } from '../screens/History/DeliveryDetailScreen';

const Stack = createStackNavigator<HistoryStackParamList>();

export const HistoryStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveryHistory" component={DeliveryHistoryScreen} />
      <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
    </Stack.Navigator>
  );
};
