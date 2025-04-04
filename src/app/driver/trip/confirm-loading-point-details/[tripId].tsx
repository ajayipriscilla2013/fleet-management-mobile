import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Camera from "@/assets/svgs/Camera.svg";
import API from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod'; 
import * as Location from 'expo-location';
import { Modal } from 'react-native';
import ZoomedCameraComponent from '@/components/ZoomedCamera';
import { Picker } from '@react-native-picker/picker';



const LoadingPointScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  console.log("truckdriver TripID", tripId);
  

  const formSchema = z.object({
    loading_qty: z.number().min(1, "Tonnage loaded is required"),
    odometer_reading: z.number().min(1, "Odometer reading is required"),
    remarks: z.string().min(1, "Provide a remark"),
    truck_picture: z.string().min(1, "Truck picture is required"),
    dataname: z.string().default("driverLoadingPoint"),
  });

  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [formData, setFormData] = useState({
    trip_id: tripId,
    loading_qty: '',
    truck_picture: '',
    odometer_reading: '',
    remarks: '',
    latitude: "",
    longitude: "",
    dataname: 'driverLoadingPoint',
  });

   // Request location permission and get the user's location
  useEffect(() => {
      (async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          console.log("Location Permission Status:", status);
    
          if (status !== "granted") {
            Alert.alert("Permission to access location was denied");
            return;
          }
    
          let currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
    
          console.log("Current Location:", currentLocation);
          setLocation(currentLocation);
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      })();
    }, []);
  
  const [image, setImage] = useState(null);
  
  const [errors, setErrors] = useState({}); 

  const submitLoadingData = async (data) => {
    const userId = await AsyncStorage.getItem("user_id");
    const response = await API.post("trip/trip.php", {
      dataname: "driverLoadingPoint",
      driver_id: userId,
      ...data,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitLoadingData,
    onSuccess: (response) => {
      console.log("fueling required response",response);
      
     
        Alert.alert("Success", "Loading point data submitted");
        queryClient.invalidateQueries("TripInfoForDriver"); 
        queryClient.invalidateQueries("inProgressTripsForDriver");
        router.push("/driver/trip?tab=inProgress");

``
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Request Failed, Try Again";
      Alert.alert("Error", `${errorMessage}`);
     
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

 
  const handleImageCaptured = (processedImage) => {
    setImage(processedImage.uri);
    setFormData(prevData => ({
      ...prevData,
      truck_picture: processedImage.base64
    }));
  };

  const handleSubmit = async() => {
    console.log("Location at Submit:", location);
    console.log("FormData before Submit:", formData)
    if (!location) {
          let currentLocation = await Location.getCurrentPositionAsync({});
          if (currentLocation) {
            setLocation(currentLocation);
          } else {
            Alert.alert("Location not available", "Please enable location services and try again.");
            return;
          }
        }
  
    setErrors({}); // Clear errors before validating
  
    const updatedFormData = {
      ...formData,
      loading_qty: Number(formData.loading_qty) || 0,
      odometer_reading: Number(formData.odometer_reading) || 0,
      latitude: `${location?.coords.latitude}`,
      longitude: `${location?.coords.longitude}`,
    };

    console.log("Updated FormData:", updatedFormData);
  
    // Perform Zod validation
    const validation = formSchema.safeParse(updatedFormData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
  
    mutation.mutate(updatedFormData);
  };
  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      <View className="mb-4">
        <View className="flex-col justify-between">
          <View className="flex-row w-full  justify-between">
            <Text className="text-gray-600 mb-[10px]">Confirm Tonnage loaded</Text>
            {errors.loading_qty && (
              <Text className="text-red-500 text-sm">
                {errors.loading_qty}
              </Text>
            )}
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: focusedField ? "#C4CCF0" : "#D1D3D8",
              borderRadius: 8,
              paddingVertical: 2,
            }}
            className={`border bg-white rounded-md w-full  p-2 h-[60px] ${
              focusedField === formData.loading_qty
                ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
            }`}
          >
            <Picker
              selectedValue={formData.loading_qty}
              onValueChange={(itemValue) => {
                setFormData({ ...formData, loading_qty: itemValue });
                // setIsFocused(true);
              }}
              className={`border bg-white rounded-md  p-2 h-[60px] ${
                focusedField === formData.loading_qty
                  ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                  : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
              }`}
            >
              <Picker.Item label="Select Tonnage Loaded (in Tonns)" value="" />
              {[{name:"30 Tonns",value:30},{name:"45 Tons",value:45}, {name:"60 Tons",value:60}]
              
              ?.map((tonnage, index) => (
                <Picker.Item key={index} label={tonnage.name} value={tonnage.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      {[
        // { label: 'Confirm Tonnage loaded', name: 'loading_qty', placeholder: 'Enter tonnage loaded',numeric:true },
        { label: 'Remarks', name: 'remarks', placeholder: 'Enter Remarks' },
        { label: 'Odometer Reading', name: 'odometer_reading', placeholder: 'Enter Odometer Reading',numeric:true },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <View className='flex-row justify-between'>
            
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          {errors[item.name] && (
            <Text className="text-red-500">{errors[item.name]}</Text>
          )}
          </View>
          <TextInput
          keyboardType={item.numeric ? "numeric" :"default"}
           onFocus={() => setFocusedField(item.name)}
           onBlur={() => setFocusedField(null)}
           className={`border bg-white rounded-md p-2 h-[60px] ${
             focusedField === item.name
               ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
               : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
           }`}
            // className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white border-[#C4CCF0] rounded-md p-2 h-[60px]"
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
          />
         
        </View>
      ))}


      <View className='flex-row justify-between'>

      <Text className="text-gray-600 mb-[10px]">Take a Snap of Loaded Truck</Text>
      {errors.truck_picture && (
            <Text className="text-red-500">{errors.truck_picture}</Text>
          )}
      </View>

      <TouchableOpacity 
        className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4" 
        // onPress={handleImagePick}
        onPress={() => setIsCameraVisible(true)}
      >
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
                Note: You can take a snap or record a videos.
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

     
      <Modal
        visible={isCameraVisible}
        animationType="slide"
        onRequestClose={() => setIsCameraVisible(false)}
      >
        <ZoomedCameraComponent 
          onImageCaptured={handleImageCaptured} 
          onClose={() => setIsCameraVisible(false)}
        />
      </Modal>
      

  


      <TouchableOpacity 
        className="bg-[#394F91] rounded-2xl p-4 mt-6" 
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? 'Submitting...' : 'Accept Trip'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



export default LoadingPointScreen;


