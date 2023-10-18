import { Stack } from 'expo-router';
import { useAuth } from '../../provider/AuthProvider';
import React from 'react';
import { Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../config/initSupabase';
import * as MediaLibrary from 'expo-media-library';


// Simple stack layout within the authenticated area
const StackLayout = () => {
  const { signOut } = useAuth();
  const { user } = useAuth();

  const downloadAll = async () => {
    console.log('Downloading all files');

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status !== 'granted') {
        alert('We need permission to access your media library to download files.');
        return;
    }

    try {
        const { data } = await supabase.storage.from('files').list(user!.id); // Adjust as per your context

        if (data && data.length > 0) {
            for (const file of data) {
                try {
                    const fileName = file.name;
                    const response = await supabase.storage.from('files').getPublicUrl(fileName);

                    if (response.data && response.data.publicUrl) {
                        const fileUri = response.data.publicUrl;
                        const fileLocalUri = FileSystem.documentDirectory + encodeURIComponent(fileName);

                        const { uri } = await FileSystem.downloadAsync(fileUri, fileLocalUri);
                        console.log('Downloaded file to', uri);

                        const fileInfo = await FileSystem.getInfoAsync(uri);
                        if (fileInfo.exists) {
                            await MediaLibrary.saveToLibraryAsync(uri);
                            console.log('File saved to media library');
                        } else {
                            console.error('File does not exist:', uri);
                        }
                    } else {
                        console.error('Failed to get public URL for file', fileName);
                    }
                } catch (error) {
                    console.error('Error during file download or saving:', error);
                }
            }
        } else {
            console.log('No files to download');
        }
    } catch (error) {
        console.error('Failed to download files:', error);
    }
};



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
          headerLeft: () => (
            <>
              <Button onPress={downloadAll} title="Download All" color={'darkgreen'}></Button>
            </>
          ),
        }}></Stack.Screen>
    </Stack>
  );
};

export default StackLayout;
