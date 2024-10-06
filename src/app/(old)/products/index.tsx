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
import {  getProductType } from "@/src/services/other";

const Drivers = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };

  const {data:products}= useQuery({
    queryKey:['products'],
    queryFn:getProductType
  })
  
  const fallbackProductImage = "https://cdn.pixabay.com/photo/2022/04/24/16/01/beach-7153932_1280.jpg";

  
  const renderProduct = ({ item }: any) => (
    <Pressable 
    // onPress={
    //     () => handlePress(`/products/${item.id}`)}
        >
    <View className="bg-white rounded-lg border border-[#F0F1F1]  py-6 px-4 flex-row items-center mb-4">
      <Avatar className="mr-5 h-[51px] w-[51px]">
        <AvatarImage
          source={{
            uri: item.image || fallbackProductImage ,
          }}
        />
        <AvatarFallback>CG</AvatarFallback>
      </Avatar>
      <View className="flex justify-between flex-1 flex-row">
        <View>
          <Text>{item.name}</Text>
          <View className="flex-row gap-2">
            <View className="flex-row items-center">
              <Location />
              <Text className="text-sm">{item.created_at}</Text>
            </View>
            <View className="flex-row items-center">
              <Star />
              <Text className="text-sm">{item.updated_at}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* <ArrowRight/> */}
    </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 items-center bg-[#F9F9F9]  w-[100%] mx-auto">
      <View className="w-full  flex-1 bg-white p-4 rounded-xl">
        <FlatList
        className="bg-white"
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Drivers;
