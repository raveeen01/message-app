import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/src/screens/HomeScreen'; // Ensure the path to HomeScreen is correct

const Stack = createStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hides the header
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
