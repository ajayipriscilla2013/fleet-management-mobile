import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { router, Stack, useLocalSearchParams, useRouter } from "expo-router";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import ClockIcon from "@/assets/svgs/clock.svg";
import LocationIcon from "@/assets/svgs/location2.svg";
import CalendarIcon from "@/assets/svgs/calendar.svg";
import ArrowIcon from "@/assets/svgs/arrow-right2.svg";
import { Badge } from "@/components/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useQuery } from "@tanstack/react-query";
import { getCompletedTripsforCustomer, getInitiatedTripsforCustomer, getInProgressTripsforCustomer } from "@/src/services/customer";
import EmptyScreen from "@/assets/svgs/empty.svg";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);


const Trip = () => {
  const router = useRouter();
  const { tab } = useLocalSearchParams();

  const handlePress = (path) => {
    router.push(path);
  };

  const [activeTab, setActiveTab] = useState(tab || 'initiated');

  const {
    data: initiatedTripsData,
    isLoading: isInitiatedProgressLoading,
    error: initiatedError,
    refetch: refetchInitiatedTrips,
  } = useQuery({
    queryKey: ["initiatedTripsForCustomer"],
    queryFn: getInitiatedTripsforCustomer,
  });

  const {
    data: inProgressTripsData = [],
    error: inProgressError,
    isError: isInProgressError,
    isLoading: isInProgressLoading,
    refetch: refetchProgressTrips,
  } = useQuery({
    queryKey: ["inProgressTripsForCustomer"],
    queryFn: getInProgressTripsforCustomer,
  });

  const {
    data: deliveredTripsData = [],
    error: deliveredError,
    isError: isDeliveredError,
    isLoading: isDeliveredLoading,
    refetch: refetchDeliveredTrips,
  } = useQuery({
    queryKey: ["deliveredTripsForCustomer"],
    queryFn: getCompletedTripsforCustomer,
  });

  useEffect(() => {
    refetchInitiatedTrips(),
    refetchProgressTrips(),
    refetchDeliveredTrips()
  }, []); 

  const renderInititatedTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/customer/CustomerTripDetailsScreen?tripId=${item.trip_id}`
        )
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
                {item.origin_name} to {item.destination_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {dayjs(item.start_date).format("LL")} to {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderInitiatedContent = () => {
    if (isInitiatedProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
          <ActivityIndicator />
        </View>
      );
    }
    if (initiatedError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <Text className="text-lg text-red-500">
            Error: {initiatedError.message}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={initiatedTripsData}
        renderItem={renderInititatedTripItem}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
      />
    );
  };

  const renderInProgressTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/customer/CustomerTripDetailsScreen?tripId=${item.trip_id}`
        )
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.trip_id}
          </Text>
          <Badge label="In Progress" variant="inprogress" />
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {item.origin_name} to {item.destination_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {dayjs(item.start_date).format("LL")} to {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderInProgressContent = () => {
    if (isInProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
          <ActivityIndicator />
        </View>
      );
    }

    if (isInProgressError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
            Error: {inProgressError.message}
          </Text>
        </View>
      );
    }

    if (inProgressTripsData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
           <EmptyScreen />
          <Text className="text-lg text-gray-500">
            No in-progress trips found.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={inProgressTripsData}
        renderItem={renderInProgressTripItem}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
      />
    );
  };

  const renderDeliveredTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/customer/CustomerTripDetailsScreen?tripId=${item.trip_id}`
        )
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.trip_id}
          </Text>
          <Badge label="Completed" variant="delivered" />
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {item.origin_name} to {item.destination_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {dayjs(item.start_date).format("LL")} to {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDeliveredContent = () => {
    if (isDeliveredLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
         
          <ActivityIndicator />
        </View>
      );
    }

    if (isDeliveredError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
            Error: {deliveredError.message}
          </Text>
        </View>
      );
    }

    if (deliveredTripsData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen/>
          <Text className="text-lg text-gray-500">
            No Delivered trips found.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={deliveredTripsData}
        renderItem={renderDeliveredTripItem}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
      />
    );
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

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} >
          <TabsList>
            <TabsTrigger value="initiated" title="Initiated" />
            <TabsTrigger value="inProgress" title="In-Progress" />
            <TabsTrigger value="completed" title="Completed" />
          </TabsList>

          <TabsContent value="initiated" >
           {renderInitiatedContent()}
          </TabsContent>
          <TabsContent value="inProgress">
            {renderInProgressContent()}
          </TabsContent>
          <TabsContent value="completed">
            {renderDeliveredContent()}
          </TabsContent>
        </Tabs>

        <View className="w-full mx-6"></View>
      </View>
    </SafeAreaView>
  );
};

export default Trip;
