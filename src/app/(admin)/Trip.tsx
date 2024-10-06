import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs";
import { useQuery } from "@tanstack/react-query";
import {
  getCompletedTrips,
  getInitiatedTrips,
  getInProgressTrips,
  getTripsWithClosingRequest,
} from "@/src/services/other";
import EmptyScreen from "@/assets/svgs/empty.svg";

const Trip = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  const {
    data: initiatedTripsData,
    isLoading: isInitiatedProgressLoading,
    error: initiatedError,
  } = useQuery({
    queryKey: ["initiatedTrips"],
    queryFn: getInitiatedTrips,
  });

  const {
    data: inProgressTripsData = [],
    error: inProgressError,
    isError: isInProgressError,
    isLoading: isInProgressLoading,
  } = useQuery({
    queryKey: ["inProgressTrips"],
    queryFn: getInProgressTrips,
  });

  const {
    data: deliveredTripsData = [],
    error: deliveredError,
    isError: isDeliveredError,
    isLoading: isDeliveredLoading,
  } = useQuery({
    queryKey: ["deliveredTrips"],
    queryFn: getCompletedTrips,
  });

  const {
    data: TripsRequestedToBeClosedData = [],
    error: TripsRequestedToBeClosedError,
    isError: TripsRequestedToBeClosedisError,
    isLoading: TripsRequestedToBeClosedLoading,
  } = useQuery({
    queryKey: ["TripsRequestedToBeClosed"],
    queryFn: getTripsWithClosingRequest,
  });

  const renderInititatedTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/admin/AdminTripDetailsScreen?status=initiated&tripId=${item.trip_id}`
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

  const renderInProgressTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/admin/AdminTripDetailsScreen?status=inprogress&tripId=${item.trip_id}`
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

  const renderDeliveredTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/admin/AdminTripDetailsScreen?status=inprogress&tripId=${item.trip_id}`
        )
      }
    >
      <View className="flex h-[90px] mx-3 gap-2 rounded-lg  mb-2 py-[13px] px-[18px] bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-base text-[#1D1E20]">
            {item.trip_id}
          </Text>
          <Badge label="In Progress" variant="delivered" />
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

  const renderDeliveredContent = () => {
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
          <Text className="text-lg text-red-500">
            Error: {deliveredError.message}
          </Text>
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
      />
    );
  };

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

  const renderTripClosingContent = () => {
    if (TripsRequestedToBeClosedLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          {/* <Text className="text-lg text-gray-500">Loading...</Text> */}
          <ActivityIndicator />
        </View>
      );
    }

    if (TripsRequestedToBeClosedError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-red-500">
            Error: {TripsRequestedToBeClosedError.message}
          </Text>
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
      />
    );
  };

  const renderTripClosingItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        handlePress(
          `/screens/admin/AdminTripDetailsScreen?status=inprogress&tripId=${item.trip_id}`
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

  const tabs = [
    { value: "initiated", title: "Initiated Trips" },
    { value: "inProgress", title: "In-Progress Trips" },
    { value: "delivered", title: "Delivered Trips" },
    { value: "closeTrips", title: "Close Trip Requests" },
  ];

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

        <Tabs defaultValue="initiated">
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

          <TabsContent value="delivered">
            {renderDeliveredContent()}
          </TabsContent>

          <TabsContent value="closeTrips">
            {renderTripClosingContent()}
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
