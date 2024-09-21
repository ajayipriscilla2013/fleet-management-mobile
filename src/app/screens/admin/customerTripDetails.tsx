import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import LocationIcon from "@/assets/svgs/location3.svg";
import OriginIcon from "@/assets/svgs/record-circle.svg";
import TruckIcon from "@/assets/svgs/truck2.svg";

const TripDetailsScreen = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-4 flex-row px-6 gap-2 justify-start bg-white py-[6.5px]">
      <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-lg">
          <Text className="text-[#1D1E20]">Trip Info</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#394F91] px-4 py-2 rounded-lg">
          <Text className="text-white">Customer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-lg">
          <Text className="text-[#1D1E20]">Truck Driver</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">

        <View className="bg-white rounded-lg p-4 mb-6 ">
          <View className=" border-b-[1px] border-[#F0F1F1]">
            <Text className="text-lg font-bold mb-2">Loading Point</Text>
          </View>
          {[
            { label: "Tonnage Loaded", value: "20" },
            { label: "Material", value: "Sand" },
            { label: "Waybil", value: "Sand" },
            { label: "Status", value: "Initiated", color: "text-[#18BB0C]" },
          ].map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
            >
              <Text className="text-[#A5A6AB]">{item.label}</Text>
              <Text className={item.color || "font-semibold bg-[#18BB0C1A]"}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View className="bg-white rounded-lg p-4 mb-6 ">
          <View className=" border-b-[1px] border-[#F0F1F1]">
            <Text className="text-lg font-bold mb-2">Offloading Point</Text>
          </View>
          {[
            { label: "Tonnage Loaded", value: "20" },
            { label: "Material", value: "Sand" },
            { label: "Waybil", value: "Sand" },
            { label: "Status", value: "Initiated", color: "text-[#394F91]" },
          ].map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
            >
              <Text className="text-[#A5A6AB]">{item.label}</Text>
              <Text className={item.color || "font-semibold bg-[#394F911A]"}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View className="bg-[#EEF0FB] px-5 py-3">
            <Text className="text-[#394F91]">Images</Text>
        </View>

     

        {/* <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4 mt-6"
          onPress={() =>
            handlePress("/(unorganized)/(truckDriver)/loadingPoint")
          }
        >
          <Text className="text-white text-center font-semibold">
           Confirm Loading Point
          </Text>
        </TouchableOpacity> */}
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripDetailsScreen;
