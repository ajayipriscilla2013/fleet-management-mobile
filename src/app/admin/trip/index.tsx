import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import LocationIcon from "@/assets/svgs/location2.svg";
import CalendarIcon from "@/assets/svgs/calendar.svg";
import ArrowIcon from "@/assets/svgs/arrow-right2.svg";
import { Badge } from "@/components/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCompletedTrips,
  getFuelRequests,
  getInitiatedTrips,
  getInProgressTrips,
  getTripsWithClosingRequest,
} from "@/src/services/other";
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
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState(tab || 'initiated');
  
  
  

  const {
    data: initiatedTripsData=[],
    isLoading: isInitiatedProgressLoading,
    error: initiatedError,
    refetch:refetchInitiatedTripsData
  } = useQuery({
    queryKey: ["initiatedTripsForAdmin"],
    queryFn: getInitiatedTrips,
  });

  const {
    data: inProgressTripsData = [],
    error: inProgressError,
    isError: isInProgressError,
    isLoading: isInProgressLoading,
    refetch:refetchInProgressTripsData
  } = useQuery({
    queryKey: ["inProgressTripsForAdmin"],
    queryFn: getInProgressTrips,
  });

  const {
    data: deliveredTripsData = [],
    error: deliveredError,
    isError: isDeliveredError,
    isLoading: isDeliveredLoading,
    refetch: refetchDeliveredTripsData
  } = useQuery({
    queryKey: ["deliveredTripsForAdmin"],
    queryFn: getCompletedTrips,
  });

  const {
    data: TripsRequestedToBeClosedData = [],
    error: TripsRequestedToBeClosedError,
    isError: TripsRequestedToBeClosedisError,
    isLoading: TripsRequestedToBeClosedLoading,
    refetch: refetchTripsRequestedToBeClosedData
  } = useQuery({
    queryKey: ["TripsRequestedToBeClosedForAdmin"],
    queryFn: getTripsWithClosingRequest,
  });


  const {
    data: pendingFuelRequestData=[],
    isLoading: pendingFuelRequestDataProgressLoading,
    error: pendingFuelRequestDataError,
    refetch:refetchPendingFuelRequestData
  } = useQuery({
    queryKey: ["Pending Fuel Requests"],
    queryFn: getFuelRequests,
  });

  const handleInitiatedTripsDataRefresh = async () => {
    setRefreshing(true);
    await refetchInitiatedTripsData()
    setRefreshing(false);
  };

  const handleInProgressTripsDataRefresh = async () => {
    setRefreshing(true);
    await refetchInProgressTripsData()
    setRefreshing(false);
  };

  const handleDeliveredTripsDataRefresh = async () => {
    setRefreshing(true);
    await refetchDeliveredTripsData()
    setRefreshing(false);
  };

  const handleTripsRequestedToBeClosedDataRefresh = async () => {
    setRefreshing(true);
    await refetchTripsRequestedToBeClosedData()
    setRefreshing(false);
  };

  const handleTripsRequiringFuellingDataRefresh = async () => {
    setRefreshing(true);
    await refetchPendingFuelRequestData()
    setRefreshing(false);
  };

  const handleFuellingRequestsDataRefresh = async () => {
    setRefreshing(true);
    await refetchPendingFuelRequestData()
    setRefreshing(false);
  };

  useEffect(()=>{
    refetchInitiatedTripsData()
    refetchInProgressTripsData()
    refetchDeliveredTripsData()
    refetchPendingFuelRequestData()
  },[])

  const renderInititatedTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/admin/trip/${item.trip_id}?status=initiated`
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

  const renderInProgressTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/admin/trip/${item.trip_id}?status=inprogress`
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

  const renderDeliveredTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/admin/trip/${item.trip_id}?status=delivered`
        )
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.trip_id}
          </Text>
          <Badge label="Delivered" variant="delivered" />
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
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
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
          onPress={() => refetchInProgressTripsData()}
        >
          <Text className="text-white text-center font-semibold">
            Retry
          </Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={handleInProgressTripsDataRefresh} />
        }
      />
    );
  };

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
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
          <ActivityIndicator />
        </View>
      );
    }

    if (isDeliveredError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          {/* <Text className="text-lg text-red-500">
            Error: {deliveredError.message}
          </Text> */}
          <Text className="text-lg text-red-500">
           Request Failed, Try Again
          </Text>
          <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4"
          onPress={() => refetchDeliveredTripsData()}
        >
          <Text className="text-white text-center font-semibold">
            Retry
          </Text>
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
        className="mt-4 "
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={ 
          <RefreshControl refreshing={refreshing} onRefresh={handleDeliveredTripsDataRefresh} />
        }
      />
    );
  };

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
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
          <ActivityIndicator />
        </View>
      );
    }
    if (initiatedError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
            Request Failed, Try Again 
          </Text>
          <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4"
          onPress={() => refetchInitiatedTripsData()}
        >
          <Text className="text-white text-center font-semibold">
            Retry
          </Text>
        </TouchableOpacity>
        </View>
      );
    }
    if (initiatedTripsData.length === 0) {
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
        data={initiatedTripsData}
        renderItem={renderInititatedTripItem}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={ 
          <RefreshControl refreshing={refreshing} onRefresh={handleInitiatedTripsDataRefresh} />
        }
      />
    );
  };

  const renderTripClosingContent = () => {
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
    if (TripsRequestedToBeClosedLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          <ActivityIndicator />
        </View>
      );
    }

    if (TripsRequestedToBeClosedError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
          Request Failed, Try Again 
          </Text>
          <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4"
          onPress={() => refetchTripsRequestedToBeClosedData()}
        >
          <Text className="text-white text-center font-semibold">
            Retry
          </Text>
        </TouchableOpacity>
        </View>
      );
    }

    if (TripsRequestedToBeClosedData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">
            No trips requestes to be closed.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={TripsRequestedToBeClosedData}
        renderItem={renderTripClosingItem}
        keyExtractor={(item) => item.trip_id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={ 
          <RefreshControl refreshing={refreshing} onRefresh={handleTripsRequestedToBeClosedDataRefresh} />
        }
      />
    );
  };

  const renderTripClosingItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/admin/trip/${item.trip_id}?status=inprogress`
        )
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.trip_id}
          </Text>
          <Badge label="ToBeClosed" variant="delivered" />
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

  const handleItemClick = (item, status) => {
    const payload = {
      fuel_request_id: item.fuel_request_id, // Extract from item
      status: status, // Pass either "approved" or "declined"
      vendor_id: item.vendor_id, // Replace with actual vendor_id
      admin_id: "fma3998", // Replace with dynamic admin_id
      dataname: "confirmFuelRequest",
    };
  
    confirmFuelRequest(payload);
  };
  

  const mutation = useMutation({
    mutationFn:() =>confirmFuelRequest(),
    onSuccess: () => {
      console.log("Fuel Requested");
      Alert.alert("Success", "Fuel Requested");
    },
    onError: (error) => {
      // Check if the error response contains a message
      const errorMessage =
        // error.response?.data?.message || "Request Failed, Try Again";
        error.data?.message || "Request Failed, Try Again";

      console.error("Error submitting data:", error.data.message);
      Alert.alert("Error", `${errorMessage}`);
     
    },
  });

  const renderPendingFuelRequestItem=({item})=>(
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/admin/trip/fuel-confirmation?requestId=${item.id}`
        )
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            Request Id- {item.id}
          </Text>
          <Badge label="Pending Fuel Request" variant="initiated" />
        </View>

        <View className="flex flex-row items-end justify-between">
          <View>
            <View className="flex-row items-center gap-1">
              <LocationIcon />
              <Text className="text-xs text-[#A5A6AB]">
               Driver: {item.driver_id} 
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <CalendarIcon />
              <Text className="text-xs text-[#A5A6AB]">
               Requested on {dayjs(item.created_at).format("LL")} 
              </Text>
            </View>
          </View>
          <ArrowIcon />
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderPendingFuelRequestContent= ()=>{
    if (refreshing) {
      return (
        <View>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </View>
      );
    }
    if (pendingFuelRequestDataProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          <ActivityIndicator />
        </View>
      );
    }

    if (pendingFuelRequestDataError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
          Request Failed, Try Again 
          </Text>
          <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4"
          onPress={() => refetchTripsRequestedToBeClosedData()}
        >
          <Text className="text-white text-center font-semibold">
            Retry
          </Text>
        </TouchableOpacity>
        </View>
      );
    }

    if (pendingFuelRequestData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">
            No Pending trips requiring Fuelling .
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={pendingFuelRequestData}
        renderItem={renderPendingFuelRequestItem}
        keyExtractor={(item) => item.id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={ 
          <RefreshControl refreshing={refreshing} onRefresh={handleTripsRequiringFuellingDataRefresh} />
        }
      />
    );
  }

  const tabs = [
    { value: "initiated", title: "Initiated Trips" },
    { value: "inProgress", title: "In-Progress Trips" },
    { value: "fuelRequests", title: "Fuel Requests" },
    { value: "fuelHistory", title: "Fueling History" },
    { value: "closeTrips", title: "Close Trip Requests" },
    { value: "delivered", title: "Delivered Trips" },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-[#F9F9F9]  "
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

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className=" ">
            <FlatList
              data={tabs}
              horizontal={true}
              keyExtractor={(item) => item.value}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TabsTrigger value={item.value} title={item.title} />
              )}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
                gap:8
              }}
            />
            {/* <TabsTrigger  value="initiated" title="Initiated Trips" />
            <TabsTrigger value="inProgress" title="In-Progress Trips" />
            <TabsTrigger value="delivered" title="Delivered Trips" />
            <TabsTrigger value="closeTrips" title="Close Trip Requests" /> */}
          </TabsList>

          <TabsContent value="initiated">
            {renderInitiatedContent()}
          </TabsContent>

          <TabsContent value="inProgress">
            {renderInProgressContent()}
          </TabsContent>

          <TabsContent value="fuelRequests">
            {renderPendingFuelRequestContent()}
          </TabsContent>

          <TabsContent value="delivered">
            {renderDeliveredContent()}
          </TabsContent>

          <TabsContent value="closeTrips">
            {renderTripClosingContent()}
          </TabsContent>
        </Tabs>
      </View>
      <TouchableOpacity
        onPress={() => handlePress("/admin/trip/create")}
        className="absolute bottom-4 right-4 w-1/2 bg-[#394F91] p-4 rounded-lg items-center z-10"
      >
        <Text className="text-white font-bold">+ Create Trip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Trip;
