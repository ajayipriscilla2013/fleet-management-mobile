import { Badge } from '@/components/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

const TripDetailsScreen = () => {
  const router = useRouter();

    const handlePress = (path) => {
      router.push(path);
    };
  return (
    <SafeAreaView className='flex-1 bg-[#F9F9F9]'>
      

      <Tabs defaultValue="getFueledInfo">
          <TabsList>
            <TabsTrigger value="getFueledInfo" title="Get Fueled Info" />
            <TabsTrigger value="fueledInfo" title="Fueled Info" />
          </TabsList>

          <TabsContent className='flex-1' value="getFueledInfo">
          <ScrollView className="flex-1 bg-[#F9F9F9]  ">
     

     <View className="bg-white rounded-lg p-4 mb-6">
       <Text className="text-lg font-semibold mb-2 border-b-[1px] border-[#F0F1F1]">Fuel Information</Text>
       {[
         { label: 'Fuel Vendor', value: 'Mobil Filling Station' },
         { label: 'Location', value: 'Airport Road, Abuja' },
         { label: 'Status', value: 'To be Fueled', color: 'text-yellow-600' },
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
         { label: 'Full Name', value: 'Uwurume Peter' },
         { label: 'Truck Model', value: 'Mac 18C230' },
         { label: 'Plate Number', value: 'LAGOS8467K3' },
         { label: 'Filling Station', value: 'Mobil Filling Station' },
         { label: 'Date', value: 'Sep 1, 2024' },
       ].map((item, index) => (
         <View key={index} className="flex-row justify-between mb-1 border-b-[1px] border-[#F0F1F1] py-3">
           <Text className="text-[#A5A6AB] ">{item.label}</Text>
           <Text className='text-[#1D1E20] font-semibold'>{item.value}</Text>
         </View>
       ))}
     </View>

     <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" onPress={() => handlePress("/screens/fuelAttendant/confirmFuel")}>
       <Text className="text-white text-center font-semibold">Confirm Fuel Info</Text>
     </TouchableOpacity>
   </ScrollView>
              
          </TabsContent>

       <TabsContent value="fueledInfo">
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
     </View>
       </TabsContent>

</Tabs>



     
    </SafeAreaView>
  );
};

export default TripDetailsScreen;