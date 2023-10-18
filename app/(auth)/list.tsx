import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../config/initSupabase';
import { FileObject } from '@supabase/storage-js';
import ImageItem from '../../components/ImageItem';

const list = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load user images
    loadImages();
  }, [user]);

  const loadImages = async () => {
    try {
      const { data } = await supabase.storage.from('files').list(user!.id);
      if (data) {
        setFiles(data);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
      // You can also display a user-friendly error message here
    }
  };
  
  const onSelectImages = async () => {
    try {
        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            base64: true,
            // allow videos
        };

        const result = await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled && result.assets && result.assets.length > 0) {
          for (const media of result.assets) {
              const mediaName = media.uri.split('/').pop() || '';
      
              try {
                if (media.type === 'video') {
                  // Handle video upload
                  console.log('Uploading a video:', media.uri);
                  
                  const filePath = `${user!.id}/${new Date().getTime()}.${media.uri.split('.').pop()}`;
                  const fileUri = media.uri;
              
                  // Assuming Supabase can handle URIs directly
                  await supabase.storage.from('files').upload(filePath, fileUri);
              } else if (media.type === 'image') {
                      // Handle image upload
                      console.log('Uploading an image:', media.uri);
                      
                      if (!media.base64) {
                          alert(`Error: There is a problem with the selected image ${mediaName}. Please choose another image.`);
                          continue;
                      }
      
                      const base64 = media.base64;
                      const filePath = `${user!.id}/${new Date().getTime()}.${media.uri.split('.').pop()}`;
                      const contentType = 'image/png'; // Modify as needed
                      await supabase.storage.from('files').upload(filePath, decode(base64!), { contentType });
                  } else {
                      console.error('Unsupported media type:', media.type);
                  }
              } catch (error: any) {
                  console.error('Failed to upload media:', error);
                  alert(`Error: Failed to upload ${mediaName}. Please try again.`);
                  continue;
              }
          }
      
          loadImages();
      } else if (result.canceled) {
            console.log('Image selection canceled');
        } else {
            console.error('No images selected');
        }
    } catch (error: any) {
        console.error('Failed to process images:', error);
        alert('An error occurred while processing the images. Please try again.');
    }
};







  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    supabase.storage.from('files').remove([`${user!.id}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {files.map((item, index) => (
          <ImageItem key={item.id} item={item} userId={user!.id} onRemoveImage={() => onRemoveImage(item, index)} />
        ))}
      </ScrollView>

      {/* FAB to add images */}
      <TouchableOpacity onPress={onSelectImages} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151515',
  },
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: '#2b825b',
    borderRadius: 100,
  },
});

export default list;
