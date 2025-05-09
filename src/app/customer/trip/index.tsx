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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getCompletedTripsforCustomer,
  getInitiatedTripsforCustomer,
  getInProgressTripsforCustomer,
} from "@/src/services/customer";
import EmptyScreen from "@/assets/svgs/empty.svg";
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

  const [activeTab, setActiveTab] = useState(tab || "initiated");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: initiatedTripsPage=[],
    isLoading: isInitiatedProgressLoading,
    error: initiatedError,
    refetch: refetchInitiatedTrips,
    hasNextPage: hasInitiatedTripsNextPage,
    isFetchingNextPage:isFetchingInitiatedNextPage,
    fetchNextPage:fetchNextInitiatedPage
  } = useInfiniteQuery({
    queryKey: ["initiatedTripsForCustomer"],
    queryFn: getInitiatedTripsforCustomer,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam:1
  });

  const {
    data: inProgressTripsPage = [],
    error: inProgressError,
    isError: isInProgressError,
    isLoading: isInProgressLoading,
    refetch: refetchProgressTrips,
    hasNextPage: hasInProgressTripsNextPage,
    isFetchingNextPage:isFetchingInProgressNextPage,
    fetchNextPage:fetchNextInProgressTripsPage
  } = useInfiniteQuery({
    queryKey: ["inProgressTripsForCustomer"],
    queryFn: getInProgressTripsforCustomer,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam:1
  });

  const {
    data: deliveredTripsPage = [],
    error: deliveredError,
    isError: isDeliveredError,
    isLoading: isDeliveredLoading,
    refetch: refetchDeliveredTrips,
    hasNextPage: hasDeliveredTripsNextPage,
    isFetchingNextPage:isFetchingDeliveredTripsNextPage,
    fetchNextPage:fetchNextDeliveredTripsPage
  } = useInfiniteQuery({
    queryKey: ["deliveredTripsForCustomer"],
    queryFn: getCompletedTripsforCustomer,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam:1
  });

  const initatedTripsData =initiatedTripsPage.pages?.flatMap(page => page.data)
  const inProgressTripsData =inProgressTripsPage.pages?.flatMap(page => page.data)
  const deliveredTripsData =deliveredTripsPage.pages?.flatMap(page => page.data)



  //load more data for "Initiated Trips" tab
  const loadMoreInitiatedTripsData=()=>{
    if(hasInitiatedTripsNextPage && !isFetchingInitiatedNextPage){
      fetchNextInitiatedPage()
    }
  }
  //load more data for "InProgress Trips" tab
  const loadMoreInProgressTripsData=()=>{
    if(hasInProgressTripsNextPage && !isFetchingDeliveredTripsNextPage){
      fetchNextInProgressTripsPage()
    }
  }
  //load more data for "Deliveered Trips" tab
  const loadMoreDeliveredTripsData=()=>{
    if(hasDeliveredTripsNextPage && !isFetchingInProgressNextPage){
      fetchNextDeliveredTripsPage()
    }
  }



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


  useEffect(() => {
    refetchInitiatedTrips(), refetchProgressTrips(), refetchDeliveredTrips();
  }, []);

  const handleInitiatedTripsRefresh = async () => {
    setRefreshing(true);
    await refetchInitiatedTrips(), setRefreshing(false);
  };

  const handleInProgressTripsRefresh = async () => {
    setRefreshing(true);
    await refetchProgressTrips(), setRefreshing(false);
  };

  const handleDeliveredTripsRefresh = async () => {
    setRefreshing(true);
    await refetchDeliveredTrips();
    setRefreshing(false);
  };

  const renderInititatedTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/customer/trip/${item.trip_id}`
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
                {dayjs(item.start_date).format("LL")} to{" "}
                {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderInitiatedContent = () => {
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
    if (isInitiatedProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          <ActivityIndicator />
        </View>
      );
    }
    if (initiatedError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => {
              refetchInitiatedTrips();
            }}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (initatedTripsData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">
            No Initiated trips found.
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={initatedTripsData}
        renderItem={renderInititatedTripItem}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleInitiatedTripsRefresh}
          />
        }
        onEndReached={loadMoreInitiatedTripsData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={()=> renderFooter(
          hasInitiatedTripsNextPage,
          isFetchingInitiatedNextPage,
          initatedTripsData.length
        )}
        ListEmptyComponent={
                          <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500">No trips found</Text>
                          </View>
                        }
      />
    );
  };

  const renderInProgressTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/customer/trip/${item.trip_id}`
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
                {dayjs(item.start_date).format("LL")} to{" "}
                {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderInProgressContent = () => {
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }

    if (isInProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          <ActivityIndicator />
        </View>
      );
    }

    if (isInProgressError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          {/* <Text className="text-lg text-red-500">
            Error: {inProgressError.message}
          </Text> */}
          <Text className="text-lg text-red-500">
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => {
              refetchProgressTrips();
            }}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleInProgressTripsRefresh}
          />
        }
        onEndReached={loadMoreInProgressTripsData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={()=> renderFooter(
          hasInProgressTripsNextPage,
          isFetchingInProgressNextPage,
          inProgressTripsData.length
        )}
        ListEmptyComponent={
                          <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500">No trips found</Text>
                          </View>
                        }
      />
    );
  };

  const renderDeliveredTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/customer/trip/${item.trip_id}`
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
                {dayjs(item.start_date).format("LL")} to{" "}
                {dayjs(item.end_date).format("LL")}
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDeliveredContent = () => {
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
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
            Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => {
              refetchDeliveredTrips();
            }}
          >
            <Text className="text-white text-center font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (deliveredTripsData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
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
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleDeliveredTripsRefresh}
          />
        }
        onEndReached={loadMoreDeliveredTripsData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={()=> renderFooter(
          hasDeliveredTripsNextPage,
          isFetchingDeliveredTripsNextPage,
          deliveredTripsData.length
        )}
        ListEmptyComponent={
                          <View className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500">No trips found</Text>
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
