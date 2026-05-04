import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { AppNavigator } from './navigation/AppNavigator';

import { LogBox } from 'react-native';

// Ignore specific third-party deprecation warnings that are outside of our control
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'The native view manager for module',
]);

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
