import React, { useState } from "react";
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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import LocationIcon from "@/assets/svgs/location2.svg";
import CalendarIcon from "@/assets/svgs/calendar.svg";
import ArrowIcon from "@/assets/svgs/arrow-right2.svg";
import { Badge } from "@/components/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useInfiniteQuery } from "@tanstack/react-query";
import EmptyScreen from "@/assets/svgs/empty.svg";
import SkeletonLoader from "@/components/TripsSkeletonLoader";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { 
  getFuelReqToBeFueledByVendor, 
  getReqsFueledByVendor 
} from "@/src/services/fuelAttendant";

dayjs.extend(localizedFormat);

const Trip = () => {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState(tab || "toBeFueled");
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = (path) => {
    router.push(path);
  };

  // To Be Fueled data query
  const {
    data: toBeFueledPages = {},
    isLoading: isToBeFueledProgressLoading,
    error: toBeFueledError,
    refetch: refetchToBeFueled,
    fetchNextPage: fetchNextToBeFueledPage,
    hasNextPage: hasToBeFueledNextPage,
    isFetchingNextPage: isFetchingToBeFueledNextPage
  } = useInfiniteQuery({
    queryKey: ["getFuelReqToBeFueledByVendor"],
    queryFn: getFuelReqToBeFueledByVendor,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Fueled data query
  const {
    data: fueledPages = {},
    isLoading: isFueledProgressLoading,
    error: fueledError,
    refetch: refetchFueled,
    fetchNextPage: fetchNextFueledPage,
    hasNextPage: hasFueledNextPage,
    isFetchingNextPage: isFetchingFueledNextPage
  } = useInfiniteQuery({
    queryKey: ["getReqsFueledByVendor"],
    queryFn: getReqsFueledByVendor,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Extract the flat data from pages
  const toBeFueledData = toBeFueledPages.pages?.flatMap(page => page.data) || [];
  const fueledData = fueledPages.pages?.flatMap(page => page.data) || [];

  // Handle refresh for "To Be Fueled" tab
  const handleToBeFueledRefresh = async () => {
    setRefreshing(true);
    await refetchToBeFueled();
    setRefreshing(false);
  };

  // Handle refresh for "Fueled" tab
  const handleFueledRefresh = async () => {
    setRefreshing(true);
    await refetchFueled();
    setRefreshing(false);
  };

  // Load more data for "To Be Fueled" tab
  const loadMoreToBeFueledData = () => {
    if (hasToBeFueledNextPage && !isFetchingToBeFueledNextPage) {
      fetchNextToBeFueledPage();
    }
  };

  // Load more data for "Fueled" tab
  const loadMoreFueledData = () => {
    if (hasFueledNextPage && !isFetchingFueledNextPage) {
      fetchNextFueledPage();
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

  const renderToBeFueledTripsItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(`/fuel-attendant/trip/confirm-fuel/${item.request_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg mb-2 py-[13px] px-[18px] bg-white">
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

  const renderFueledTripsItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(`/fuel-attendant/trip/view-fueled/${item.request_id}`)}
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg mb-2 py-[13px] px-[18px] bg-white">
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
    if (refreshing || isToBeFueledProgressLoading) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }

    if (toBeFueledError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4 mt-4"
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
      <>
       <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-gray-500">
                  {toBeFueledData.length} fuel requests
                </Text>
                {/* {toBeFueledData && (
                  <Text className="text-[#394F91]">
                    Page {toBeFueledData?.length} {hasToBeFueledNextPage ? "+" : ""}
                  </Text>
                )} */}
              </View>
      <FlatList
        data={toBeFueledData}
        renderItem={renderToBeFueledTripsItem}
        keyExtractor={(item, index) => `${item.request_id || index}`}
        contentContainerStyle={{ paddingBottom: 200 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleToBeFueledRefresh} />
        }
        onEndReached={loadMoreToBeFueledData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => renderFooter(
          hasToBeFueledNextPage, 
          isFetchingToBeFueledNextPage, 
          toBeFueledData.length
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No fuel requests found</Text>
          </View>
        }
      />

</>
    );
  };

  const renderFueledTripsContent = () => {
    if (refreshing || isFueledProgressLoading) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }

    if (fueledError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4 mt-4"
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
          <Text className="text-lg text-gray-500">No fueled trips found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={fueledData}
        renderItem={renderFueledTripsItem}
        keyExtractor={(item, index) => `${item.request_id || index}`}
        contentContainerStyle={{ paddingBottom: 200 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleFueledRefresh} />
        }
        onEndReached={loadMoreFueledData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => renderFooter(
          hasFueledNextPage, 
          isFetchingFueledNextPage, 
          fueledData.length
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No fueled trips found</Text>
          </View>
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
            <TabsTrigger value="toBeFueled" title="To Be Fueled" />
            <TabsTrigger value="fueled" title="Fueled" />
          </TabsList>

          <TabsContent value="toBeFueled">
            {renderToBeFueledTripsContent()}
          </TabsContent>

          <TabsContent value="fueled">
            {renderFueledTripsContent()}
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default Trip;