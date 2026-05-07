import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { useStore } from '../store/useStore';
import { COLORS } from '../constants';

const queryClient = new QueryClient();

export default function RootLayout() {
  const loadFavorites = useStore((s) => s.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'fade',
          }}
        />
        <Toast />
      </QueryClientProvider>
    </View>
  );
}
