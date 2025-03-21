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
import { getCustomers, getDrivers } from "@/src/services/other";

const SkeletonLoader = () => {
  const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

  const renderSkeletonItem = () => (
    <View className="bg-white rounded-lg border border-[#F0F1F1] py-6 px-4 flex-row items-center mb-4">
      <View className="mr-5 h-[51px] w-[51px] rounded-full bg-[#e0e0e0] animate-pulse" />
      <View className="flex justify-between flex-1 flex-row">
        <View>
          <View className="bg-[#e0e0e0] w-[100px] h-[16px] rounded-sm mb-2 animate-pulse" />
          <View className="flex-row gap-2">
            <View className="flex-row items-center">
              <View className="bg-[#e0e0e0] w-[80px] h-[12px] rounded-sm animate-pulse" />
            </View>
            <View className="flex-row items-center">
              <View className="bg-[#e0e0e0] w-[80px] h-[12px] rounded-sm animate-pulse" />
            </View>
          </View>
        </View>
      </View>
      <View className="w-5 h-5 bg-[#e0e0e0] rounded-full animate-pulse" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 items-center bg-[#F9F9F9] w-[100%] mx-auto">
      <View className="w-full flex-1 bg-white p-4 rounded-xl">
        <FlatList
          data={skeletonItems}
          renderItem={renderSkeletonItem}
          keyExtractor={(item) => `skeleton-${item}`}
        />
      </View>
    </SafeAreaView>
  );
};

const Customers = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };

  const {data:customers, isLoading}= useQuery({
    queryKey:['customersss'],
    queryFn:getCustomers
  })
  const fallbackDriverImage = "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=800";

  
  const renderCustomer = ({ item }: any) => (
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
          <Text>{item.first_name}</Text>
          <View className="flex-row gap-2">
            <View className="flex-row items-center">
              <Location />
              <Text className="text-sm">{item.email}</Text>
            </View>
            <View className="flex-row items-center">
              <Star />
              <Text className="text-sm">{item.user_id}</Text>
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
      {isLoading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            className="bg-white"
            data={customers}
            renderItem={renderCustomer}
            keyExtractor={(item) => item.id}
          />
        )}
    
      </View>
    </SafeAreaView>
  );
};

export default Customers;
