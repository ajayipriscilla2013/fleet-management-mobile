import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator, Image } from 'react-native';
import Picker from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTrucks } from '@/src/services/other';
import SuccessIcon from "@/assets/images/success.png";
import { router } from 'expo-router';

const assignDriverSchema = z.object({
  driver_id: z.string().min(1, "Driver is required"),
  truck_id: z.number().min(1, "Truck is required"),
});

const AssignDriverToTruckScreen = () => {
  const [formData, setFormData] = useState({
    driver_id: "",
    truck_id: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Fetch drivers
  const { data: driversData = [], isLoading: isDriversLoading } = useQuery({
    queryKey: ["driversforAssigning"],
    queryFn: async () => {
      const response = await API.post("trip/trip.php", {
        dataname: "getTruckDrivers",
      });
      return response.data.data;
    },
  });

  const drivers = driversData.map((driver) => ({
    label: driver.driver_name,
    value: driver.truck_driver_id,
  }));

  // Fetch trucks
  const { data: trucksData = [], isLoading: isTrucksLoading } = useQuery({
    queryKey: ["trucks"],
    queryFn: getTrucks,
  });

  const trucks = trucksData.map((truck) => ({
    label: truck.model,
    value: truck.id,
  }));

  const mutation = useMutation({
    mutationFn: async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        driver_id: formData.driver_id,
        new_truck_id: formData.truck_id,
        user_id,
        dataname: "reAssignTruckDriver"
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.error === "success") {
        // setModalVisible(true);
        Alert.alert("Assignment Successful", `driver has been assigned to truck!`)
      } else {
        Alert.alert("Assignment Unsuccessful", `Error assigning driver to truck!`);
      }
    },
    onError: (error) => {
        const errorMessage =
        error.response?.data?.message || "Request Failed, Try Again";
      console.error("Error submitting data:", error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleSubmit = () => {
    const validation = assignDriverSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    mutation.mutate();
    setErrors({});
  };

  const getPickerStyle = (fieldName) => ({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: focusedField === fieldName ? '#394F91' : '#C4CCF0',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
      backgroundColor: focusedField === fieldName ? '#F0F2FF' : 'white',
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: focusedField === fieldName ? '#394F91' : '#C4CCF0',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
      backgroundColor: focusedField === fieldName ? '#F0F2FF' : 'white',
    },
  });

  return (
    <ScrollView className="flex-1 pt-6">
      <View>
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Driver</Text>
          {errors.driver_id && (
            <Text className="mb-2 text-red-500">{errors.driver_id}</Text>
          )}
        </View>
        <View
          className={`mb-4 bg-white rounded-md p-2 h-[60px]`}
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
            paddingVertical: 2,
          }}
        >
          <Picker
            value={formData.driver_id}
            onValueChange={(value) => setFormData({ ...formData, driver_id: value })}
            items={drivers}
            placeholder={{ label: "Select Driver", value: "" }}
            style={getPickerStyle('driver_id')}
            onOpen={() => setFocusedField('driver_id')}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View>
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Truck</Text>
          {errors.truck_id && (
            <Text className="mb-2 text-red-500">{errors.truck_id}</Text>
          )}
        </View>
        <View
          className={`mb-4 bg-white rounded-md p-2 h-[60px]`}
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
            paddingVertical: 2,
          }}
        >
          <Picker
            value={formData.truck_id}
            onValueChange={(value) => setFormData({ ...formData, truck_id: value })}
            items={trucks}
            placeholder={{ label: "Select Truck", value: "" }}
            style={getPickerStyle('truck_id')}
            onOpen={() => setFocusedField('truck_id')}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <TouchableOpacity 
        className={`rounded-2xl p-4 mt-6 ${mutation.isPending ? "bg-[#8896C3]" : "bg-[#394F91]"}`}
        disabled={mutation.isPending || isDriversLoading || isTrucksLoading} 
        onPress={handleSubmit}
      >
        {mutation.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text className="text-white text-center font-semibold">Submit</Text>
        )}
      </TouchableOpacity>

      
    </ScrollView>
  );
};

export default AssignDriverToTruckScreen;