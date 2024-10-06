import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import Camera from "@/assets/svgs/Camera.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import API from "@/src/services/api";

const LoadingPointScreen = () => {
  const { tripId } = useLocalSearchParams();
  console.log("trip_ID from confirmLoading", tripId);

  const router = useRouter();
  const [formData, setFormData] = useState({
    trip_id: tripId,
    loading_qty: "",
    remarks: "",
    dataname: "customerLoadingPoint",
  });

  const [focusedField, setFocusedField] = useState(null);


  const submitLoadingData = async (data) => {
    const userId = await AsyncStorage.getItem("user_id")
    const response = await API.post("trip/trip.php",
       {
        dataname: "customerLoadingPoint",
        customer_id:userId,
         ...data

       }
      );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitLoadingData,
    onSuccess: () => {
      console.log("loading point data submitted");
      Alert.alert("Success","Loading point data submitted")
      // Handle success (e.g., show a success message, navigate to next screen)
      router.push("/(customer)/Trip?tab=inProgress");
    },
    onError: (error) => {
     // Check if the error response contains a message
     const errorMessage = error.response?.data?.message || "An unknown error occurred";
    
     console.error('Error submitting data:', error);
     Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
        {[
          { label: "Tonnage loaded",name:"loading_qty", value: "Enter tonnage loaded" },
          { label: "Remarks",name:"remarks", placeholder: "Enter Remarks" },
        ].map((item, index) => (
          <View key={index} className="mb-4">
            <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
            <TextInput
              // className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white  border-[#C4CCF0] rounded-md p-2 h-[60px]"
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
            />
          </View>
        ))}

        <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" onPress={handleSubmit}  disabled={mutation.isPending}>
          <Text className="text-white text-center font-semibold">{mutation.isPending ? 'Submitting...' : 'Confirm'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoadingPointScreen;