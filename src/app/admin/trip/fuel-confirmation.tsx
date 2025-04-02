import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import { useQuery, useMutation,useQueryClient } from '@tanstack/react-query';
import dayjs from "dayjs";
import { confirmFuelRequest, getFuelRequests, getVendors } from '@/src/services/other';

const FuelRequestDetails = () => {
  const router = useRouter();
  const { requestId } = useLocalSearchParams();
  const [selectedVendor, setSelectedVendor] = useState('');
const queryClient = useQueryClient();
  // // Mock vendor data - replace with actual vendor fetching
  // const vendors = [
  //   { id: 'fma6118', name: 'Vendor 1' },
  //   { id: 'fma6119', name: 'Vendor 2' },
  //   { id: 'fma6120', name: 'Vendor 3' },
  // ];

    const {
      data: vendorsData,
      isLoading: isLoadingVendors,
      isError: isErrorVendors,
    } = useQuery({queryKey:['vendors'],queryFn: getVendors});

  // Query to fetch fuel request details
  const {
    data: requestDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fuelRequest', requestId],
    queryFn: () => getFuelRequests(requestId), // Implement this function
  });

  // Mutation for handling request approval/disapproval
  const { mutate: handleFuelRequest, isLoading: isSubmitting } = useMutation({
    mutationFn: async ({ status }) => {
        const response = await confirmFuelRequest(requestId, selectedVendor, status);
        if (!response) {
          throw new Error('Failed to process fuel request');
        }
        console.log(response);
        return response;
      },
      onSuccess: () => {
        console.log("Fuel request approved");
      Alert.alert("Success", "Fuel request updated");
      queryClient.invalidateQueries("Pending Fuel Requests")
        router.back();
      },
      onError: (error) => {
        const errorMessage =error.response?.data?.message|| "Request Failed, Try Again";
        // Alert.alert("Error", "Error processing fuel request");
        console.error('Error processing fuel request:', error);
        Alert.alert("Error", `${errorMessage}`);
      }
  });

//   if (isLoading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#394F91" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text className="text-red-500">Error loading request details</Text>
//         <TouchableOpacity 
//           onPress={() => router.back()}
//           className="mt-4 bg-[#394F91] px-6 py-3 rounded-lg"
//         >
//           <Text className="text-white">Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

  return (
    <SafeAreaView
      className="flex-1 bg-[#F9F9F9]"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          {/* <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-[#394F91]">Back</Text>
          </TouchableOpacity> */}
          <Text className="text-xl font-bold">Fuel Request Details</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Request Details */}
        <View className="bg-white p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold mb-2">
            Request ID: {requestId}
          </Text>
          {/* {requestDetails && (
            <>
              <Text className="text-gray-600 mb-1">
                Driver ID: {requestDetails.driver_id}
              </Text>
              <Text className="text-gray-600 mb-1">
                Created: {dayjs(requestDetails.created_at).format("LL")}
              </Text>
            
            </>
          )} */}
        </View>

        {/* Vendor Selection */}
        <View className="bg-white p-4 rounded-lg mb-6">
          <Text className="text-base font-semibold mb-2">Select Vendor</Text>
          <View className="border border-gray-200 rounded-lg">
            <Picker
              selectedValue={selectedVendor}
              onValueChange={(itemValue) => setSelectedVendor(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select a vendor" value="" />
              {vendorsData?.map((vendor) => (
                <Picker.Item 
                  key={vendor.id} 
                  label={vendor.name} 
                  value={vendor.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            onPress={() => handleFuelRequest({ status: 'declined' })}
            disabled={isSubmitting}
            className="bg-red-500 w-[48%] py-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? 'Declining...' : 'Decline Request'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleFuelRequest({ status: 'approved' })}
            disabled={isSubmitting || !selectedVendor}
            className={`w-[48%] py-4 rounded-lg ${
              selectedVendor ? 'bg-[#394F91]' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? 'Approving...' : 'Approve Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FuelRequestDetails;