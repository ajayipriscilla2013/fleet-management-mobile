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
import { setErrorMap, z } from "zod";
import { Picker } from "@react-native-picker/picker";

const loadingPointSchema= z.object({
  loading_qty:z.number().min(1,"Loading Quantity is required"),
  remarks:z.string().min(1,"Remark is required")
})

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
  const [errors, setErrors] = useState({}); // To hold form errors


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
      router.push("/customer/trip?tab=inProgress");
    },
    onError: (error) => {
     
     const errorMessage = error.response?.data?.message || "Request Failed, Try Again";
    
     console.error('Error submitting data:', error);
     Alert.alert("Error", `${errorMessage}`);
    
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    setErrors({})
    const updatedFormData = {
      ...formData,
      loading_qty: Number(formData.loading_qty), // Convert to number
    };

    const result = loadingPointSchema.safeParse(updatedFormData);
    if(!result.success){
      const fieldErrors={}
      result.error.errors.forEach((err)=>{
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    mutation.mutate(updatedFormData);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          // { label: "Tonnage loaded",name:"loading_qty", value: "Enter tonnage loaded",numeric:true },
          { label: "Remarks",name:"remarks", placeholder: "Enter Remarks" },
        ].map((item, index) => (
          <View key={index} className="mb-4">
            <View className="flex-row justify-between">

            <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
            {errors[item.name] && (
              <Text className="mb-2" style={{ color: "red" }}>
                {errors[item.name]}
              </Text>
            )}
            </View>
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
              keyboardType={item.numeric?"numeric":"default"}
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
