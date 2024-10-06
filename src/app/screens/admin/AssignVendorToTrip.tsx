import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import SuccessIcon from "@/assets/images/success.png";
import { router } from 'expo-router';
import Picker from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';

const assignVendorSchema = z.object({
  vendor_id: z.number().min(1, "Vendor is required"),
  trip_id: z.string().min(1, "Trip is required"),
  role: z.string().min(1, "Provide a description"),
});

const fetchVendors = async () => {
  const response = await API.post("trip/trip.php", { dataname: "getVendors" });
  return response.data.vendors.map(vendor => ({
    label: `${vendor.name} ${vendor.vendor_type_name}`,
    value: vendor.id,
  }));
};

const fetchTrips = async () => {
  const user_id = await AsyncStorage.getItem("user_id");
  const response = await API.post("trip/trip.php", { dataname: "getTrips", user_id });
  return response.data.data.map(trip => ({
    label: `Trip ${trip.id} - ${trip.origin_name} to ${trip.destination_name}`,
    value: trip.trip_id,
  }));
};

const AssignVendorScreen = () => {
  const [formData, setFormData] = useState({
    vendor_id: "",
    trip_id: "",
    role: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ["vendorssss"],
    queryFn: fetchVendors,
  });

  const { data: trips = [], isLoading: tripsLoading } = useQuery({
    queryKey: ["tripssss"],
    queryFn: fetchTrips,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "assignVendorToTrip",
        ...formData,
        user_id,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.error === "success") {
        setModalVisible(true);
      } else {
        Alert.alert("Assignment Unsuccessful", `Error assigning Vendor! ${data.message}`);
      }
    },
    onError: (error) => {
      const serverError = error?.response?.data?.message || 'An error occurred while assigning the vendor.';
      console.error("Error assigning Vendor:", error);
      Alert.alert("Error", serverError);
    },
  });

  const handleSubmit = () => {
    const validation = assignVendorSchema.safeParse(formData);
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
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      <View>
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Trips</Text>
          {errors.trip_id && (
            <Text className="mb-2 text-red-500">{errors.trip_id}</Text>
          )}
        </View>
        <View className="mb-4">
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
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Vendor</Text>
          {errors.vendor_id && (
            <Text className="mb-2 text-red-500">{errors.vendor_id}</Text>
          )}
        </View>
        <View className="mb-4">
          <Picker
            value={formData.vendor_id}
            onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
            items={vendors}
            placeholder={{ label: "Select Vendor", value: "" }}
            style={getPickerStyle('vendor_id')}
            onOpen={() => setFocusedField('vendor_id')}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View className="mb-4">
        <View className='flex-row justify-between'>
          <Text className="text-gray-600 mb-[10px]">Role</Text>
          {errors.role && (
            <Text className="mb-2 text-red-500">{errors.role}</Text>
          )}
        </View>
        <TextInput
          placeholder="Provide a Description"
          keyboardType="default"
          value={formData.role}
          onChangeText={(text) => setFormData({ ...formData, role: text })}
          onFocus={() => setFocusedField('role')}
          onBlur={() => setFocusedField(null)}
          className={`border bg-white rounded-md p-2 h-[60px] ${
            focusedField === 'role'
              ? "border-[#394F91] bg-[#F0F2FF]"
              : "border-[#C4CCF0]"
          }`}
        />
      </View>

      <TouchableOpacity 
        className={`rounded-2xl p-4 mt-6 ${
          mutation.isPending ? "bg-[#8896C3]" : "bg-[#394F91]"
        }`}
        disabled={mutation.isPending || vendorsLoading || tripsLoading} 
        onPress={handleSubmit}
      >
        {mutation.isPending ? (
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
              You have successfully assigned a Vendor to Trip
            </Text>
            <TouchableOpacity
              className="bg-[#394F91] p-4 rounded-lg mt-4 w-full"
              onPress={() => {
                setModalVisible(false);
                router.push("/(admin)/Trip");
              }}
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AssignVendorScreen;