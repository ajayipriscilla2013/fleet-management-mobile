import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Image, SafeAreaView, Text, View, FlatList, Pressable } from "react-native";

import ArrowRight from "@/assets/svgs/arrow-right2.svg";
import Location from "@/assets/svgs/location.svg";
import Star from "@/assets/svgs/star.svg";
import { Stack, useRouter } from "expo-router";
import API from "@/src/services/api";
import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "@/src/services/other";

const Drivers = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };

  const {data:drivers}= useQuery({
    queryKey:['drivers'],
    queryFn:getDrivers
  })
  const fallbackDriverImage = "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=800";

  
  const renderDrivers = ({ item }: any) => (
    <Pressable onPress={() => handlePress(`/drivers/${item.truck_driver_id}`)}>
    <View className="bg-white rounded-lg border border-[#F0F1F1]  py-6 px-4 flex-row items-center mb-4">
      <Avatar className="mr-5 h-[51px] w-[51px]">
        <AvatarImage
          source={{
            uri: item.image || fallbackDriverImage,
          }}
        />
        <AvatarFallback>CG</AvatarFallback>
      </Avatar>
      <View className="flex justify-between flex-1 flex-row">
        <View>
          <Text>{item.driver_name}</Text>
          <View className="flex-row gap-2">
            <View className="flex-row items-center">
              <Location />
              <Text className="text-sm">{item.truck_plate_number}</Text>
            </View>
            <View className="flex-row items-center">
              <Star />
              <Text className="text-sm">{item.status}</Text>
            </View>
          </View>
        </View>
      </View>
      <ArrowRight/>
    </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 items-center bg-[#F9F9F9]  w-[100%] mx-auto">
      <View className="w-full  flex-1 bg-white p-4 rounded-xl">
        <FlatList
        className="bg-white"
          data={drivers}
          renderItem={renderDrivers}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Drivers;
