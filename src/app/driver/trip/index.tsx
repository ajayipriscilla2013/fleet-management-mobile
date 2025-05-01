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
  Alert,
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
  getFuelRequestStatus,
  getInitiatedTripsForDriver,
  getInProgressTripsForDriver,
} from "@/src/services/drivers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EmptyScreen from "@/assets/svgs/empty.svg";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import SkeletonLoader from "@/components/TripsSkeletonLoader";
import { requestFuel,  } from "@/src/services/other";

dayjs.extend(localizedFormat);

const Trip = () => {
  const tripId = 12334
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState(tab || "initiated");
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing

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
      queryClient.invalidateQueries("fuelRequestStatus")
    },
    onError: (error) => {
      // Check if the error response contains a message
      const errorMessage =
        error.message || "Request Failed, Try Again";
      console.log(error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const makeFuelEntryMutation = useMutation({
    mutationFn: () => makeFuelEntry(), // You'll need to create this function in your services
    onSuccess: () => {
      console.log("Fuel Entry Made");
      Alert.alert("Success", "Fuel Entry Made");
      refetchFuelStatus();
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
    // Navigate to fuel entry screen or trigger the mutation
    router.push(`/driver/trip/make-fuel-entry`);
    // Alternatively, if you want to use mutation:
    // makeFuelEntryMutation.mutate();
  };

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
    refetchFuelStatus();
  }, []);

  // Handle refreshing logic
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchInitiatedTrips(),
      refetchInProgressTrips(),
      refetchDeliveredTrips(),
      refetchFuelStatus(),
    ]);
    setRefreshing(false);
  };

  const handlePress = (path) => {
    router.push(path);
  };

  const renderTripItem = (item, status) => (
    <TouchableOpacity
      onPress={() => handlePress(`/driver/trip/${item.trip_id}`)}
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

  // Determine which button to render based on the fuel request status
  // const renderFuelButton = () => {
  //   if (isFuelStatusLoading) {
  //     return (
  //       <TouchableOpacity
  //         className="absolute bottom-4 right-4 w-1/3 bg-gray-400 p-4 rounded-lg items-center z-10"
  //         disabled={true}
  //       >
  //         <ActivityIndicator color="#ffffff" />
  //       </TouchableOpacity>
  //     );
  //   }

  //   // Check if there's a fuel request and if its status is approved
  //   const isApproved = fuelRequestData?.fuel_request?.status !== "approved";
  //   const fuelingStatus = fuelRequestData?.fuel_request?.fueling_status !== "not_fueled";
  //   const notFound = fuelRequestData?.error === "Not Found"

  //   console.log(fuelRequestData);
    
    
  //   // console.log("fuelRequestData?",fuelRequestData.status  );
  //   // console.log("isApproved?",isApproved);
    

  //   if (isApproved && fuelingStatus) {
  //     return (
  //       <TouchableOpacity
  //         onPress={handleMakeFuelEntry}
  //         className="absolute bottom-4 right-4 w-1/3  bg-[#394F91] p-4 rounded-lg items-center z-10"
  //       >
  //         <Text className="text-white font-bold text-xs">Make Fuel Entry</Text>
  //       </TouchableOpacity>
  //     );
  //   } 
  //   // else if (notFound) {
  //   //   return (
  //   //     <TouchableOpacity
  //   //       onPress={handleFuelRequest}
  //   //       className="absolute bottom-4 right-4 w-1/3 bg-[#394F91] p-4 rounded-lg items-center z-10"
  //   //       disabled={mutation.isPending}
  //   //     >
  //   //       {mutation.isPending ? (
  //   //         <ActivityIndicator color="#ffffff" />
  //   //       ) : (
  //   //         <Text className="text-white font-bold">Get Fuel</Text>
  //   //       )}
  //   //     </TouchableOpacity>
  //   //   );
  //   // } 
  //   else {
  //     return (
  //       <TouchableOpacity
  //         onPress={handleFuelRequest}
  //         className="absolute bottom-4 right-4 w-1/3 bg-[#394F91] p-4 rounded-lg items-center z-10"
  //         disabled={mutation.isPending}
  //       >
  //         {mutation.isPending ? (
  //           <ActivityIndicator color="#ffffff" />
  //         ) : (
  //           <Text className="text-white text-xs font-bold">Request for Fuel</Text>
  //         )}
  //       </TouchableOpacity>
  //     );
  //   }
  // };

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

      {/* Dynamic fuel button */}
      {renderFuelButton()}
    </SafeAreaView>
  );
};

export default Trip;