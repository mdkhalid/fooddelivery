import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchStackParamList } from '../types/navigation.types';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { RestaurantDetailScreen } from '../screens/Restaurant/RestaurantDetailScreen';

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
    </Stack.Navigator>
  );
};
