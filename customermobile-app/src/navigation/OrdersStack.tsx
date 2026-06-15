import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OrdersStackParamList } from '../types/navigation.types';
import { OrderListScreen } from '../screens/Orders/OrderListScreen';
import { OrderDetailScreen } from '../screens/Orders/OrderDetailScreen';
import { OrderTrackingScreen } from '../screens/Orders/OrderTrackingScreen';

const Stack = createStackNavigator<OrdersStackParamList>();

export const OrdersStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
};
