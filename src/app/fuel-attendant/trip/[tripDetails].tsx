import { Badge } from '@/components/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { getSingleTrip } from '@/src/services/other';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import EmptyScreen from "@/assets/svgs/empty.svg";
import { getFuelAttendantTripDetails } from '@/src/services/fuelAttendant';

const TripDetailsScreen = () => {
  const router = useRouter();

    const handlePress = (path) => {
      router.push(path);
    };

    const {tripDetails:tripId}= useLocalSearchParams()
    console.log("trip_ID",tripId);
    
    const {data:tripInfo,isLoading,isError,refetch}= useQuery({
      queryKey:["TripInfoForFuelAttendant"],
      queryFn:()=>getFuelAttendantTripDetails(tripId)
    })


    const renderActionButton=()=>{
      const status = tripInfo?.status?.toLowerCase();
      if (status === "in_progress") {
        return (
          <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" onPress={() => handlePress(`/fuel-attendant/confirmFuel/${tripId}`)}>
          <Text className="text-white text-center font-semibold">Confirm Fuel Info</Text>
        </TouchableOpacity>
        );
      } 
      return null
    }

    const renderGetFueledInfo=()=>(
<ScrollView className="flex-1 bg-[#F9F9F9]  ">
     

     <View className="bg-white rounded-lg p-4 mb-6">
       <Text className="text-lg font-semibold mb-2 border-b-[1px] border-[#F0F1F1]">Fuel Information</Text>
       {[
         { label: 'Fuel Vendor', value: tripInfo?.vendor_name
         },
         { label: 'Location', value: tripInfo?.vendor_address },
         { label: 'Status', value: tripInfo?.status, color: 'text-yellow-600' },
         { label: 'Date', value: 'Sep 1, 2024' },
        
       ].map((item, index) => (
         <View key={index} className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3">
           <Text className="text-[#A5A6AB]">{item.label}</Text>
           <Text className={item.color || 'font-semibold'}>{item.value}</Text>
         </View>
       ))}
     </View>

     <View className="bg-white rounded-lg p-4">
       <Text className="text-lg font-semibold mb-2">Driver/Truck Information</Text>
       {[
         { label: 'Full Name', value: tripInfo?.driver_name  },
         { label: 'Truck Model', value: 'Mac 18C230' },
         { label: 'Plate Number', value: tripInfo?.plate_number },
         { label: 'Filling Station', value: 'Mobil Filling Station' },

       ].map((item, index) => (
         <View key={index} className="flex-row justify-between mb-1 border-b-[1px] border-[#F0F1F1] py-3">
           <Text className="text-[#A5A6AB] ">{item.label}</Text>
           <Text className='text-[#1D1E20] font-semibold'>{item.value}</Text>
         </View>
       ))}
     </View>
       {renderActionButton()}
     
   </ScrollView>
    )

    const renderFueledInfo=()=>{
      if( tripInfo?.fueled === 0 ){
        return(
        <View className="flex items-center justify-center mt-10">
            <EmptyScreen />
            <Text className="text-lg text-gray-500">Trip Not Yet Fueled</Text>
          </View>)
      }else{
        return(
        <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-lg font-semibold mb-2">Fuel Information</Text>
            {[
              { label: 'Fuel Price', value: '₦20,000' },
              { label: 'Fuel Level', value: 'Half Tank' },
              { label: 'Fuel Quantity', value: '10 Litres' },
              { label: 'Filling Station', value: 'Mobil Filling Station' },
              { label: 'Location', value: 'Airport Road, Abuja' },
              { label: 'Status', value: 'To be Fueled', color: 'text-yellow-600' },
              { label: 'Date', value: 'Sep 1, 2024' },
            ].map((item, index) => (
              <View key={index} className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3">
                <Text className="text-[#A5A6AB]">{item.label}</Text>
                <Text className={item.color || 'font-semibold'}>{item.value}</Text>
              </View>
            ))}
          </View>)
      }
    }
      
    if (isLoading) {
      return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#394F91" />
          <Text className="mt-4 text-gray-600">Loading trip details...</Text>
        </SafeAreaView>
      );
    }
  
    if (isError) {
      return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-red-500">Error loading trip details. Please try again.</Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => refetch()}
          >
            <Text className="text-white text-center font-semibold">
              Retry
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    


  return (
    <SafeAreaView className='flex-1 bg-[#F9F9F9]'>
      

      <Tabs defaultValue="getFueledInfo">
          <TabsList>
            <TabsTrigger value="getFueledInfo" title="Get Fueled Info" />
            <TabsTrigger value="fueledInfo" title="Fueled Info" />
          </TabsList>

          <TabsContent className='flex-1' value="getFueledInfo">
          {renderGetFueledInfo()}
              
          </TabsContent>

       <TabsContent value="fueledInfo">
       {renderFueledInfo()}
      
       </TabsContent>

</Tabs>



     
    </SafeAreaView>
  );
};

export default TripDetailsScreen;