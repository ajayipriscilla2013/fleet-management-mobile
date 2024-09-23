import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import Camera from "@/assets/svgs/Camera.svg";
import API from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'YOUR_API_ENDPOINT_HERE'; // Replace with your actual API endpoint

const OffloadingPointScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    trip_id: tripId,
    offloading_qty: '',
    waybill_no: '',
    odometer_reading: '',
    product_picture: '',
    remarks: '',
    dataname: 'driverOffloadingPoint',
  });
  const [image, setImage] = useState(null);

  const submitOffloadingData = async (data) => {
    const userId = await AsyncStorage.getItem("user_id")
    const response = await API.post("trip/trip.php", 
    {
      dataname: "driverOffloadingPoint",
      driver_id:userId,
      ...data
    }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitOffloadingData,
    onSuccess: () => {
      // Handle success (e.g., show a success message, navigate to next screen)
      console.log('Offloading data submitted successfully');
      Alert.alert("Success","OffLoading point data submitted")
      // You might want to navigate to a confirmation screen or back to the main screen
      // router.push("/screens/truckDriver/confirmationScreen");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "An unknown error occurred";
    
      console.error('Error submitting data:', error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFormData(prevData => ({ ...prevData, product_picture: result.assets[0].base64 }));
    }
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      {[
        { label: 'Tonnage Offloaded', name: 'offloading_qty', placeholder: 'Enter tonnage offloaded' },
       
        { label: 'Waybill Number', name: 'waybill_no', placeholder: 'Enter waybill number' },
        { label: 'Odometer Reading', name: 'odometer_reading', placeholder: 'Enter odometer reading' },
        
        { label: 'Remarks', name: 'remarks', placeholder: 'Enter remarks' },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          <TextInput
            className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border border-[#C4CCF0] rounded-md p-2 h-[60px]"
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
          />
        </View>
      ))}

      <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 ">
        Note: Capture the following information: Current Odometer reading, Material and Waybill.
      </Text>

      <TouchableOpacity className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4" onPress={handleImagePick}>
        <View className='flex flex-col items-center'>
          {image ? (
            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
          ) : (
            <>
              <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>
                <Camera className="w-6 h-6 text-blue-600 mr-2" />
              </View>
              <Text className="font-semibold">Take a Snap</Text>
              <Text className="text-center text-gray-500 text-sm mt-2">
                Note: You can take a snap or record a video.
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-[#394F91] rounded-2xl p-4 mt-6" 
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? 'Submitting...' : 'Request to Close Trip'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OffloadingPointScreen;