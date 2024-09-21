import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Camera from "@/assets/svgs/Camera.svg"
import { useRouter } from 'expo-router';

const LoadingPointScreen = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      


      {[
        { label: 'Tonnage loaded', value: 'Enter tonnage loaded' },
        { label: 'Destination', placeholder: 'Enter Destination' },
       
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          <TextInput
            className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white  border-[#C4CCF0] rounded-md p-2 h-[60px]"
            placeholder={item.placeholder}
            value={item.value}
          />
        </View>
      ))}

<Text className="text-gray-600 mb-[10px]">Take a Snap of Waybill</Text>

      

      <TouchableOpacity className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4">
       <View className='flex flex-col items-center'>
            <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>

        <Camera className="w-6 h-6 text-blue-600 mr-2" />
            </View>
        <Text className=" font-semibold">Take a Snap</Text>
      <Text className="text-center text-gray-500 text-sm mt-2">
        Note: You can take a snap or record a video.
      </Text>
       </View>
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" onPress={() =>
            handlePress("/screens/truckDriver/offloadingPoint")
          }>
        <Text className="text-white text-center font-semibold">Accept</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoadingPointScreen;