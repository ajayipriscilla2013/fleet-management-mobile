import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Camera from "@/assets/svgs/Camera.svg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';


const GetFuelScreen = () => {
  const { tripId } = useLocalSearchParams();
  console.log("tripid for fuel",tripId);
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    trip_id: tripId,
    current_location: '',
    liters_filled: '',
    amount_per_liter: '',
    total_amount: '',
    odometer_before: '',
    odometer_after: '',
    pump_reading_before: '',
    pump_reading_after: '',
    attendant_name: '',
    attendant_picture: '',
    truck_tank_picture: '',
    gauge_pump_picture: '',
    driver_picture: '',
    driver_id: '', 
    dataname: 'makeFuelEntry',
   
  });
  const [images, setImages] = useState({
    attendant_picture: null,
    truck_tank_picture: null,
    gauge_pump_picture: null,
    driver_picture: null,
  });

  const submitFuelData = async (data) => {
    const userId= await AsyncStorage.getItem("user_id")
    const response = await API.post("trip/trip.php",{
        ...data,
        driver_id:userId
    } );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitFuelData,
    onSuccess: () => {
      console.log('Fuel data submitted successfully');
      Alert.alert("Success","Fuel data submitted successfully")
      // Navigate to next screen or show success message
      // router.push("/screens/truckDriver/fuelConfirmation");
    },
    onError: (error) => {
      console.error('Error submitting fuel data:', error);
      Alert.alert("Ooops","Something happened")
      // Show error message to user
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImagePick = async (imageType) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImages(prevImages => ({ ...prevImages, [imageType]: result.assets[0].uri }));
      setFormData(prevData => ({ ...prevData, [imageType]: result.assets[0].base64 }));
    }
  };

  const calculateTotalAmount = () => {
    const liters = parseFloat(formData.liters_filled) || 0;
    const pricePerLiter = parseFloat(formData.amount_per_liter) || 0;
    const total = liters * pricePerLiter;
    setFormData(prevData => ({ ...prevData, total_amount: total.toFixed(2) }));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [formData.liters_filled, formData.amount_per_liter]);

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      {[
        { label: 'Current Location', name: 'current_location', placeholder: 'Enter Current Location' },
        { label: 'Fuel Price Per Litre', name: 'amount_per_liter', placeholder: 'Enter fuel price per litre' },
        { label: 'Total Litres', name: 'liters_filled', placeholder: 'Enter total litres' },
        { label: 'Total Fuel Price', name: 'total_amount', placeholder: 'Total fuel price', editable: false },
        { label: 'Odometer Reading Before', name: 'odometer_before', placeholder: 'Enter odometer before' },
        { label: 'Odometer Reading After', name: 'odometer_after', placeholder: 'Enter odometer after' },
        { label: 'Pump Reading Before', name: 'pump_reading_before', placeholder: 'Enter pump reading before' },
        { label: 'Pump Reading After', name: 'pump_reading_after', placeholder: 'Enter pump reading after' },
        { label: 'Name of Fuel Attendant', name: 'attendant_name', placeholder: 'Enter name of fuel attendant' },
       
       
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          <TextInput
            className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border border-[#C4CCF0] rounded-md p-2 h-[60px]"
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
            editable={item.editable !== false}
          />
        </View>
      ))}

      <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
        Note: Capture the following information: Current Odometer reading at fuelling point, Picture of the Truck Dashboard (Before and after fuelling), The fuel pump (Before and after fueling) and Picture of Truck Driver and Fuel Attendant together.
      </Text>

      {['attendant_picture', 'truck_tank_picture', 'gauge_pump_picture', 'driver_picture'].map((imageType) => (
        <TouchableOpacity key={imageType} className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4" onPress={() => handleImagePick(imageType)}>
          <View className='flex flex-col items-center'>
            {images[imageType] ? (
              <Image source={{ uri: images[imageType] }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            ) : (
              <>
                <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>
                  <Camera className="w-6 h-6 text-blue-600 mr-2" />
                </View>
                <Text className="font-semibold">Take a Snap</Text>
                <Text className="text-center text-gray-500 text-sm mt-2">
                  {imageType.replace('_', ' ').charAt(0).toUpperCase() + imageType.replace('_', ' ').slice(1)}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        className="bg-[#394F91] rounded-2xl p-4 mt-6" 
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? 'Submitting...' : 'Get Fuel'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GetFuelScreen;