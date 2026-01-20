/**
 * Application mobile Smart Café pour les clients
 * Menu simple pour consultation après scan QR code
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen
import MenuScreen from './src/screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            title: 'SMART CAFÉ',
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 28,
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
