import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTrucks } from '@/src/services/other';

const assignDriverSchema = z.object({
  driver_id: z.string().min(1, "Driver is required"),
  truck_id: z.number().min(1, "Truck is required"),
});

const AssignDriverToTruckScreen = () => {
  const [formData, setFormData] = useState({ driver_id: '', truck_id: '' });
  const [errors, setErrors] = useState({});

  const { data: driversData = [], isLoading: isDriversLoading } = useQuery({
    queryKey: ['driversforAssigning'],
    queryFn: async () => {
      const response = await API.post('trip/trip.php', { dataname: 'getTruckDrivers' });
      return response.data.data;
    },
  });

  const drivers = driversData.map(driver => ({ label: driver.driver_name, value: driver.truck_driver_id }));

  const { data: trucksData = [], isLoading: isTrucksLoading } = useQuery({
    queryKey: ['trucks'],
    queryFn: getTrucks,
  });

  const trucks = trucksData.map(truck => ({ label: truck.model, value: truck.id }));

  const mutation = useMutation({
    mutationFn: async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      const response = await API.post('trip/trip.php', {
        driver_id: formData.driver_id,
        new_truck_id: formData.truck_id,
        user_id,
        dataname: 'reAssignTruckDriver',
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.error === 'success') {
        Alert.alert('Assignment Successful', 'Driver has been assigned to truck!');
      } else {
        Alert.alert('Assignment Unsuccessful', 'Error assigning driver to truck!');
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Request Failed, Try Again';
      Alert.alert('Error', errorMessage);
    },
  });

  const handleSubmit = () => {
    const validation = assignDriverSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    mutation.mutate();
    setErrors({});
  };

  return (
    <ScrollView className="flex-1 pt-6">
      <View>
        <Text className="text-gray-600 mb-[10px]">Driver</Text>
        {errors.driver_id && <Text className="mb-2 text-red-500">{errors.driver_id}</Text>}
        <View className="mb-4 bg-white rounded-md p-2 h-[60px] border border-[#C4CCF0]">
          <Picker
            selectedValue={formData.driver_id}
            onValueChange={(value) => setFormData({ ...formData, driver_id: value })}
          >
            <Picker.Item label="Select Driver" value="" />
            {drivers.map(driver => (
              <Picker.Item key={driver.value} label={driver.label} value={driver.value} />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Truck</Text>
        {errors.truck_id && <Text className="mb-2 text-red-500">{errors.truck_id}</Text>}
        <View className="mb-4 bg-white rounded-md p-2 h-[60px] border border-[#C4CCF0]">
          <Picker
            selectedValue={formData.truck_id}
            onValueChange={(value) => setFormData({ ...formData, truck_id: value })}
          >
            <Picker.Item label="Select Truck" value="" />
            {trucks.map(truck => (
              <Picker.Item key={truck.value} label={truck.label} value={truck.value} />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity 
        className={`rounded-2xl p-4 mt-6 ${mutation.isPending ? 'bg-[#8896C3]' : 'bg-[#394F91]'}`}
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
