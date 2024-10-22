import React, { useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

const ModifiedImagePicker = ({ onImageCapture }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;

  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        // Capture the full image
        const fullImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        onImageCapture(fullImage);
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        ref={cameraRef}
        preset="medium"
        zoom={0.5} // This will make the preview appear zoomed in
      >
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center', marginBottom: 20 }}
            onPress={takePicture}
          >
            <Text style={{ fontSize: 18, color: 'black' }}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default ModifiedImagePicker;