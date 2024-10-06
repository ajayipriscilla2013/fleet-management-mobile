import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import LocationIcon from "@/assets/svgs/location3.svg";
import OriginIcon from "@/assets/svgs/record-circle.svg";
import TruckIcon from "@/assets/svgs/truck2.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useQuery } from "@tanstack/react-query";
import { getTripDetailsforCustomer } from "@/src/services/customer";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import EmptyScreen from "@/assets/svgs/empty.svg";

dayjs.extend(localizedFormat);

const TripDetailsScreen = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };
  const { tripId: tripId } = useLocalSearchParams();
  console.log("trip_ID", tripId);

  const {
    data: tripsDetailsData,
    isLoading: isLoadingTripsDetails,
    isError: isErrorTripsDetails,
    refetch,
  } = useQuery({
    queryKey: ["CustomerTripDetails"],
    queryFn: () => getTripDetailsforCustomer(tripId),
  });

  useEffect(() => {
    refetch()
  }, [tripId]); 

  const renderActionButton = () => {
    const status = tripsDetailsData?.status?.toLowerCase();
    
    if (status === "initiated") {
      return (
        <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4 mt-6"
          onPress={() => handlePress(`/screens/customer/confirmLoading/${tripId}`)}
        >
          <Text className="text-white text-center font-semibold">
            Confirm Loading Point
          </Text>
        </TouchableOpacity>
      );
    } else if (status === "in_progress") {
      return (
        <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4 mt-6"
          onPress={() => handlePress(`/screens/customer/confirmOffloading/${tripId}`)}
        >
          <Text className="text-white text-center font-semibold">
            Confirm Offloading Point
          </Text>
        </TouchableOpacity>
      );
    }
    
    // If status is "completed" or any other status, no button is rendered
    return null;
  };

  const renderTripInfo = () => (
    <ScrollView className="flex-1 pt-6">
      <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <OriginIcon />
                <Text className="text-gray-600 ml-1">
                  {tripsDetailsData?.origin_name}
                </Text>
              </View>

              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">
                  Truck Takeoff
                </Text>
              </View>
              <View className="flex-row items-center">
                <LocationIcon />
                <Text className="text-gray-600 ml-1">
                  {tripsDetailsData?.destination_name}
                </Text>
              </View>
              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">Destination</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 mb-6 ">
              <View className=" border-b-[1px] border-[#F0F1F1]">
                <Text className="text-lg font-bold mb-2">Trip Information</Text>
              </View>
              {[
                { label: "Trip ID", value: tripsDetailsData?.trip_id },
                {
                  label: "Loading Point",
                  value: tripsDetailsData?.origin_name,
                },
                {
                  label: "Offloading Point",
                  value: tripsDetailsData?.destination_name,
                },
                {
                  label: "Status",
                  value: tripsDetailsData?.status,
                  color: "text-yellow-600",
                },
                { label: "Start Date", value: "Sep 1, 2024" },
                {
                  label: "Delivery Time",
                  value: dayjs(tripsDetailsData?.delivery_time).format("LL"),
                },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                >
                  <Text className="text-[#A5A6AB]">{item.label}</Text>
                  <Text className={item.color || "font-semibold"}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
      {renderActionButton()}
    </ScrollView>
  );

  const renderLoadingPoint = () => {
    const status = tripsDetailsData?.status?.toLowerCase();
    if (status === "initiated") {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">No loading data available yet</Text>
        </View>
      );
    }
    return (
      <ScrollView className="flex-1 pt-6">
         <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <OriginIcon />
                <Text className="text-gray-600 ml-1">
                  {tripsDetailsData?.origin_name}
                </Text>
              </View>

              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">
                  Truck Takeoff
                </Text>
              </View>
              <View className="flex-row items-center">
                <LocationIcon />
                <Text className="text-gray-600 ml-1">
                  {tripsDetailsData?.destination_name}
                </Text>
              </View>
              <View className="flex-row gap-1  ml-5">
                <TruckIcon />
                <Text className="text-xs text-gray-400  mb-2">Destination</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg p-4 mb-6 ">
              <View className=" border-b-[1px] border-[#F0F1F1]">
                <Text className="text-lg font-bold mb-2">
                  Loading Point Details
                </Text>
              </View>
              {[
                {
                  label: "Tonnage Loaded",
                  value: tripsDetailsData?.loading_qty,
                },
                { label: "Destination", value: tripsDetailsData?.origin_name },
                {
                  label: "Offloading Point",
                  value: tripsDetailsData?.destination_name,
                },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                >
                  <Text className="text-[#A5A6AB]">{item.label}</Text>
                  <Text className={item.color || "font-semibold"}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
      </ScrollView>
    );
  };

  const renderOffloadingPoint = () => {
    const status = tripsDetailsData?.status?.toLowerCase();
    if (status === "initiated" || status === "in_progress") {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">No offloading data available yet</Text>
        </View>
      );
    }
    return (
      <ScrollView className="flex-1 pt-6">
          <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
                <View className="flex-row items-center mb-2">
                  <OriginIcon />
                  <Text className="text-gray-600 ml-1">
                    {tripsDetailsData?.origin_name}
                  </Text>
                </View>

                <View className="flex-row gap-1  ml-5">
                  <TruckIcon />
                  <Text className="text-xs text-gray-400  mb-2">
                    Truck Takeoff
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <LocationIcon />
                  <Text className="text-gray-600 ml-1">
                    {tripsDetailsData?.destination_name}
                  </Text>
                </View>
                <View className="flex-row gap-1  ml-5">
                  <TruckIcon />
                  <Text className="text-xs text-gray-400  mb-2">
                    Destination
                  </Text>
                </View>
              </View>

              <View className="bg-white rounded-lg p-4 mb-6 ">
                <View className=" border-b-[1px] border-[#F0F1F1]">
                  <Text className="text-lg font-bold mb-2">
                    Offloading Point Details
                  </Text>
                </View>
                {[
                  {
                    label: "Tonnage Offloaded",
                    value: tripsDetailsData?.loading_qty,
                  },
                  {
                    label: "Destination",
                    value: tripsDetailsData?.destination_name,
                  },
                  { label: "Remark", value: "Successful Trip" },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                  >
                    <Text className="text-[#A5A6AB]">{item.label}</Text>
                    <Text className={item.color || "font-semibold"}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
      </ScrollView>
    );
  };

  if (isLoadingTripsDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#394F91" />
        <Text className="mt-4 text-gray-600">Loading trip details...</Text>
      </SafeAreaView>
    );
  }

  if (isErrorTripsDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500">Error loading trip details. Please try again.</Text>
        <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4"
          onPress={() => refetch()}
        >
          <Text className="text-white text-center font-semibold">
            Retry
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs defaultValue="tripInfo">
        <TabsList>
          <TabsTrigger value="tripInfo" title="Trip Info" />
          <TabsTrigger value="loadingPoint" title="Loading Point" />
          <TabsTrigger value="offLoadingPoint" title="Off Loading Point" />
        </TabsList>

        <TabsContent className="flex-1 px-6 bg-[#F9F9F9]" value="tripInfo">
          {renderTripInfo()}
        </TabsContent>

        <TabsContent className="flex-1 px-6 bg-[#F9F9F9]" value="loadingPoint">
          {renderLoadingPoint()}
        </TabsContent>

        <TabsContent
          className="flex-1 px-6 bg-[#F9F9F9]"
          value="offLoadingPoint"
        >
          {renderOffloadingPoint()}
        </TabsContent>
      </Tabs>

      
    </SafeAreaView>
  );
};

export default TripDetailsScreen;


  {/* <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4 mt-6"
            onPress={() =>
              handlePress(`/screens/customer/confirmOffloading/${tripId}`)
            }
          >
            <Text className="text-white text-center font-semibold">
              Confirm Offloading Point
            </Text>
          </TouchableOpacity> */}


        //   <TabsContent className="flex-1 px-6 bg-[#F9F9F9]" value="tripInfo">
        //   <ScrollView className="flex-1  pt-6">
        //     <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
        //       <View className="flex-row items-center mb-2">
        //         <OriginIcon />
        //         <Text className="text-gray-600 ml-1">
        //           {tripsDetailsData?.origin_name}
        //         </Text>
        //       </View>

        //       <View className="flex-row gap-1  ml-5">
        //         <TruckIcon />
        //         <Text className="text-xs text-gray-400  mb-2">
        //           Truck Takeoff
        //         </Text>
        //       </View>
        //       <View className="flex-row items-center">
        //         <LocationIcon />
        //         <Text className="text-gray-600 ml-1">
        //           {tripsDetailsData?.destination_name}
        //         </Text>
        //       </View>
        //       <View className="flex-row gap-1  ml-5">
        //         <TruckIcon />
        //         <Text className="text-xs text-gray-400  mb-2">Destination</Text>
        //       </View>
        //     </View>

        //     <View className="bg-white rounded-lg p-4 mb-6 ">
        //       <View className=" border-b-[1px] border-[#F0F1F1]">
        //         <Text className="text-lg font-bold mb-2">Trip Information</Text>
        //       </View>
        //       {[
        //         { label: "Trip ID", value: tripsDetailsData?.trip_id },
        //         {
        //           label: "Loading Point",
        //           value: tripsDetailsData?.origin_name,
        //         },
        //         {
        //           label: "Offloading Point",
        //           value: tripsDetailsData?.destination_name,
        //         },
        //         {
        //           label: "Status",
        //           value: tripsDetailsData?.status,
        //           color: "text-yellow-600",
        //         },
        //         { label: "Start Date", value: "Sep 1, 2024" },
        //         {
        //           label: "Delivery Time",
        //           value: dayjs(tripsDetailsData?.delivery_time).format("LL"),
        //         },
        //       ].map((item, index) => (
        //         <View
        //           key={index}
        //           className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
        //         >
        //           <Text className="text-[#A5A6AB]">{item.label}</Text>
        //           <Text className={item.color || "font-semibold"}>
        //             {item.value}
        //           </Text>
        //         </View>
        //       ))}
        //     </View>
        //     {renderActionButton()}

        //     {/* {tripsDetailsData?.customer_loading_confirmed === 1 ? (
        //       <TouchableOpacity
        //         className="bg-[#394F91] rounded-2xl p-4 mt-6"
        //         onPress={() =>
        //           handlePress(`/screens/customer/confirmOffloading/${tripId}`)
        //         }
        //       >
        //         <Text className="text-white text-center font-semibold">
        //           Confirm Offloading Point
        //         </Text>
        //       </TouchableOpacity>
        //     ) : (
        //       <TouchableOpacity
        //         className="bg-[#394F91] rounded-2xl p-4 mt-6"
        //         onPress={() =>
        //           handlePress(`/screens/customer/confirmLoading/${tripId}`)
        //         }
        //       >
        //         <Text className="text-white text-center font-semibold">
        //           Confirm Loading Point
        //         </Text>
        //       </TouchableOpacity>
        //     )} */}
        //   </ScrollView>
        // </TabsContent>

        // <ScrollView className="flex-1  pt-6">
        //     <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
        //       <View className="flex-row items-center mb-2">
        //         <OriginIcon />
        //         <Text className="text-gray-600 ml-1">
        //           {tripsDetailsData?.origin_name}
        //         </Text>
        //       </View>

        //       <View className="flex-row gap-1  ml-5">
        //         <TruckIcon />
        //         <Text className="text-xs text-gray-400  mb-2">
        //           Truck Takeoff
        //         </Text>
        //       </View>
        //       <View className="flex-row items-center">
        //         <LocationIcon />
        //         <Text className="text-gray-600 ml-1">
        //           {tripsDetailsData?.destination_name}
        //         </Text>
        //       </View>
        //       <View className="flex-row gap-1  ml-5">
        //         <TruckIcon />
        //         <Text className="text-xs text-gray-400  mb-2">Destination</Text>
        //       </View>
        //     </View>

        //     <View className="bg-white rounded-lg p-4 mb-6 ">
        //       <View className=" border-b-[1px] border-[#F0F1F1]">
        //         <Text className="text-lg font-bold mb-2">
        //           Loading Point Details
        //         </Text>
        //       </View>
        //       {[
        //         {
        //           label: "Tonnage Loaded",
        //           value: tripsDetailsData?.loading_qty,
        //         },
        //         { label: "Destination", value: tripsDetailsData?.origin_name },
        //         {
        //           label: "Offloading Point",
        //           value: tripsDetailsData?.destination_name,
        //         },
        //       ].map((item, index) => (
        //         <View
        //           key={index}
        //           className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
        //         >
        //           <Text className="text-[#A5A6AB]">{item.label}</Text>
        //           <Text className={item.color || "font-semibold"}>
        //             {item.value}
        //           </Text>
        //         </View>
        //       ))}
        //     </View>

        //     {/* {tripsDetailsData?.customer_loading_confirmed === 1 ? (
        //       <TouchableOpacity
        //         className="bg-[#394F91] rounded-2xl p-4 mt-6"
        //         onPress={() =>
        //           handlePress(`/screens/customer/confirmOffloading/${tripId}`)
        //         }
        //       >
        //         <Text className="text-white text-center font-semibold">
        //           Confirm Offloading Point
        //         </Text>
        //       </TouchableOpacity>
        //     ) : (
        //       <TouchableOpacity
        //         className="bg-[#394F91] rounded-2xl p-4 mt-6"
        //         onPress={() =>
        //           handlePress(`/screens/customer/confirmLoading/${tripId}`)
        //         }
        //       >
        //         <Text className="text-white text-center font-semibold">
        //           Confirm Loading Point
        //         </Text>
        //       </TouchableOpacity>
        //     )} */}
        //   </ScrollView>


        // {tripsDetailsData?.customer_offloading_confirmed === 0 ? (
        //   <View className="flex items-center justify-center mt-10">
        //     <EmptyScreen />
           
        //   </View>
        // ) : (
        //   <ScrollView className="flex-1  pt-6">
        //     <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
        //       <View className="flex-row items-center mb-2">
        //         <OriginIcon />
        //         <Text className="text-gray-600 ml-1">
        //           {tripsDetailsData?.origin_name}
        //         </Text>
        //       </View>

        //       <View className="flex-row gap-1  ml-5">
        //         <TruckIcon />
        //         <Text className="text-xs text-gray-400  mb-2">
        //           Truck Takeoff
        //         </Text>
        //       </View>
        //       <View className="flex-row items-center">
        //         <LocationIcon />
        //         <Text className="text-gray-600 ml-1">
        //           {tripsDetailsData?.destination_name}
        //         </Text>
        //       </View>
        //       <View className="flex-row gap-1  ml-5">
        //         <TruckIcon />
        //         <Text className="text-xs text-gray-400  mb-2">
        //           Destination
        //         </Text>
        //       </View>
        //     </View>

        //     <View className="bg-white rounded-lg p-4 mb-6 ">
        //       <View className=" border-b-[1px] border-[#F0F1F1]">
        //         <Text className="text-lg font-bold mb-2">
        //           Offloading Point Details
        //         </Text>
        //       </View>
        //       {[
        //         {
        //           label: "Tonnage Offloaded",
        //           value: tripsDetailsData?.loading_qty,
        //         },
        //         {
        //           label: "Destination",
        //           value: tripsDetailsData?.destination_name,
        //         },
        //         { label: "Remark", value: "Successful Trip" },
        //       ].map((item, index) => (
        //         <View
        //           key={index}
        //           className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
        //         >
        //           <Text className="text-[#A5A6AB]">{item.label}</Text>
        //           <Text className={item.color || "font-semibold"}>
        //             {item.value}
        //           </Text>
        //         </View>
        //       ))}
        //     </View>
            

        //     {renderActionButton()}
        //   </ScrollView>
        // )}