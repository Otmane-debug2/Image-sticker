import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CameraComponent = ({ onImageTaken }) => {
  const [imageUri, setImageUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const takePicture = async () => {
    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Camera access is required to take pictures');
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        setSelectedImage(result.assets[0].uri)
        onImageTaken(result.assets[0].uri); // Send the URI to the parent component or another component
      }
  };

  return (
      <Button title="Take a Picture" onPress={takePicture} />
  );
};

export default CameraComponent;
