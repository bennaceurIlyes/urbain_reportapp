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
]);

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
