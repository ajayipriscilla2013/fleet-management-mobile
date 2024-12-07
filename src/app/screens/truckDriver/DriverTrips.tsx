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
  FlatList,
  ActivityIndicator,
  RefreshControl,
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
import {
  getCompletedTripsForDriver,
  getInitiatedTripsForDriver,
  getInProgressTripsForDriver,
} from "@/src/services/drivers";
import { useQuery } from "@tanstack/react-query";
import EmptyScreen from "@/assets/svgs/empty.svg";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import SkeletonLoader from "@/components/TripsSkeletonLoader";

dayjs.extend(localizedFormat);

const Trip = () => {
  const router = useRouter();
  const { tab } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState(tab || "initiated");
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing

  const {
    data: initiatedTripsData = [],
    isLoading: isInitiatedProgressLoading,
    error: initiatedError,
    refetch: refetchInitiatedTrips,
  } = useQuery({
    queryKey: ["initiatedTripsForDriver"],
    queryFn: getInitiatedTripsForDriver,
  });

  const {
    data: inProgressTripsData = [],
    error: inProgressError,
    isError: isInProgressError,
    isLoading: isInProgressLoading,
    refetch: refetchInProgressTrips,
  } = useQuery({
    queryKey: ["inProgressTripsForDriver"],
    queryFn: getInProgressTripsForDriver,
  });

  const {
    data: deliveredTripsData = [],
    error: deliveredError,
    isError: isDeliveredError,
    isLoading: isDeliveredLoading,
    refetch: refetchDeliveredTrips,
  } = useQuery({
    queryKey: ["deliveredTripsForDriver"],
    queryFn: getCompletedTripsForDriver,
  });

  useEffect(() => {
    refetchInitiatedTrips();
    refetchInProgressTrips();
    refetchDeliveredTrips();
  }, []);

  // Handle refreshing logic
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchInitiatedTrips(),
      refetchInProgressTrips(),
      refetchDeliveredTrips(),
    ]);
    setRefreshing(false);
  };

  const handlePress = (path) => {
    router.push(path);
  };

  const renderTripItem = (item, status) => (
    <TouchableOpacity
      onPress={() => handlePress(`/screens/truckDriver/${item.trip_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.trip_id}
          </Text>
          <Badge label={status} variant={status.toLowerCase()} />
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
                {dayjs(item.created_date).format("LL")} to{" "}
                {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = (data, isLoading, error, status) => {
    if (refreshing) {
      return (
        <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      );
    }
    if (isLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          <ActivityIndicator />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          {/* <Text className="text-lg text-red-500">
            Error: {error.message}
          </Text> */}
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => {
              refetchInitiatedTrips();
              refetchInProgressTrips();
              refetchDeliveredTrips();
            }}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">
            No {status.toLowerCase()} trips found.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={({ item }) => renderTripItem(item, status)}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    );
  };

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
        <View className="mt-4 mx-6 mb-2 flex-row items-center border-gray-300 border bg-white rounded-lg p-4">
          <SearchIcon />
          <TextInput
            placeholder="Find Vendor"
            className="ml-2 flex-1 text-[#CDCDD0]"
          />
          <FilterIcon />
        </View>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="initiated" title="Initiated" />
            <TabsTrigger value="inProgress" title="In-Progress" />
            <TabsTrigger value="completed" title="Completed" />
          </TabsList>

          <TabsContent value="initiated">
            {renderContent(
              initiatedTripsData,
              isInitiatedProgressLoading,
              initiatedError,
              "Initiated"
            )}
          </TabsContent>
          <TabsContent value="inProgress">
            {renderContent(
              inProgressTripsData,
              isInProgressLoading,
              inProgressError,
              "In Progress"
            )}
          </TabsContent>
          <TabsContent value="completed">
            {renderContent(
              deliveredTripsData,
              isDeliveredLoading,
              deliveredError,
              "Delivered"
            )}
          </TabsContent>
        </Tabs>

        <View className="w-full mx-6"></View>
      </View>
    </SafeAreaView>
  );
};

export default Trip;
