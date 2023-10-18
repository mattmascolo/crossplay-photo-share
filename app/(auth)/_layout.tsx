import { Stack } from 'expo-router';
import { useAuth } from '../../provider/AuthProvider';
import React from 'react';
import { Button } from 'react-native';

// Simple stack layout within the authenticated area
const StackLayout = () => {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f0f0f',
        },
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        name="list"
        options={{
          headerTitle: 'My Files',
          headerRight: () => (
            <>
            <Button onPress={signOut} title="Log Out" color={'darkgreen'}></Button>
            </>
          ),
        }}></Stack.Screen>
    </Stack>
  );
};

export default StackLayout;
