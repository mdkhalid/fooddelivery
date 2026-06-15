import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { uploadService } from '../services';

export const useImagePicker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (options?: ImagePicker.ImagePickerOptions): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        ...options,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Failed to pick image:', error);
      return null;
    }
  };

  const takePhoto = async (options?: ImagePicker.ImagePickerOptions): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'We need camera access to take photos.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        ...options,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Failed to take photo:', error);
      return null;
    }
  };

  const uploadImage = async (uri: string, type: 'avatar' | 'dispute' | 'general' = 'general'): Promise<string | null> => {
    setIsLoading(true);
    try {
      const result = await uploadService.uploadImage(uri, type);
      return result.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickAndUpload = async (type: 'avatar' | 'dispute' | 'general' = 'general'): Promise<string | null> => {
    const uri = await pickImage();
    if (uri) {
      return uploadImage(uri, type);
    }
    return null;
  };

  return {
    pickImage,
    takePhoto,
    uploadImage,
    pickAndUpload,
    isLoading,
  };
};
