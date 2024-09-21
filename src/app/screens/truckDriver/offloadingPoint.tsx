import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Image, FlatList } from 'react-native';
import Camera from "@/assets/svgs/Camera.svg"
import Img1 from "@/assets/images/img1.png"
import Img2 from "@/assets/images/img2.png"
import Img3 from "@/assets/images/img3.png"

const OffloadingPointScreen = () => {
  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      
{/*  
White 
background: #FFFFFF;
border: 1px solid #C4CCF0;
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #EEF0FB;
border-radius: 8px; */}

      {[
        { label: 'Tonnage Offloaded', value: 'Enter tonnage offloaded' },
        { label: 'Material', placeholder: 'Enter tonnage material' },
        { label: 'Waybill Number', placeholder: 'Enter waybill number' },
        { label: 'Odometer Reading', placeholder: 'Enter odometer reading' },
        { label: 'Status', placeholder: 'Select Status' },
        
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

      

        <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 ">
        Note: Capture the following information: Current Odometer reading, Materia and Waybill.
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

      <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingHorizontal: 8,  }}
          />

      <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" >
        <Text className="text-white text-center font-semibold">Request to Close Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OffloadingPointScreen;


const data= [
  {
    id:"1",
    image:Img1,
  },
  {
    id:"2",
    image:Img2,
  },
  {
    id:"3",
    image:Img3,
  }
]

const renderItem = ({ item }) => (
  <View className="p-2 w-[50%]">
    <Pressable 
    //  onPress={() => handlePress(`/vendors/${item.title}`)}
     >
    
    <Image
      source={ item.image }
      className="w-full  rounded-lg bg-slate-200"
    />
    </Pressable>
  </View>
);
