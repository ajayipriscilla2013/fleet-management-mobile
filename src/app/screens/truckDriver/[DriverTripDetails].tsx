import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Pressable,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import LocationIcon from "@/assets/svgs/location3.svg";
import OriginIcon from "@/assets/svgs/record-circle.svg";
import TruckIcon from "@/assets/svgs/truck2.svg";
import Modal from "react-native-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Img1 from "@/assets/images/img1.png";
import Img2 from "@/assets/images/img2.png";
import Img3 from "@/assets/images/img3.png";
import { getSingleTrip } from "@/src/services/other";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DriverRequestToCloseTrip,
  getTripDetailsForDriver,
} from "@/src/services/drivers";
import EmptyScreen from "@/assets/svgs/empty.svg";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const SkeletonLoader = () => {
  return (
    <View className="px-4 pt-6">
      {/* Skeleton for the Origin/Destination Info */}
      <View className="bg-[#EEF0FB] rounded-lg p-4 mb-6">
        <View className="h-5 w-32 bg-gray-300 rounded mb-2" />
        <View className="h-4 w-24 bg-gray-300 rounded mb-1" />
        <View className="h-4 w-40 bg-gray-300 rounded mb-1" />
      </View>

      {/* Skeleton for Trip Information */}
      <View className="bg-white rounded-lg p-4 mb-6">
        <View className="h-6 w-40 bg-gray-300 rounded mb-4" />
        {new Array(6).fill(0).map((_, index) => (
          <View
            key={index}
            className="flex-row justify-between mb-1 border-b-[1px] border-[#F0F1F1] py-3"
          >
            <View className="h-4 w-20 bg-gray-300 rounded" />
            <View className="h-4 w-28 bg-gray-300 rounded" />
          </View>
        ))}
      </View>

      {/* Skeleton for Action Button */}
      <View className="h-10 w-full bg-gray-300 rounded-2xl mt-6" />
    </View>
  );
};

