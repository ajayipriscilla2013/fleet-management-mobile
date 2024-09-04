import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Image, SafeAreaView, Text, View, FlatList } from "react-native";
import ArrowRight from "@/assets/images/ArrowRight.png";
import Truck1 from "@/assets/images/truck1.png";
import Truck2 from "@/assets/images/truck2.png";
import Truck3 from "@/assets/images/truck3.png";
import { Stack } from "expo-router";
import axios from "axios";
import API from "@/src/services/api";

const Trucks = () => {
  // Move useState out of useEffect
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await API.post("trip/trip.php", {
          dataname: "getTrucks",
        });
        setTrucks(response.data.data);
      } catch (error) {
        console.error("Error fetching trucks:", error);
      }
    };

    fetchTrucks();
  }, []);

  const renderTrucks = ({ item }: any) => (
    <View className="border-[#E2E8F0] border py-6 px-4 flex-row items-center mb-4">
      <Avatar className="mr-5">
        {/* <AvatarImage source={item.image} /> */}
        <AvatarFallback>{item.status}</AvatarFallback>
      </Avatar>
      <View className="flex justify-between flex-1 flex-row">
        <View>
          <Text>{item.plate_number}</Text>
          <Text className="text-[#64748B] text-xs">{item.model}</Text>
        </View>
        <View className="flex flex-col items-end">
          <View className="flex flex-row items-center justify-between">
            <Image source={ArrowRight} />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 items-center  w-[100%] mx-auto">
      <View className="w-full  flex-1 1 bg-white p-4 rounded-xl">
        <FlatList
          data={trucks}
          renderItem={renderTrucks}
          keyExtractor={(item) => item.id.toString()} // Ensure keyExtractor returns a string
        />
      </View>
    </SafeAreaView>
  );
};

export default Trucks;
