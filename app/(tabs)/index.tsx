import React from 'react';
import { StatusBar } from 'react-native';
import HomeScreen from '../../src/screens/HomeScreen';  // Import your HomeScreen component

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />  {/* Display the messaging UI */}
    </>
  );
}
