import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

interface ZoomedCameraProps {
  onImageCaptured: (image: { uri: string; base64: string }) => void;
  onClose:()=>void
}

const ZoomedCameraComponent: React.FC<ZoomedCameraProps> = ({ onImageCaptured,onClose }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1
        });
        console.log(photo);
        

        // Pass the full image with base64 for backend submission
        onImageCaptured({
          uri: photo.uri, 
          base64: photo?.base64 // Full image base64 for backend
        });

        onClose()
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  // Helper function to get base64 from full image
  const getBase64FromFullImage = async (uri: string) => {
    const base64 = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return base64.base64 || '';
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={[styles.camera, { transform: [{ scale: 1.5 }] }]} // Simulate zoomed-in previe
        facing={facing}
        mode="picture"
        
      >
        <View style={styles.controlContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInnerButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.flipButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  camera: {
    flex: 1,
  },
  controlContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: 20,
    position: 'absolute',
    bottom: 200,
    left:100,
    right:100
  },
  flipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
  },
  message: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ZoomedCameraComponent;