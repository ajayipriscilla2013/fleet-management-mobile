import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import Picker from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';
import { z } from 'zod';
import SuccessIcon from "@/assets/images/success.png";

const assignDriverSchema = z.object({
  truck_driver_id: z.string().min(1, "Truck Driver is required"),
  trip_id: z.string().min(1, "Trip is required"),
  fuelling: z.enum(["0", "1"])
});

const AssignTruckDriverScreen = ({ onAssignDriver }) => {
  const [formData, setFormData] = useState({
    truck_driver_id: "",
    trip_id: "",
    fuelling: "0",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const { data: drivers = [], isLoading: isDriversLoading } = useQuery({
    queryKey: ["driversforAssigning"],
    queryFn: async () => {
      const response = await API.post("trip/trip.php", {
        dataname: "getTruckDrivers",
      });
      return response.data.data.map(driver => ({
        label: driver.driver_name,
        value: driver.truck_driver_id
      }));
    },
  });

  const { data: trips = [], isLoading: isTripsLoading } = useQuery({
    queryKey: ["tripsToBeAssigned"],
    queryFn: async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "getTrips",
        user_id,
      });
      return response.data.data.map(trip => ({
        label: `Trip ${trip.id} - ${trip.origin_name} to ${trip.destination_name}`,
        value: trip.trip_id
      }));
    },
  });

  const assignTruckDriverMutation = useMutation({
    mutationFn: async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "assignTruckDriverToTrip",
        ...formData,
        user_id,
      });
      return response.data;
    },
    onSuccess: () => {
      setModalVisible(true);
      onAssignDriver();
    },
    onError: (error) => {
      console.log("this is the rerro",error);
      
      // Check if the error is from the API response
      if (error?.response && error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message || 'An error occurred while assigning the Driver.';
        Alert.alert("Error", errorMessage);
      } else {
        // For other types of errors
        console.error("Error assigning Driver:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
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
    
    assignTruckDriverMutation.mutate();
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
      borderRadius: 12,
      color: 'black',
      paddingRight: 30,
      backgroundColor: focusedField === fieldName ? '#F0F2FF' : 'white',
    },
  });

  return (
    <ScrollView className="flex-1   pt-6">
      <View>
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Truck Driver</Text>
          {errors.truck_driver_id && (
            <Text className="mb-2 text-red-500">{errors.truck_driver_id}</Text>
          )}
        </View>
        <View
            className={`mb-4 bg-white rounded-md p-2 h-[60px] `         }
            style={{
              borderWidth: 1,
              borderColor:  "#C4CCF0" ,
              borderRadius: 8,
              paddingVertical: 2,
            }}
          >
          <Picker
            value={formData.truck_driver_id}
            onValueChange={(value) => setFormData({ ...formData, truck_driver_id: value })}
            items={drivers}
            placeholder={{ label: "Select Truck Driver", value: "" }}
            style={getPickerStyle('truck_driver_id')}
            onOpen={() => setFocusedField('truck_driver_id')}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View>
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Trips</Text>
          {errors.trip_id && (
            <Text className="mb-2 text-red-500">{errors.trip_id}</Text>
          )}
        </View>
        <View
            className={`mb-4 bg-white rounded-md p-2 h-[60px] `         }
            style={{
              borderWidth: 1,
              borderColor:  "#C4CCF0" ,
              borderRadius: 8,
              paddingVertical: 2,
            }}
          >
          <Picker
            value={formData.trip_id}
            onValueChange={(value) => setFormData({ ...formData, trip_id: value })}
            items={trips}
            placeholder={{ label: "Select Trip", value: "" }}
            style={getPickerStyle('trip_id')}
            onOpen={() => setFocusedField('trip_id')}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Fueling ?</Text>
        <View
            className={`mb-4 bg-white rounded-md p-2 h-[60px] `         }
            style={{
              borderWidth: 1,
              borderColor:  "#C4CCF0" ,
              borderRadius: 8,
              paddingVertical: 2,
            }}
          >
          <Picker
            value={formData.fuelling}
            onValueChange={(value) => setFormData({ ...formData, fuelling: value })}
            items={[
              { label: "No", value: "0" },
              { label: "Yes", value: "1" },
            ]}
            placeholder={{ label: "Select Fueling Option", value: null }}
            style={getPickerStyle('fuelling')}
            onOpen={() => setFocusedField('fuelling')}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <TouchableOpacity 
        className={`rounded-2xl p-4 mt-6 ${
          assignTruckDriverMutation.isPending ? "bg-[#8896C3]" : "bg-[#394F91]"
        }`}
        disabled={assignTruckDriverMutation.isPending || isDriversLoading || isTripsLoading} 
        onPress={handleSubmit}
      >
        {assignTruckDriverMutation.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text className="text-white text-center font-semibold">Submit</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0, 0, 0, 0.5)] gap-4">
          <View className='m-5 bg-white rounded-2xl p-9 items-center' style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
              <Image source={SuccessIcon} />
            </View>
            <Text className="font-semibold text-center text-xl text-[#394F91]">Assignment Successful 🚀</Text>
            <Text className="text-primary text-center mt-2">
              You have successfully assigned a truck driver to the trip
            </Text>
            <TouchableOpacity
              className="bg-[#394F91] p-4 rounded-lg mt-4 w-full"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AssignTruckDriverScreen;