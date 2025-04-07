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

// Utility function to safely parse numbers
const safeParseFloat = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

// Custom refinement function to check if a value is a valid number
const isValidNumber = (val) => val !== null && !isNaN(val);

// Updated schema with more user-friendly error messages
const fuelEntrySchema = z.object({
  current_location: z.string().min(1, "Please enter your current location"),
  liters_filled: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please enter a valid number for litres filled",
      required_error: "Please enter litres filled"
    }).positive("Litres filled must be greater than zero")
  ),
  amount_per_liter: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please enter a valid price per litre",
      required_error: "Please enter price per litre"
    }).positive("Amount per litre must be greater than zero")
  ),
  total_amount: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please calculate total amount",
      required_error: "Total amount is required"
    }).nonnegative("Total amount cannot be negative")
  ),
  odometer_before: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please enter a valid odometer reading",
      required_error: "Odometer reading is required"
    }).nonnegative("Odometer reading cannot be negative")
  ),
  odometer_after: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please enter a valid odometer reading",
      required_error: "Odometer reading is required"
    }).nonnegative("Odometer reading cannot be negative")
  ),
  pump_reading_before: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please enter a valid pump reading",
      required_error: "Pump reading is required"
    }).nonnegative("Pump reading cannot be negative")
  ),
  pump_reading_after: z.preprocess(
    safeParseFloat,
    z.number({
      invalid_type_error: "Please enter a valid pump reading",
      required_error: "Pump reading is required"
    }).nonnegative("Pump reading cannot be negative")
  ),
  attendant_name: z.string().min(1, "Please enter the attendant's name"),
  attendant_picture: z.string().min(1, "Please take a picture of the attendant"),
  truck_tank_picture: z.string().min(1, "Please take a picture of the truck tank"),
  gauge_pump_picture: z.string().min(1, "Please take a picture of the gauge pump"),
  driver_picture: z.string().min(1, "Please take a picture of the driver"),
});

const GetFuelScreen = () => {
  const { tripId } = useLocalSearchParams();
  

  const queryClient = useQueryClient();
  
  const router = useRouter();
  const [errors, setErrors] = useState({});
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
    const userId = await AsyncStorage.getItem("user_id");
    const response = await API.post("trip/trip.php", {
      ...data,
      driver_id: userId
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitFuelData,
    onSuccess: () => {
      console.log('Fuel data submitted successfully');
      Alert.alert("Success", "Fuel data submitted successfully");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries("TripInfoForDriver"); 
      queryClient.invalidateQueries("inProgressTripsForDriver");
      queryClient.invalidateQueries("fuelRequestStatus"); // Add this to refresh fuel status
      router.push(`/driver/trip`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Request failed, Try Again";
      console.error('Error submitting data:', error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleInputChange = (name, value) => {
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageCapture = (image) => {
    if (currentField) {
      // Clear error for this field when user adds an image
      if (errors[currentField]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[currentField];
          return newErrors;
        });
      }
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

  const validateForm = () => {
    try {
      // Apply schema
      fuelEntrySchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = {};
        error.errors.forEach(err => {
          // Extract field name from the path
          const fieldName = err.path[0];
          formattedErrors[fieldName] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    // First validate the form
    if (validateForm()) {
      // All checks passed, submit the form
      mutation.mutate(formData);
    } else {
      // Scroll to the first error (could implement this with a ref)
      Alert.alert("Validation Error", "Please correct the highlighted fields");
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      {[
        { label: 'Current Location', name: 'current_location', placeholder: 'Enter Current Location' },
        { label: 'Fuel Price Per Litre', name: 'amount_per_liter', placeholder: 'Enter fuel price per litre', numeric: true },
        { label: 'Total Litres', name: 'liters_filled', placeholder: 'Enter total litres', numeric: true },
        { label: 'Total Fuel Price', name: 'total_amount', placeholder: 'Total fuel price', editable: false, numeric: true },
        { label: 'Odometer Reading Before', name: 'odometer_before', placeholder: 'Enter odometer before', numeric: true },
        { label: 'Odometer Reading After', name: 'odometer_after', placeholder: 'Enter odometer after', numeric: true },
        { label: 'Pump Reading Before', name: 'pump_reading_before', placeholder: 'Enter pump reading before', numeric: true },
        { label: 'Pump Reading After', name: 'pump_reading_after', placeholder: 'Enter pump reading after', numeric: true },
        { label: 'Name of Fuel Attendant', name: 'attendant_name', placeholder: 'Enter name of fuel attendant' },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <View className='flex-row justify-between'>
            <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
            {errors[item.name] && (
              <Text className="text-red-500 text-xs">{errors[item.name]}</Text>
            )}
          </View>
          <TextInput
            onFocus={() => setFocusedField(item.name)}
            onBlur={() => setFocusedField(null)}
            className={`border bg-white rounded-md p-2 h-[60px] ${
              focusedField === item.name
                ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                : errors[item.name]
                ? "border-red-500 shadow-[0px 1px 2px rgba(239,68,68,0.2)]"
                : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
            }`}
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
            editable={item.editable !== false}
            keyboardType={item.numeric ? "numeric" : "default"}
          />
        </View>
      ))}

      <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
        Note: Capture the following information: Current Odometer reading at fuelling point, Picture of the Truck Dashboard (Before and after fuelling), The fuel pump (Before and after fueling) and Picture of Truck Driver and Fuel Attendant together.
      </Text>
      
      {[
        {label: "Attendant Picture", field: "attendant_picture"},
        {label: "Truck Tank Picture", field: "truck_tank_picture"},
        {label: "Gauge Pump Picture", field: "gauge_pump_picture"},
        {label: "Driver Picture", field: "driver_picture"},
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <View className='flex-row justify-between'>
            <Text className="text-gray-600 mb-[10px] capitalize">Upload {item.label}</Text>
            {errors[item.field] && (
              <Text className="text-red-500 text-xs">{errors[item.field]}</Text>
            )}
          </View>
          <TouchableOpacity 
            className={`flex-row items-center justify-center bg-white border h-[126px] rounded-md p-4 ${
              errors[item.field] ? "border-red-500" : "border-gray-300"
            }`} 
            onPress={() => openCameraForField(item.field)}
          >
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
        </View>
      ))}

      <TouchableOpacity 
        className="bg-[#394F91] rounded-2xl p-4 mt-6 mb-8" 
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? 'Submitting...' : 'Submit Fuel Entry'}
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