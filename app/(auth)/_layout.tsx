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

  const downloadAll = async (user: any) => {
    console.log('Downloading all files for user', user.id);

    try {
        const mediaPermission = await MediaLibrary.requestPermissionsAsync();
        if (mediaPermission.status !== 'granted') {
            alert('We need permission to access your media library to download files.');
            return;
        }

        const { data } = await supabase.storage.from('files').list(user.id);
        if (data && data.length > 0) {
            for (const file of data) {
                try {
                    const fileName = file.name;
                    const response = await supabase.storage.from('files').download(`${user.id}/${fileName}`);

                    if (response.data) {
                        const fileLocalUri = FileSystem.documentDirectory + encodeURIComponent(fileName);

                        const reader = new FileReader();
                        reader.onerror = (error) => {
                            console.error('FileReader error', error);
                        };
                        reader.onload = async () => {
                            if (reader.result && typeof reader.result === 'string') {
                                const base64data = reader.result.split(',')[1];
                                await FileSystem.writeAsStringAsync(fileLocalUri, base64data, { encoding: FileSystem.EncodingType.Base64 });

                                await MediaLibrary.saveToLibraryAsync(fileLocalUri);
                                console.log('File saved to media library:', fileLocalUri);
                            } else {
                                console.error('Failed to read the file or the file is not a string:', reader.result);
                            }
                        };
                        reader.onloadend = () => {
                            if (reader.error) {
                                console.error('FileReader onloadend error', reader.error);
                            }
                        };
                        reader.readAsDataURL(response.data);
                    } else {
                        console.error('Failed to download file', fileName);
                    }
                } catch (error) {
                    console.error('Error during file download or saving:', error);
                }
            }
        } else {
            console.log('No files to download for user', user.id);
        }
    } catch (error) {
        console.error('Error:', error);
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
          title: ' ',
          headerRight: () => (
            <>
              <Button onPress={signOut} title="Log Out" color={'orange'}></Button>
            </>
          ),
          headerLeft: () => (
            <>
              <Button onPress={() => downloadAll(user)} title="Download All" color={'grey'}></Button>
            </>
          ),
        }}></Stack.Screen>
    </Stack>
  );
};

export default StackLayout;
