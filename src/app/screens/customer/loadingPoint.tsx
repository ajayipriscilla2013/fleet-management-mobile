import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Camera from "@/assets/svgs/Camera.svg"

const LoadingPointScreen = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>   
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



      <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" >
        <Text className="text-white text-center font-semibold">Confirm</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>

  );
};

export default LoadingPointScreen;