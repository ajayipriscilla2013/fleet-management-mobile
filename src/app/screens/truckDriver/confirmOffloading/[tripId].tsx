import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import Camera from "@/assets/svgs/Camera.svg";
import API from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import * as Location from 'expo-location';

// Define the validation schema using Zod
const offloadingSchema = z.object({
  offloading_qty: z.string().nonempty("Tonnage Offloaded is required").regex(/^[0-9]*$/, "Must be a valid number"),
  waybill_no: z.string().nonempty("Waybill Number is required"),
  odometer_reading: z.string().nonempty("Odometer Reading is required").regex(/^[0-9]*$/, "Must be a valid number"),
  remarks: z.string().optional(),
  product_picture: z.string().nonempty("Product picture is required"),
  delivery_location: z.string().nonempty("Delivery location required"),
});

const OffloadingPointScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [focusedField, setFocusedField] = useState(null);
  const [location, setLocation] = useState(null);
  const [formData, setFormData] = useState({
    trip_id: tripId,
    offloading_qty: '',
    waybill_no: '',
    odometer_reading: '',
    product_picture: '',
    odometer_picture: "",
    delivery_location: "",
    waybill_picture: '',
    lattitude: null,
    longitude: null,
    delivery_time: new Date(),
    remarks: '',

    dataname: 'driverOffloadingPoint',
  });

  // Request location permission and get the user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);
  
  const [images, setImages] = useState({
    product_picture: null,
    odometer_picture: null,
    waybill_picture: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);

  const { data: tripData, isLoading, isError } = useQuery({
    queryKey: ['thistripData', tripId],
    queryFn: async () => {
      const response = await API.post("trip/trip.php", {
        trip_id: tripId,
        dataname: "getTrip"
      });
      setFormData(prevData => ({
        ...prevData,
        delivery_location:response.data.data.destination_name
      }));
      return response.data.data.destination_name;
    },
    
  });

  const submitOffloadingData = async (data) => {
    const userId = await AsyncStorage.getItem("user_id");
    const response = await API.post("trip/trip.php", 
    {
      dataname: "driverOffloadingPoint",
      driver_id: userId,
      ...data,
      delivery_time: dayjs(data.delivery_time).format("YYYY-MM-DD HH:mm:ss")
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitOffloadingData,
    onSuccess: () => {
      Alert.alert("Success", "Offloading point data submitted");
      queryClient.invalidateQueries("TripInfoForDriver"); 
        queryClient.invalidateQueries("inProgressTripsForDriver");
      router.push(`/screens/truckDriver/${tripId}`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Request Failed, Try Again";
      Alert.alert("Error", `${errorMessage}`);
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

  const handleDeliveryTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.delivery_time;
    setShowDeliveryTimePicker(false);
    setFormData(prevData => ({ ...prevData, delivery_time: currentDate }));
  };

  const handleSubmit = async () => {
    if(location){
      // Ensure that latitude and longitude are updated before validation and mutation
      setFormData(prevData => ({
        ...prevData,
        lattitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
  
      // After updating formData, validate and submit the form
      const updatedFormData = {
        ...formData,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    try {
      setFormErrors({});
      offloadingSchema.parse(formData);
      mutation.mutate(updatedFormData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach(err => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      }
    }
  } else {
    Alert.alert('Location not available', 'Please enable location services');
  }
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      {[
        { label: 'Delivery Location', name: 'delivery_location', placeholder: 'Loading...', error: formErrors.delivery_location, editable: false },
        { label: 'Tonnage Offloaded', name: 'offloading_qty', placeholder: 'Enter tonnage offloaded', error: formErrors.offloading_qty },
        { label: 'Waybill Number', name: 'waybill_no', placeholder: 'Enter waybill number', error: formErrors.waybill_no },
        { label: 'Odometer Reading', name: 'odometer_reading', placeholder: 'Enter odometer reading', error: formErrors.odometer_reading },
        { label: 'Remarks', name: 'remarks', placeholder: 'Enter remarks', error: formErrors.remarks },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          <TextInput
            onFocus={() => setFocusedField(item.name)}
            onBlur={() => setFocusedField(null)}
            className={`border bg-white rounded-md p-2 h-[60px] ${
              focusedField === item.name
                ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
            }`}
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
            editable={item.editable !== false}
          />
          {item.error && <Text className="text-red-500 text-sm">{item.error}</Text>}
        </View>
      ))}

      <View className="mb-4">
        <Text className="text-gray-600 mb-[10px]">Delivered On</Text>
        <TouchableOpacity
          // onPress={() => setShowDeliveryTimePicker(true)}
          className={`border bg-white rounded-md p-2 h-[60px] justify-center ${
            focusedField === 'delivery_time'
              ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
              : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
          }`}
        >
          <Text>{dayjs(formData.delivery_time).format("LL")}</Text>
        </TouchableOpacity>
        {formErrors.delivery_time && <Text className="text-red-500 text-sm">{formErrors.delivery_time}</Text>}
      </View>

      {showDeliveryTimePicker && (
        <DateTimePicker
          value={formData.delivery_time}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDeliveryTimeChange}
        />
      )}

<Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
        Note: Capture the following information: Current Odometer reading at fuelling point, Picture of the Truck Dashboard (Before and after fuelling), The fuel pump (Before and after fueling) and Picture of Truck Driver and Fuel Attendant together.
      </Text>

      {['product_picture', 'waybill_picture', 'odometer_picture'].map((imageType, index) => (
        <>
         <Text className="text-gray-600 mb-[10px] capitalize">Upload {imageType.replace('_', ' ')}</Text>
        <TouchableOpacity key={index} className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mb-4"
          onPress={() => handleImagePick(imageType)}
        >
          {images[imageType] ? (
            <Image
              source={{ uri: images[imageType] }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          ) : (
            <View className="flex items-center">
               <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>
                  <Camera className="w-6 h-6 text-blue-600 mr-2" />
                </View>
                <Text className="font-semibold">Take a Snap</Text>
              <Text className="text-gray-500">Upload {imageType.replace('_', ' ')}</Text>
            </View>
          )}
        </TouchableOpacity>
        </>
      ))}

      <TouchableOpacity onPress={handleSubmit} className="bg-[#394F91] h-[60px] rounded-md flex items-center justify-center">
        <Text className="text-white text-lg font-semibold">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OffloadingPointScreen;