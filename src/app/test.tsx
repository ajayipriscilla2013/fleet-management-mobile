import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import dayjs from "dayjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api"; // Adjust this import based on your project

const FuelRequestsScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch fuel requests with pagination
  const fetchFuelRequests = async ({ pageParam = 1 }) => {
    const vendor_agent_id = await AsyncStorage.getItem("user_id");
    
    try {
      const response = await API.post("trip/trip.php", {
        vendor_agent_id,
        dataname: "getFuelReqToBeFueledByVendor",
        page: pageParam,
      });
      
      console.log(`Fetched page ${pageParam}:`, response.data);
      
      // Return both the data and the next page information
      return {
        data: response.data.data,
        nextPage: response.data.length > 0 ? pageParam + 1 : undefined,
        currentPage: pageParam,
      };
    } catch (error) {
      console.error(`Error fetching page ${pageParam}:`, error);
      throw error;
    }
  };

  // Use React Query's useInfiniteQuery for pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["fuelRequests"],
    queryFn: fetchFuelRequests,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Handle refresh - this will reset pagination and fetch first page
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Load more data when user reaches the end of the list
  const loadMoreData = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Flatten the data from paginated results
  const fuelRequests = data?.pages.flatMap(page => page.data) || [];

  // Render each fuel request item
  const renderFuelRequestItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/fuel-attendant/trip/confirm-fuel/${item.request_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.truck_model || "Unknown Model"}
          </Text>
          <View className="bg-blue-100 px-2 py-1 rounded">
            <Text className="text-blue-700 text-xs">To be Fueled</Text>
          </View>
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="text-xs text-[#A5A6AB]">
                {item.driver_name || "Unknown Driver"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-xs text-[#A5A6AB]">
                {item.created_at ? dayjs(item.created_at).format("MMM D, YYYY") : "Unknown Date"} - {item.truck_plate_number || "No Plate"}
              </Text>
            </View>
          </View>
          <Text className="text-[#394F91]">→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render the footer with loading indicator or end message
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 flex items-center justify-center">
          <ActivityIndicator size="small" color="#394F91" />
          <Text className="text-gray-500 mt-2">Loading more...</Text>
        </View>
      );
    }
    
    if (!hasNextPage && fuelRequests.length > 0) {
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

  // Show loading state for initial load
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#394F91" />
      </View>
    );
  }

  // Show error state
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg mb-4">
          Failed to load fuel requests
        </Text>
        <TouchableOpacity
          className="bg-[#394F91] rounded-lg px-4 py-2"
          onPress={() => refetch()}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#F9F9F9]"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Fuel Requests</Text>
        
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-gray-500">
            {fuelRequests.length} fuel requests
          </Text>
          {data && (
            <Text className="text-[#394F91]">
              Page {data.pages.length} {hasNextPage ? "+" : ""}
            </Text>
          )}
        </View>
      </View>

      <FlatList
        data={fuelRequests}
        renderItem={renderFuelRequestItem}
        keyExtractor={(item, index) => `${item.request_id || index}`}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No fuel requests found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FuelRequestsScreen;