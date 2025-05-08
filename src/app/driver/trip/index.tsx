import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import LocationIcon from "@/assets/svgs/location2.svg";
import CalendarIcon from "@/assets/svgs/calendar.svg";
import ArrowIcon from "@/assets/svgs/arrow-right2.svg";
import { Badge } from "@/components/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import {
  getCompletedTripsForDriver,
  getFuelRequestStatus,
  getInitiatedTripsForDriver,
  getInProgressTripsForDriver,
} from "@/src/services/drivers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EmptyScreen from "@/assets/svgs/empty.svg";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import SkeletonLoader from "@/components/TripsSkeletonLoader";
import { requestFuel } from "@/src/services/other";
import { useInfiniteQuery } from "@tanstack/react-query";

dayjs.extend(localizedFormat);

const Trip = () => {
  const { tab } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(tab || "initiated");
  const [refreshing, setRefreshing] = useState(false);

  // Query to get the current fuel request status
  const {
    data: fuelRequestData,
    isLoading: isFuelStatusLoading,
    error: fuelStatusError,
    refetch: refetchFuelStatus
  } = useQuery({
    queryKey: ["fuelRequestStatus"],
    queryFn: getFuelRequestStatus,
    refetchInterval: 5000,
  });

  const mutation = useMutation({
    mutationFn: () => requestFuel(),
    onSuccess: () => {
      console.log("Fuel Requested");
      Alert.alert("Success", "Fuel Requested");
      // Refetch the fuel status after a successful request
      refetchFuelStatus();
      queryClient.invalidateQueries("fuelRequestStatus");
    },
    onError: (error) => {
      const errorMessage = error.message || "Request Failed, Try Again";
      console.log(error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleFuelRequest = () => {
    mutation.mutate();
  };

  const handleMakeFuelEntry = () => {
    // Navigate to fuel entry screen
    router.push(`/driver/trip/make-fuel-entry`);
  };

  // Query for initiated trips
  const {
    data: initiatedTripsPage = [],
    isLoading: isInitiatedProgressLoading,
    error: initiatedError,
    refetch: refetchInitiatedTrips,
    fetchNextPage: fetchNextInitiatedTripsPage,
    hasNextPage: hasInitiatedTripsNextPage,
    isFetchingNextPage: isFetchingInitiatedTripsNextPage
  } = useInfiniteQuery({
    queryKey: ["initiatedTripsForDriver"],
    queryFn: getInitiatedTripsForDriver,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  // Query for in-progress trips
  const {
    data: inProgressTripsPage = [],
    error: inProgressError,
    isLoading: isInProgressLoading,
    refetch: refetchInProgressTrips,
    fetchNextPage: fetchNextInProgressTripsPage,
    hasNextPage: hasInProgressTripsNextPage,
    isFetchingNextPage: isFetchingInProgressTripsNextPage
  } = useInfiniteQuery({
    queryKey: ["inProgressTripsForDriver"],
    queryFn: getInProgressTripsForDriver,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Query for completed trips
  const {
    data: completedTripsPage = [],
    error: completedError,
    isLoading: isCompletedLoading,
    refetch: refetchCompletedTrips,
    fetchNextPage: fetchNextCompletedTripsPage,
    hasNextPage: hasCompletedTripsNextPage,
    isFetchingNextPage: isFetchingCompletedTripsNextPage
  } = useInfiniteQuery({
    queryKey: ["completedTripsForDriver"],
    queryFn: getCompletedTripsForDriver,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  useEffect(() => {
    refetchInitiatedTrips();
    refetchInProgressTrips();
    refetchCompletedTrips();
    refetchFuelStatus();
  }, []);

  // Handle refreshing logic
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchInitiatedTrips(),
      refetchInProgressTrips(),
      refetchCompletedTrips(),
      refetchFuelStatus(),
    ]);
    setRefreshing(false);
  };

  const handlePress = (path) => {
    router.push(path);
  };

  // Extract the flat data from pages
  const initiatedTripsData = initiatedTripsPage.pages?.flatMap(page => page.data) || [];
  const inProgressTripsData = inProgressTripsPage.pages?.flatMap(page => page.data) || [];
  const completedTripsData = completedTripsPage.pages?.flatMap(page => page.data) || [];

  // Load more functions for each tab
  const loadMoreInitiatedTripsData = () => {
    if (hasInitiatedTripsNextPage && !isFetchingInitiatedTripsNextPage) {
      fetchNextInitiatedTripsPage();
    }
  };

  const loadMoreInProgressTripsData = () => {
    if (hasInProgressTripsNextPage && !isFetchingInProgressTripsNextPage) {
      fetchNextInProgressTripsPage();
    }
  };

  const loadMoreCompletedTripsData = () => {
    if (hasCompletedTripsNextPage && !isFetchingCompletedTripsNextPage) {
      fetchNextCompletedTripsPage();
    }
  };

  const renderFooter = (hasNextPage, isFetchingNextPage, dataLength) => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 flex items-center justify-center">
          <ActivityIndicator size="small" color="#394F91" />
          <Text className="text-gray-500 mt-2">Loading more...</Text>
        </View>
      );
    }
    
    if (!hasNextPage && dataLength > 0) {
      return (
        <View className="py-4 flex items-center justify-center">
          <Text className="text-gray-500 text-sm">
            End of results
          </Text>
        </View>
      );
    }
    
    return null;
  };

  const renderTripItem = (item, status) => (
    <TouchableOpacity
      onPress={() => handlePress(`/driver/trip/${item.trip_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg mb-2 py-[13px] px-[18px] bg-white">
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

  const renderContent = (data, isLoading, error, status, loadMoreFunction, hasNextPage, isFetchingNextPage) => {
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
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => {
              refetchInitiatedTrips();
              refetchInProgressTrips();
              refetchCompletedTrips();
            }}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!data || data.length === 0) {
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
        onEndReached={loadMoreFunction}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => renderFooter(
          hasNextPage, 
          isFetchingNextPage, 
          data.length
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No trips found</Text>
          </View>
        }
      />
    );
  };

  const renderFuelButton = () => {
    if (isFuelStatusLoading) {
      return (
        <TouchableOpacity
          className="absolute bottom-4 right-4 w-1/3 bg-gray-400 p-4 rounded-lg items-center z-10"
          disabled={true}
        >
          <ActivityIndicator color="#ffffff" />
        </TouchableOpacity>
      );
    }
  
    // Check if the API returned a "Not Found" error
    const notFound = !fuelRequestData || fuelRequestData.error === "Not Found";
    
    // If no fuel request exists, show "Request for Fuel" button
    if (notFound) {
      return (
        <TouchableOpacity
          onPress={handleFuelRequest}
          className="absolute bottom-4 right-4 w-1/3 bg-[#394F91] p-4 rounded-lg items-center z-10"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-xs font-bold">Request for Fuel</Text>
          )}
        </TouchableOpacity>
      );
    }
    
    // If request exists and is approved and not yet fueled, show "Make Fuel Entry" button
    const isApproved = fuelRequestData?.fuel_request?.status === "approved";
    const notFueledYet = fuelRequestData?.fuel_request?.fueling_status === "not_fueled";
    
    if (isApproved && notFueledYet) {
      return (
        <TouchableOpacity
          onPress={handleMakeFuelEntry}
          className="absolute bottom-4 right-4 w-1/3 bg-[#394F91] p-4 rounded-lg items-center z-10"
        >
          <Text className="text-white font-bold text-xs">Make Fuel Entry</Text>
        </TouchableOpacity>
      );
    }
    
    // If request exists but is pending, show a disabled or status button
    const isPending = fuelRequestData?.fuel_request?.status === "pending";
    if (isPending) {
      return (
        <TouchableOpacity
          className="absolute bottom-4 right-4 w-1/3 bg-[#FFA500] p-4 rounded-lg items-center z-10"
          disabled={true}
        >
          <Text className="text-white font-bold text-xs">Fuel Request Pending</Text>
        </TouchableOpacity>
      );
    }
    
    // Default case (e.g., already fueled or other status)
    return (
      <TouchableOpacity
        onPress={handleFuelRequest}
        className="absolute bottom-4 right-4 w-1/3 bg-[#394F91] p-4 rounded-lg items-center z-10"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white text-xs font-bold">Request for Fuel</Text>
        )}
      </TouchableOpacity>
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
              "Initiated",
              loadMoreInitiatedTripsData,
              hasInitiatedTripsNextPage,
              isFetchingInitiatedTripsNextPage
            )}
          </TabsContent>
          <TabsContent value="inProgress">
            {renderContent(
              inProgressTripsData,
              isInProgressLoading,
              inProgressError,
              "In Progress",
              loadMoreInProgressTripsData,
              hasInProgressTripsNextPage,
              isFetchingInProgressTripsNextPage
            )}
          </TabsContent>
          <TabsContent value="completed">
            {renderContent(
              completedTripsData,
              isCompletedLoading,
              completedError,
              "Completed",
              loadMoreCompletedTripsData,
              hasCompletedTripsNextPage,
              isFetchingCompletedTripsNextPage
            )}
          </TabsContent>
        </Tabs>
      </View>

      {/* Dynamic fuel button */}
      {renderFuelButton()}
    </SafeAreaView>
  );
};

export default Trip;