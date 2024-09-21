import React from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import LocationIcon from "@/assets/svgs/location2.svg";
import CalendarIcon from "@/assets/svgs/calendar.svg";
import ArrowIcon from "@/assets/svgs/arrow-right2.svg";
import { Badge } from "@/components/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs"; // Assuming your Tabs components are in this path
import { useQuery } from "@tanstack/react-query";
import { getTrips } from "@/src/services/other";

const Trip = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  const { data: tripsData } = useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  });

  const renderTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(`/screens/admin/AdminTripDetailsScreen?status=initiated&tripId=${item.trip_id}`)
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
         {item.trip_id}
          </Text>
          <Badge label="Initiated" variant="initiated" />
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {item.customer_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {item.truck_driver_name}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-[#F9F9F9]"
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="bg-[#F9F9F9] flex-1">
        <View className="flex-row items-center justify-between mx-6">
          <Text className="text-[#1D1E20] font-extrabold text-2xl">Trips</Text>
          <Text className="text-[#394F91] text-sm">Need Help?</Text>
        </View>

        {/* Search Bar */}
        <View className="mt-4 mx-6 flex-row items-center border-gray-300 border bg-white rounded-lg p-4">
          <SearchIcon />
          <TextInput
            placeholder="Find Vendor"
            className="ml-2 flex-1 text-[#CDCDD0]"
          />
          <FilterIcon />
        </View>

        {/* Tab Navigation with styled TabsTrigger */}
        <Tabs defaultValue="newTrips">
          <TabsList>
            <TabsTrigger value="newTrips" title="New Trip" />
            <TabsTrigger value="deliveredTrips" title="Delivered Trips" />
            <TabsTrigger value="closeTrips" title="Close Trip Requests" />
          </TabsList>

          {/* Content for 'All' Tab */}
          <TabsContent value="newTrips">
            <FlatList
              data={tripsData}
              renderItem={renderTripItem}
              keyExtractor={(item) => item.id.toString()}
              className="mt-4  "
            />

            {/* <TouchableOpacity
              onPress={() =>
                handlePress(
                  "/screens/admin/AdminTripDetailsScreen?status=inprogress"
                )
              }
            >
              <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-[#1D1E20]">
                    1 Ton of Sand
                  </Text>
                  <Badge label="In Progress" variant="inprogress" />
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
            </TouchableOpacity> */}
          </TabsContent>

          <TabsContent value="deliveredTrips">
            <TouchableOpacity
              onPress={() =>
                handlePress(
                  "/screens/admin/AdminTripDetailsScreen?status=delivered"
                )
              }
            >
              <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-[#1D1E20]">
                    1 Ton of Sand
                  </Text>
                  <Badge label="delivered" variant="delivered" />
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

            <TouchableOpacity
              onPress={() =>
                handlePress(
                  "/screens/admin/AdminTripDetailsScreen?status=delivered"
                )
              }
            >
              <View className="flex h-[90px] mx-3 gap-2 rounded-lg mb-2 py-[13px] px-[18px] bg-white">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-[#1D1E20]">
                    1 Ton of Sand
                  </Text>
                  <Badge label="delivered" variant="delivered" />
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
      </View>
      <TouchableOpacity
        onPress={() => handlePress("/screens/admin/createTrip")}
        className="absolute bottom-4 right-4 w-1/2 bg-[#394F91] p-4 rounded-lg items-center z-10"
      >
        <Text className="text-white font-bold">+ Create Trip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Trip;
