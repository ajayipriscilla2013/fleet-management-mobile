import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImageUploaderProps {
  label: string;
  onImageSelected: (uri: string) => void;
  errorMessage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  onImageSelected,
  errorMessage,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const takePicture = async () => {
    console.log("Requesting camera permissions...");
    
    // Ask for permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    console.log("Camera permission result:", permissionResult);
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access the camera is required!");
      return;
    }

    // Open camera
    console.log("Opening camera...");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    console.log("Camera result:", result);

    if (!result.canceled && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      console.log("Selected image URI:", selectedUri);
      setImageUri(selectedUri);
      onImageSelected(selectedUri); // Pass the captured image URI back to the parent component
    } else {
      console.log("No image was selected.");
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base font-semibold mb-2">{label}</Text>
      <TouchableOpacity onPress={takePicture}>
        <View className="border p-4 rounded-lg bg-gray-100 items-center">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-gray-500">Tap to take a picture</Text>
          )}
        </View>
      </TouchableOpacity>
      {errorMessage && (
        <Text className="text-red-500 mt-2 text-sm">{errorMessage}</Text>
      )}
    </View>
  );
};