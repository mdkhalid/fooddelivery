import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from '../types/navigation.types';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { VehicleScreen } from '../screens/Profile/VehicleScreen';
import { DocumentsScreen } from '../screens/Profile/DocumentsScreen';
import { AvailabilityScreen } from '../screens/Profile/AvailabilityScreen';
import { RatingScreen } from '../screens/Profile/RatingScreen';
import { SupportScreen } from '../screens/Profile/SupportScreen';
import { SettingsScreen } from '../screens/Profile/SettingsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Vehicle" component={VehicleScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
