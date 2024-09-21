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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

const TripDetailsScreen = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs defaultValue="tripInfo">
        <TabsList>
          <TabsTrigger value="tripInfo" title="Trip Info" />
          <TabsTrigger value="loadingPoint" title="Loading Point" />
          <TabsTrigger value="offLoadingPoint" title="Off Loading Point" />
        </TabsList>

        <TabsContent className="flex-1 px-6 bg-[#F9F9F9]" value="tripInfo">
          <ScrollView className="flex-1  pt-6">
            <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <OriginIcon />
                <Text className="text-gray-600 ml-1">
                  Gwarinpa, Abuja, Nigeria
                </Text>
              </View>

              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">
                  Truck Takeoff
                </Text>
              </View>
              <View className="flex-row items-center">
                <LocationIcon />
                <Text className="text-gray-600 ml-1">
                  Airport Road, Abuja, Nigeria
                </Text>
              </View>
              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">Destination</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 mb-6 ">
              <View className=" border-b-[1px] border-[#F0F1F1]">
                <Text className="text-lg font-bold mb-2">Trip Information</Text>
              </View>
              {[
                { label: "Trip ID", value: "TP47636726" },
                { label: "Loading Point", value: "Gwarinpa, Abuja" },
                { label: "Offloading Point", value: "Airport Road, Abuja" },
                {
                  label: "Status",
                  value: "Initiated",
                  color: "text-yellow-600",
                },
                { label: "Start Date", value: "Sep 1, 2024" },
                { label: "End Date", value: "Sep 1, 2024" },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                >
                  <Text className="text-[#A5A6AB]">{item.label}</Text>
                  <Text className={item.color || "font-semibold"}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() =>
                handlePress("/(unorganized)/(truckDriver)/loadingPoint")
              }
            >
              <Text className="text-white text-center font-semibold">
                Confirm Loading Point
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TabsContent>

        <TabsContent className="flex-1 px-6 bg-[#F9F9F9]" value="loadingPoint">
          <ScrollView className="flex-1  pt-6">
            <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <OriginIcon />
                <Text className="text-gray-600 ml-1">
                  Gwarinpa, Abuja, Nigeria
                </Text>
              </View>

              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">
                  Truck Takeoff
                </Text>
              </View>
              <View className="flex-row items-center">
                <LocationIcon />
                <Text className="text-gray-600 ml-1">
                  Airport Road, Abuja, Nigeria
                </Text>
              </View>
              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">Destination</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 mb-6 ">
              <View className=" border-b-[1px] border-[#F0F1F1]">
                <Text className="text-lg font-bold mb-2">Loading Point Details</Text>
              </View>
              {[
                { label: "Tonnage Loaded", value: "20" },
                { label: "Destination", value: "Gwarinpa, Abuja" },
                { label: "Offloading Point", value: "Airport Road, Abuja" },
                
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                >
                  <Text className="text-[#A5A6AB]">{item.label}</Text>
                  <Text className={item.color || "font-semibold"}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() =>
                handlePress("/screens/customer/loadingPoint")
              }
            >
              <Text className="text-white text-center font-semibold">
                Confirm Loading Point
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TabsContent>  

        <TabsContent className="flex-1 px-6 bg-[#F9F9F9]" value="offLoadingPoint">
          <ScrollView className="flex-1  pt-6">
            <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <OriginIcon />
                <Text className="text-gray-600 ml-1">
                  Gwarinpa, Abuja, Nigeria
                </Text>
              </View>

              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">
                  Truck Takeoff
                </Text>
              </View>
              <View className="flex-row items-center">
                <LocationIcon />
                <Text className="text-gray-600 ml-1">
                  Airport Road, Abuja, Nigeria
                </Text>
              </View>
              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">Destination</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 mb-6 ">
              <View className=" border-b-[1px] border-[#F0F1F1]">
                <Text className="text-lg font-bold mb-2">Offloading Point Details</Text>
              </View>
              {[
                { label: "Tonnage Offloaded", value: "20" },
                { label: "Destination", value: "Gwarinpa, Abuja" },
                { label: "Remark", value: "Successful Trip" },
                
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                >
                  <Text className="text-[#A5A6AB]">{item.label}</Text>
                  <Text className={item.color || "font-semibold"}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() =>
                handlePress("/screens/customer/offLoadingPoint")
              }
            >
              <Text className="text-white text-center font-semibold">
                Confirm Offloading Point
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TabsContent>    
        
      </Tabs>
    </SafeAreaView>
  );
};

export default TripDetailsScreen;
