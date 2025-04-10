import React, { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import EmptyScreen from "@/assets/svgs/empty.svg";
import {
  getFuelAttendantTripsFueled,
  getFuelAttendantTripsToBeFueled,
} from "@/src/services/other";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import SkeletonLoader from "@/components/TripsSkeletonLoader";

dayjs.extend(localizedFormat);

const Trip = () => {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const handlePress = (path) => {
    router.push(path);
  };

  const [activeTab, setActiveTab] = useState(tab || "toBeFueled");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: toBeFueledData = [],
    isLoading: isToBeFueledProgressLoading,
    error: toBeFueledError,
    refetch: refetchToBeFueled,
  } = useQuery({
    queryKey: ["getFuelReqToBeFueledByVendor"],
    queryFn: getFuelAttendantTripsToBeFueled,
  });

  const {
    data: fueledData = [],
    isLoading: fueledProgressLoading,
    error: fueledError,
    refetch: refetchFueled,
  } = useQuery({
    queryKey: ["getRequestsFueledByVendor"],
    queryFn: getFuelAttendantTripsFueled,
  });

  const handleTripsFueledRefresh=async()=>{
    setRefreshing(true);
    await refetchFueled(), 
    setRefreshing(false);
  }

  const handleTripsToBeFueledRefresh=async()=>{
    setRefreshing(true);
    await refetchToBeFueled(), 
    setRefreshing(false);
  }

  const renderToBeFueledTripsItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(`/fuel-attendant/trip/confirm-fuel/${item.request_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.truck_model}
          </Text>
          <Badge label="To be Fueled" variant="initiated" />
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-xs text-[#A5A6AB]">
              {item.driver_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {dayjs(item.created_at).format("LL")} {" "}
              {item.truck_plate_number}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderToBeFueledTripsContent = () => {
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
    if (isToBeFueledProgressLoading) {
      <View className="flex items-center justify-center mt-10">
        {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
        <ActivityIndicator />
      </View>;
    }

    if (toBeFueledError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          {/* <Text className="text-lg text-red-500">
            Error: {toBeFueledError.message}
          </Text> */}
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => refetchToBeFueled()}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (toBeFueledData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">
            No trips to be fueled at this time.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={toBeFueledData}
        renderItem={renderToBeFueledTripsItem}
        keyExtractor={(item) => item.request_id}
        contentContainerStyle={{ paddingBottom: 150 }}
        className="mt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleTripsToBeFueledRefresh}
          />
        }
      />
    );
  };

  const renderTripsFeuledIem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(`/screens/fuelAttendant/${item.trip_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.truck_model}
          </Text>
          <Badge label="Fueled" variant="initiated" />
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {item.driver_name} 
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
                {item.truck_plate_number} - {""}
                {item.truck_model}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTripsFeuledContent = () => {
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
    if (fueledProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
          <ActivityIndicator />
        </View>
      );
    }

    if (fueledError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          {/* <Text className="text-lg text-red-500">
              Error: {fueledError.message}
            </Text> */}
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => refetchFueled()}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (fueledData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">No data found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={fueledData}
        renderItem={renderTripsFeuledIem}
        keyExtractor={(item) => item.request_id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleTripsFueledRefresh}
          />
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
          <Text className="text-[#1D1E20] font-extrabold text-2xl">Fuelling</Text>
          <Text className="text-[#394F91] text-sm">Need Help?</Text>
        </View>

        {/* Search Bar */}
        <View className="mt-4 mx-6 mb-2  flex-row items-center border-gray-300 border bg-white rounded-lg p-4">
          <SearchIcon />
          <TextInput
            placeholder="Find Vendor"
            className="ml-2 flex-1 text-[#CDCDD0]"
          />
          <FilterIcon />
        </View>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="toBeFueled" title="To Be Fueled" />
            <TabsTrigger value="fueled" title="Fueled" />
          </TabsList>

          <TabsContent value="toBeFueled">
            {renderToBeFueledTripsContent()}
          </TabsContent>

          <TabsContent value="fueled">{renderTripsFeuledContent()}</TabsContent>
        </Tabs>

        <View className="w-full mx-6"></View>
      </View>
    </SafeAreaView>
  );
};

export default Trip;
