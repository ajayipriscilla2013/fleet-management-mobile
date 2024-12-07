import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Camera from "@/assets/svgs/Camera.svg";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';
import { z } from 'zod';
import ZoomedCameraComponent from '@/components/ZoomedCamera';

const fuelEntrySchema = z.object({
  current_location: z.string().nonempty("Current location is required"),
  liters_filled: z.number().positive("Litres filled must be a positive number"),
  amount_per_liter: z.number().positive("Amount per litre must be a positive number"),
  total_amount: z.number().nonnegative("Total amount must be a non-negative number"),
  odometer_before: z.number().nonnegative("Odometer reading before must be a non-negative number"),
  odometer_after: z.number().nonnegative("Odometer reading after must be a non-negative number"),
  pump_reading_before: z.number().min(0, "Pump reading before must be a non-negative number").nonnegative("Pump reading before must be a non-negative number"),
  pump_reading_after: z.number().min(0, "Pump reading after must be a non-negative number").nonnegative("Pump reading after must be a non-negative number"),
  attendant_name: z.string().nonempty("Attendant name is required"),
});

const GetFuelScreen = () => {
  const { tripId } = useLocalSearchParams();
  console.log("tripid for fuel",tripId);

  const queryClient = useQueryClient();
  
  const router = useRouter();
  const [errors,setErrors]= useState({})
  const [imageErrors, setImageErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
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
      // router.push(`/screens/truckDriver/${tripId}`);
      queryClient.invalidateQueries("TripInfoForDriver"); 
        queryClient.invalidateQueries("inProgressTripsForDriver");
      router.push(`/screens/truckDriver?tab=inProgress/${tripId}`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Request failed, Try Again";
     console.error('Error submitting data:', error);
     Alert.alert("Error", `${errorMessage}`);
    
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };


  const handleImageCapture = (image) => {
    if (currentField) {
      setFormData((prevData) => ({ ...prevData, [currentField]: image.uri }));
      setCameraVisible(false);
    }
  };

  const openCameraForField = (field) => {
    setCurrentField(field);
    setCameraVisible(true);
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
    
    try {
    

      const parsedData = fuelEntrySchema.parse({
        ...formData,
        liters_filled: parseFloat(formData.liters_filled),
        amount_per_liter: parseFloat(formData.amount_per_liter),
        total_amount: parseFloat(formData.total_amount),
        odometer_before: parseFloat(formData.odometer_before),
        odometer_after: parseFloat(formData.odometer_after),
        pump_reading_before: parseFloat(formData.pump_reading_before),
        pump_reading_after: parseFloat(formData.pump_reading_after),
      });
 
      mutation.mutate(parsedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap = error.flatten().fieldErrors;
        setErrors(Object.fromEntries(
          Object.entries(errorMap).map(([key, value]) => [key, value[0]])
        ));
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      {[
        { label: 'Current Location', name: 'current_location', placeholder: 'Enter Current Location' },
        { label: 'Fuel Price Per Litre', name: 'amount_per_liter', placeholder: 'Enter fuel price per litre',  numeric:true},
        { label: 'Total Litres', name: 'liters_filled', placeholder: 'Enter total litres', numeric:true },
        { label: 'Total Fuel Price', name: 'total_amount', placeholder: 'Total fuel price', editable: false , numeric:true},
        { label: 'Odometer Reading Before', name: 'odometer_before', placeholder: 'Enter odometer before', numeric:true },
        { label: 'Odometer Reading After', name: 'odometer_after', placeholder: 'Enter odometer after' , numeric:true},
        { label: 'Pump Reading Before', name: 'pump_reading_before', placeholder: 'Enter pump reading before', numeric:true },
        { label: 'Pump Reading After', name: 'pump_reading_after', placeholder: 'Enter pump reading after', numeric:true },
        { label: 'Name of Fuel Attendant', name: 'attendant_name', placeholder: 'Enter name of fuel attendant' },
       
       
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <View className='flex-row justify-between'>

          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          {errors[item.name] && (
            <Text className="text-red-500">{errors[item.name]}</Text>
          )}
          </View>
          <TextInput
          onFocus={() => setFocusedField(item.name)}
          onBlur={() => setFocusedField(null)}
          className={`border bg-white rounded-md p-2 h-[60px] ${
            focusedField === item.name
              ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
              : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
          }`}
            // className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border border-[#C4CCF0] rounded-md p-2 h-[60px]"
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
            editable={item.editable !== false}
            keyboardType={item.numeric?"numeric":"default"}
          />
        </View>
      ))}

      <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
        Note: Capture the following information: Current Odometer reading at fuelling point, Picture of the Truck Dashboard (Before and after fuelling), The fuel pump (Before and after fueling) and Picture of Truck Driver and Fuel Attendant together.
      </Text>
      {/* {errors[imageType] && (
      <Text className="text-red-500 mt-2">{errors[imageType]}</Text>
    )} */}
      {[
        {label:"Attendant Picture",field:"attendant_picture"},
        {label:"Truck Tank Picture",field:"truck_tank_picture"},
        {label:"Gauge Pump Picture",field:"gauge_pump_picture"},
        {label:"Driver Picture",field:"driver_picture"},
      ].map((item,index) => (
        <>
        <Text className="text-gray-600 mb-[10px]  capitalize">Upload {item.label}</Text>
        <TouchableOpacity key={index} className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mb-4" onPress={() => openCameraForField(item.field)}>
          <View className='flex flex-col items-center'>
            {formData[item.field] ? (
              <Image source={{ uri: formData[item.field] }} style={{ width: 100, height: 100, borderRadius: 10 }} />
            ) : (
              <>
                <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>
                  <Camera className="w-6 h-6 text-blue-600 mr-2" />
                </View>
                <Text className="font-semibold">Take a Snap</Text>
                <Text className="text-center text-gray-500 text-sm mt-2">
                  {item.label}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        </>
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

      <Modal visible={cameraVisible} animationType="slide">
        <ZoomedCameraComponent
          onImageCaptured={handleImageCapture}
          onClose={() => setCameraVisible(false)}
        />
      </Modal>
    </ScrollView>
  );
};

export default GetFuelScreen;