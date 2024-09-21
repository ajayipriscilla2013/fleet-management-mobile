import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Camera from "@/assets/svgs/Camera.svg"

const GetFuelScreen = () => {
  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      
{/*  
White 
background: #FFFFFF;
border: 1px solid #C4CCF0;
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #EEF0FB;
border-radius: 8px; */}

      {[
        { label: 'Fuel Price Per Litre', value: '₦900' },
        { label: 'Total Litres', placeholder: 'Enter total litres' },
        { label: 'Total Fuel Price', placeholder: 'Enter total fuel price' },
        { label: 'Odometer Reading', placeholder: 'Enter odometer' },
        { label: 'Name of Fuel Attendant', placeholder: 'Enter name of fuel attendant' },
        { label: 'Name of Truck Driver', placeholder: 'Enter name of Truck Driver' },
        { label: 'Filling Station', placeholder: 'Enter Filling Station' },
        { label: 'Date', placeholder: 'dd/mm/yyyy' },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
          <TextInput
            className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border  border-[#C4CCF0] rounded-md p-2 h-[60px]"
            placeholder={item.placeholder}
            value={item.value}
          />
        </View>
      ))}

        <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
        Note: Capture the following information: Current Odometer reading at fuelling point, Picture of the Truck Dashboard (Before and after fuelling), The fuel pump (Before and after fueling) and Picture of Truck Driver and Fuel Attendant together.
      </Text>

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

      <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" >
        <Text className="text-white text-center font-semibold">Get Fuel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GetFuelScreen;