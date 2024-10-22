import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Image,
  FlatList,
  Alert,
} from "react-native";
import LocationIcon from "@/assets/svgs/location3.svg";
import OriginIcon from "@/assets/svgs/record-circle.svg";
import TruckIcon from "@/assets/svgs/truck2.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Badge } from "@/components/Badge";

import Img1 from "@/assets/images/img1.png";
import Img2 from "@/assets/images/img2.png";
import Img3 from "@/assets/images/img3.png";
import { useMutation, useQuery } from "@tanstack/react-query";
import { closeTrip, getSingleTrip } from "@/src/services/other";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const TripDetailsScreen = () => {
  const router = useRouter();
  const { status, tripId } = useLocalSearchParams();
  console.log(status);
  // console.log(tripId);

  const handlePress = (path) => {
    router.push(path);
  };

  const { data: tripInfo } = useQuery({
    queryKey: ["AdminTripInfo"],
    queryFn: () => getSingleTrip(tripId),
  });

  const mutation = useMutation({
    mutationFn: closeTrip,
    onSuccess: () => {
      console.log("Trip Closed");
      Alert.alert("Success", "Trip Close Request Successful");
      router.push("/(admin)/Trip?tab=delivered");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Request Failed, Try Again";
      console.error("Error submitting data:", error);
      Alert.alert("Error", `${errorMessage}`);
     
    },
  });

  const handleSubmit = (trip_id) => {
    mutation.mutate(trip_id);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs defaultValue="tripInfo">
        <TabsList>
          <TabsTrigger value="tripInfo" title="Trip Info" />
          <TabsTrigger value="customer" title="Customer" />
          <TabsTrigger value="truckDriver" title="Truck Driver" />
        </TabsList>

        <TabsContent value="tripInfo" className="px-6">
          <View className="bg-[#EEF0FB]  rounded-lg p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <OriginIcon />
              <Text className="text-gray-600 ml-1">
                {tripInfo?.origin_name}
              </Text>
            </View>

            <View className="flex-row gap-1  ml-5">
              <TruckIcon />
              <Text className="text-xs text-gray-400  mb-2">Truck Takeoff</Text>
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
              { label: "Offloading Point", value: tripInfo?.destination_name },
              {
                label: "Status",
                value: `${tripInfo?.status}`,
                color: "text-yellow-600",
              },
              // {dayjs(formData.start_date).format("LL")}
              {
                label: "Start Date",
                value: dayjs(tripInfo?.start_date).format("LL") || "null value",
              },
              {
                label: "End Date",
                value: dayjs(tripInfo?.end_date).format("LL") || "null value",
              },
             
              
            ].map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
              >
                <Text className="text-[#A5A6AB]">{item.label}</Text>
                {item.label === "Status" ? (
                  <Badge label={item.value} variant={`${status}`} />
                ) : (
                  <Text className={"font-semibold"}>{item.value}</Text>
                )}
              </View>
            ))}
          </View>

          {tripInfo?.status ===  "to_be_closed" ? (
            <TouchableOpacity
              className="bg-[#394F91] rounded-2xl p-4 mt-6"
              onPress={() => {
                handleSubmit(tripId);
                // handlePress(`/screens/truckDriver/confirmLoading/${tripId}`)
              }}
            >
              <Text className="text-white text-center font-semibold">
                Close Trip
              </Text>
            </TouchableOpacity>
          ) : null}
        </TabsContent>

        <ScrollView className="flex-1">
          <TabsContent value="customer" className="px-6">
            <View className=" bg-[#F9F9F9] ">
              <View className="bg-white rounded-lg p-4 mb-6 ">
                <View className=" border-b-[1px] border-[#F0F1F1]">
                  <Text className="text-lg font-bold mb-2">Loading Point</Text>
                </View>
                {[
                  { label: "Customer Name", value: tripInfo?.customer_name },
                  { label: "Material", value: tripInfo?.producttype_name },
                  { label: "Tonnage Loaded", value: tripInfo?.loading_qty },

                  {
                    label: "Status",
                    value: tripInfo?.status,
                    color: "text-[#18BB0C]",
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                  >
                    <Text className="text-[#A5A6AB]">{item.label}</Text>
                    {item.label === "Status" ? (
                      <Badge label={item.value} variant={`${status}`} />
                    ) : (
                      <Text className={"font-semibold"}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </View>

              <View className="bg-white rounded-lg p-4 mb-6 ">
                <View className=" border-b-[1px] border-[#F0F1F1]">
                  <Text className="text-lg font-bold mb-2">
                    Offloading Point
                  </Text>
                </View>
                {[
                  { label: "Tonnage Loaded",value: tripInfo?.producttype_name },
                  { label: "Material", value:tripInfo?.producttype_name },
                  { label: "Waybil", value: tripInfo?.loading_qty},
                  {
                    label: "Status",
                    value: status,
                    color: "text-[#394F91]",
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                  >
                    <Text className="text-[#A5A6AB]">{item.label}</Text>
                    {item.label === "Status" ? (
                      <Badge label={item.value} variant={`${status}`} />
                    ) : (
                      <Text className={"font-semibold"}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </View>

              <View className="bg-[#EEF0FB] px-5 py-3">
                <Text className="text-[#394F91] font-semibold">Images</Text>
              </View>

              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          </TabsContent>
        </ScrollView>

        <TabsContent value="truckDriver" className="px-6 ">
          <View className="bg-white rounded-lg p-4 mb-6 ">
            <View className=" border-b-[1px] border-[#F0F1F1]">
              <Text className="text-lg font-bold mb-2">
                Truck Driver Information
              </Text>
            </View>
            {[
              { label: "Driver Name", value: `${tripInfo?.first_name } ${tripInfo?.last_name }` },
              { label: "Driver Email", value: tripInfo?.driver_email },
              { label: "Driver phone Number", value: tripInfo?.driver_phone },
              {
                label: "Truck Plate Number",
                value: tripInfo?.plate_number,
              },
              { label: "Truck Model", value: tripInfo?.truck_model },
              { label: "Customer Name", value: tripInfo?.customer_name },
            ].map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
              >
                <Text className="text-[#A5A6AB]">{item.label}</Text>
                {item.label === "Status" ? (
                  <Badge label={item.value} variant={`${status}`} />
                ) : (
                  <Text className={"font-semibold"}>{item.value}</Text>
                )}
              </View>
            ))}
          </View>


          <View className="bg-white rounded-lg p-4 mb-6 ">
                <View className=" border-b-[1px] border-[#F0F1F1]">
                  <Text className="text-lg font-bold mb-2">Vendor</Text>
                </View>
                {[
                  { label: "Vendor Name", value: tripInfo?.vendor_name },
                  { label: "Vendor Address", value: tripInfo?.vendor_address },
      
                  { label: "Vendor Email", value: tripInfo?.vendor_email},
                  { label: "Agent Name", value: tripInfo?.agent_name },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                  >
                    <Text className="text-[#A5A6AB]">{item.label}</Text>
                    {item.label === "Status" ? (
                      <Badge label={item.value} variant={`${status}`} />
                    ) : (
                      <Text className={"font-semibold"}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            {/* {
              tripInfo?.fueling === 1 ?( <View className="bg-white rounded-lg p-4 mb-6 ">
                <View className=" border-b-[1px] border-[#F0F1F1]">
                  <Text className="text-lg font-bold mb-2">Vendor</Text>
                </View>
                {[
                  { label: "Vendor Name", value: tripInfo?.vendor_name },
                  { label: "Vendor Address", value: tripInfo?.vendor_address },
                  { label: "Vendor Phone Number", value: tripInfo?.vendor_phone },
                  { label: "Vendor Email", value: tripInfo?.vendor_phone },
                  { label: "Agent Name", value: tripInfo?.vendor_phone },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3"
                  >
                    <Text className="text-[#A5A6AB]">{item.label}</Text>
                    {item.label === "Status" ? (
                      <Badge label={item.value} variant={`${status}`} />
                    ) : (
                      <Text className={"font-semibold"}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </View>) : null
            } */}
         
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
