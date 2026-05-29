import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import { AppNavigator } from './navigation/AppNavigator';
import { LanguageProvider } from './hooks/useLanguage';
import { AlertProvider } from './context/AlertContext';

import { LogBox } from 'react-native';

// Ignore specific third-party deprecation warnings that are outside of our control
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'The native view manager for module',
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported',
]);

// Silence specific noisy library logs from printing in the developer console/terminal
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args.join(' ');
  if (
    message.includes('expo-notifications') ||
    message.includes('Expo Go') ||
    message.includes('supported in Expo Go')
  ) {
    return;
  }
  originalWarn(...args);
};

const originalError = console.error;
console.error = (...args: any[]) => {
  const message = args.join(' ');
  if (
    message.includes('expo-notifications') ||
    message.includes('remote notifications')
  ) {
    return;
  }
  originalError(...args);
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <LanguageProvider>
          <AlertProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AlertProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