const TripDetailsScreen = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  const { DriverTripDetails:tripId } = useLocalSearchParams();

  console.log("trip_ID", tripId);

  const { data: tripInfo,isLoading } = useQuery({
    queryKey: ["TripInfoForDriver"],
    queryFn: () => getTripDetailsForDriver(tripId),
  });

  const mutation = useMutation({
    mutationFn: DriverRequestToCloseTrip,
    onSuccess: () => {
      console.log("successfully requested to close trip");
      Alert.alert("Success", "Close Trip Request Successful");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Request Failed, Try Again";
      console.error("Error submitting data:", error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(tripId);
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderActionButton = () => {
    switch (tripInfo?.status) {
      // case "initiated":
      //   return (
      //     <>
      //     <TouchableOpacity
      //       className="bg-[#394F91] rounded-2xl p-4 mt-6"
      //       onPress={() =>
      //         handlePress(`/screens/truckDriver/confirmLoading/${tripId}`)
      //       }
      //     >
      //       <Text className="text-white text-center font-semibold">
      //         Accept Trip
      //       </Text>
      //     </TouchableOpacity>
      //     </>
      //   )

        case "initiated":

          if (tripInfo.fuelling === 1 && tripInfo.fueled=== 0) {
            return (
              <>
              <TouchableOpacity
               className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() =>
                   handlePress(`/screens/truckDriver/confirmLoading/${tripId}`)
                 }
             >
               <Text className="text-white text-center font-semibold">
                  Accept Trip
               </Text>
             </TouchableOpacity>
              <TouchableOpacity
              className="bg-white border border-gray-300 rounded-2xl p-4 mt-6"
              onPress={() => handlePress(`/screens/truckDriver/getFuel/${tripId}`)}
            >
              <Text className="text-black text-center font-semibold">
                Get Fuel
              </Text>
            </TouchableOpacity> 
              </>
            );
          } else {
            return <TouchableOpacity
               className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() =>
                   handlePress(`/screens/truckDriver/confirmLoading/${tripId}`)
                 }
             >
               <Text className="text-white text-center font-semibold">
                  Accept Trip
               </Text>
             </TouchableOpacity>;}

      case "in_progress":
        if (tripInfo.driver_loading_confirmed === 1 && tripInfo.driver_offloading_confirmed=== 1) {
          return (
            <TouchableOpacity
              className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={handleSubmit} // Call the function to request to close trip
            >
              <Text className="text-white text-center font-semibold">
                Request To Close Trip
              </Text>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() =>
                handlePress(
                  `/screens/truckDriver/confirmOffloading/${tripId}?destination=${tripInfo?.destination_name}`
                )
              }
            >
              <Text className="text-white text-center font-semibold">
                Input Offloading Point Details
              </Text>
            </TouchableOpacity>
          )};

          
       default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs defaultValue="tripInfo">
        <TabsList>
          <TabsTrigger value="tripInfo" title="Trip Info" />
          <TabsTrigger value="loadingPoint" title="Loading Point" />
          <TabsTrigger value="offloadingPoint" title="Offloading Point" />
        </TabsList>

        

        <TabsContent value="tripInfo" className="flex-1 bg-[#F9F9F9] ">
          <ScrollView className="flex-1 px-4 pt-6">
            <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <OriginIcon />
                <Text className="text-gray-600 ml-1">
                 {tripInfo?.origin_name}
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
                {tripInfo?.destination_name}
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
                { label: "Trip ID", value: tripInfo?.trip_id },
                { label: "Loading Point", value: tripInfo?.origin_name },
                {
                  label: "Offloading Point",
                  value: tripInfo?.destination_name,
                },
                {
                  label: "Status",
                  value: tripInfo?.status,
                  color: "text-yellow-600",
                },
                { label: "Start Date", value: dayjs(tripInfo?.created_date).format("LL") },
                {
                  label: "End Date",
                  value: dayjs(tripInfo?.end_date).format("LL"),
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
        </TabsContent>

        <TabsContent value="loadingPoint" className="flex-1 bg-[#F9F9F9]">
          {/* if its initiated dont show  */}
          {tripInfo?.status === "initiated" ? (
            <View className="flex items-center justify-center mt-10">
              <EmptyScreen />
              <Text className="text-lg text-gray-500">Nothinge here yet.</Text>
            </View>
          ) : (
            <ScrollView className="flex-1 px-4 pt-6">
              <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
                <View className="flex-row items-center mb-2">
                  <OriginIcon />
                  <Text className="text-gray-600 ml-1">
                  {tripInfo?.origin_name}
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
                  {tripInfo?.destination_name}
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
                    Loading Point Details
                  </Text>
                </View>
                {[
                  { label: "Tonnage Loaded", value: tripInfo?.loading_qty },
                  { label: "Destination", value: tripInfo?.destination_name },
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
          )}
        </TabsContent>

        <TabsContent value="offloadingPoint" className="flex-1 bg-[#F9F9F9]">
          {/* if it is initiated and inprogress dont show  */}
          {tripInfo?.status === "initiated" ||
          tripInfo?.status === "in_progress" ? (
            <View className="flex items-center justify-center mt-10">
              <EmptyScreen />
              <Text className="text-lg text-gray-500">Nothinge here yet.</Text>
            </View>
          ) : (
            <ScrollView className="flex-1 px-4 pt-6">
              <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
                <View className="flex-row items-center mb-2">
                  <OriginIcon />
                  <Text className="text-gray-600 ml-1">
                    Gwarinpa, Abuja, Nigeria
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
                    Airport Road, Abuja, Nigeria
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
                  { label: "Tonnage Offloaded", value: "20" },
                  { label: "Tonnage Material", value: "Sand" },
                  { label: "Waybill Number", value: "2346790" },
                  { label: "Odometer Reading", value: "100" },
                  { label: "Destination", value: "Gwarinpa, Abuja" },
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
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </ScrollView>
          )}
        </TabsContent>
      </Tabs>
    </SafeAreaView>
  );
};

export default TripDetailsScreen;

const data = [
  {
    id: "1",
    image: Img1,
  },
  {
    id: "2",
    image: Img2,
  },
  {
    id: "3",
    image: Img3,
  },
];

const renderItem = ({ item }) => (
  <View className="p-2 w-[50%]">
    <Pressable
    //  onPress={() => handlePress(`/vendors/${item.title}`)}
    >
      <Image source={item.image} className="w-full  rounded-lg bg-slate-200" />
    </Pressable>
  </View>
);


// {tripInfo?.status === "initiated" ? (
//   <View className="bg-white rounded-lg p-4">
//     <View className="flex-row justify-between items-center border-b-[1px] border-[#F0F1F1]">
//       <Text className="text-lg font-bold mb-2">
//         Fuel Information
//       </Text>
//       <Text className="text-sm text-[#394F91]  mb-2">
//         View Fuel Info
//       </Text>
//     </View>
//     {[
//       { label: "Filling Station", value: "Mobil Filling Station" },
//       {
//         label: "Status",
//         value: tripInfo?.status,
//         color: "text-yellow-600",
//       },
//       { label: "Date", value: "Sep 1, 2024" },
//     ].map((item, index) => (
//       <View
//         key={index}
//         className="flex-row justify-between mb-1 border-b-[1px] border-[#F0F1F1] py-3"
//       >
//         <Text className="text-[#A5A6AB]  ">{item.label}</Text>
//         <Text className={item.color || "font-semibold"}>
//           {item.value}
//         </Text>
//       </View>
//     ))}
//   </View>
// ) : null}

// {tripInfo?.fuelling === 1 && tripInfo?.fuelled && (
//   <TouchableOpacity
//     className="bg-white border border-gray-300 rounded-2xl p-4 mt-6"
//     onPress={() =>
//       handlePress(`/screens/truckDriver/getFuel/${tripId}`)
//     }
//   >
//     <Text className="text-black text-center font-semibold">
//       Get Fuel
//     </Text>
//   </TouchableOpacity>
// )}

// {tripInfo?.status === "initiated" ? (
//   <>
//     <TouchableOpacity
//       className="bg-[#394F91] rounded-2xl p-4 mt-6"
//       onPress={() =>
//         handlePress(`/screens/truckDriver/confirmLoading/${tripId}`)
//       }
//     >
//       <Text className="text-white text-center font-semibold">
//         Accept Trip
//       </Text>
//     </TouchableOpacity>
//   </>
// ) : (
//   <TouchableOpacity
//     className="bg-[#394F91] rounded-2xl p-4 mt-6"
//     onPress={() =>
//       handlePress(
//         `/screens/truckDriver/confirmOffloading/${tripId}`
//       )
//     }
//   >
//     <Text className="text-white text-center font-semibold">
//       Input Offloading Point Details
//     </Text>
//   </TouchableOpacity>
// )}

// {tripInfo?.driver_offloading_confirmed === 1 ? (
//   <TouchableOpacity
//     className="bg-white border border-gray-300 rounded-2xl p-4 mt-6"
//     onPress={() => {
//       handleSubmit();
//       // handlePress(`/screens/truckDriver/getFuel/${tripId}`)
//     }}
//   >
//     <Text className="text-black text-center font-semibold">
//       Request to Close Trip
//     </Text>
//   </TouchableOpacity>
// ) : null}