import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

const Trip = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]" style={{ 
      flex: 1, 
      backgroundColor: '#F9F9F9',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View className="bg-[#F9F9F9] flex-1">
        <View className="flex-row items-center justify-between mx-6">
          <Text className="text-[#1D1E20] font-extrabold text-2xl">Trips</Text>
          <Text className="text-[#394F91] text-sm">Need Help?</Text>
        </View>

        {/* Search Bar */}
        <View className="mt-4 mx-6 mb-2 flex-row items-center border-gray-300 border bg-white rounded-lg p-4">
          <SearchIcon />
          <TextInput
            placeholder="Find Vendor"
            className="ml-2 flex-1 text-[#CDCDD0]"
          />
          <FilterIcon />
        </View>

        <Tabs defaultValue="initiated">
          <TabsList>
            <TabsTrigger value="initiated" title="Initiated" />
            <TabsTrigger value="inProgress" title="In-Progress" />
            <TabsTrigger value="completed" title="Completed" />
          </TabsList>

          <TabsContent value="initiated" >
            <TouchableOpacity
              onPress={() => handlePress("/screens/customer/CustomerTripDetailsScreen")}
            >
              <View className="flex h-[90px] mx-4 gap-2 rounded-lg my-3 py-[13px] px-6 bg-white">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-[#1D1E20]">
                    1 Ton of Sand
                  </Text>
                  <Badge label="Initiated" variant={"initiated"} />
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
          </TabsContent>
          <TabsContent value="inProgress">
            <TouchableOpacity
              onPress={() => handlePress("/screens/customer/offloadingPoint")}
            >
              <View className="flex h-[90px] mx-4 gap-2 rounded-lg my-3 py-[13px] px-6 bg-white">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-[#1D1E20]">
                    1 Ton of Sand
                  </Text>
                  <Badge label="In Progress" variant={"inProgress"} />
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
          </TabsContent>
          <TabsContent value="completed">
            <TouchableOpacity
              onPress={() => handlePress("/screens/customer/offloadingPoint")}
            >
              <View className="flex h-[90px] mx-4 gap-2 rounded-lg my-3 py-[13px] px-6 bg-white">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-[#1D1E20]">
                    1 Ton of Sand
                  </Text>
                  <Badge label="Delivered" variant={"delivered"} />
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
          </TabsContent>
        </Tabs>

        <View className="w-full mx-6"></View>
      </View>
    </SafeAreaView>
  );
};

export default Trip;
