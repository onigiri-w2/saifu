import '@/src/presentation/style';
import 'react-native-gesture-handler';

import React, { useRef } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppBootstrap } from './src/bootstrap/provider';
import RootStack from './src/presentation/navigation/root';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});
Sentry.init({
  dsn: 'https://d55cbe3a364d5b4d24040b5b1da684dc@o4506878593204224.ingest.us.sentry.io/4508290180579328',
  enabled: !__DEV__,
});

export default function App() {
  const containerRef = useRef(null);
  return (
    <AppBootstrap>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          ref={containerRef}
          onReady={() => {
            navigationIntegration.registerNavigationContainer(containerRef);
          }}
        >
          <RootStack />
        </NavigationContainer>
      </QueryClientProvider>
    </AppBootstrap>
  );
}
