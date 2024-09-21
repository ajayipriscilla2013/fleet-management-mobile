import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { router, Stack, useRouter } from "expo-router";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import ClockIcon from "@/assets/svgs/clock.svg";
import LocationIcon from "@/assets/svgs/location2.svg";
import CalendarIcon from "@/assets/svgs/calendar.svg";
import ArrowIcon from "@/assets/svgs/arrow-right2.svg";
import { Badge } from "@/components/Badge";

const Trip = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <View className="bg-[#F9F9F9] flex-1">
        <View className="flex-row items-center justify-between mx-6">
          <Text className="text-[#1D1E20] font-extrabold text-2xl">Trips</Text>
          <Text className="text-[#394F91] text-sm">Need Help?</Text>
        </View>

        {/* Search Bar */}
        <View className="mt-4 mx-6  flex-row items-center border-gray-300 border bg-white rounded-lg p-4">
          <SearchIcon />
          <TextInput
            placeholder="Find Vendor"
            className="ml-2 flex-1 text-[#CDCDD0]"
          />
          <FilterIcon />
        </View>

        {/* Filter Buttons */}
        <View className="mt-4 flex-row px-6 gap-2 justify-start bg-white py-[6.5px]">
          <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-lg">
            <Text className="text-gray-700">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#394F91] px-4 py-2 rounded-lg">
            <Text className="text-white">New Trip</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity onPress={() => handlePress("/(unorganized)/tripDetails")}> */}
        {/* <TouchableOpacity onPress={() => handlePress("/(unorganized)/(truckDriver)/getFuel")}> */}
        <TouchableOpacity
          onPress={() =>
            handlePress("/(unorganized)/(truckDriver)/offloadingPoint")
          }
        >
          <View className="flex h-[90px] mx-6 gap-2 rounded-lg my-3 py-[13px] px-[18px] bg-white">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-base text-[#1D1E20]">
                1 Ton of Sand
              </Text>
              <Badge  label="Initiated" variant={"initiated"} />
            </View>

            <View className="flex flex-row items-end justify-between">
              <View>
                <View className="flex-row items-center gap-1">
                  <LocationIcon />
                  <Text className="text-xs text-[#A5A6AB]">
                    Airport Road, Abuja.
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <CalendarIcon />
                  <Text className="text-xs text-[#A5A6AB]">
                    Created on Jan 16, 2023 1:15pm
                  </Text>
                </View>
              </View>
              <ArrowIcon />
            </View>
          </View>
        </TouchableOpacity>

        <View className="w-full mx-6"></View>
      </View>
    </SafeAreaView>
  );
};

export default Trip;
