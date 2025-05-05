import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Image, SafeAreaView, Text, View, FlatList, Pressable } from "react-native";
import RepeatIcon from "@/assets/svgs/repeat.svg";
import ArrowRight from "@/assets/svgs/arrow-right2.svg";
import Location from "@/assets/svgs/location.svg";
import Star from "@/assets/svgs/star.svg";
import { Stack, useRouter } from "expo-router";
import API from "@/src/services/api";
import { useQuery } from "@tanstack/react-query";
import {  getProductType } from "@/src/services/other";

const Products = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };

  const {data:products}= useQuery({
    queryKey:['products'],
    queryFn:getProductType
  })
  
  const fallbackProductImage = "https://cdn.pixabay.com/photo/2022/04/24/16/01/beach-7153932_1280.jpg";

  
  // const renderProduct = ({ item }: any) => (
  //   <Pressable 
  //   // onPress={
  //   //     () => handlePress(`/products/${item.id}`)}
  //       >
  //   <View className="bg-white rounded-lg border border-[#F0F1F1]  py-6 px-4 flex-row items-center mb-4">
  //     <Avatar className="mr-5 h-[51px] w-[51px]">
  //       <AvatarImage
  //         source={{
  //           uri: item.image || fallbackProductImage ,
  //         }}
  //       />
  //       <AvatarFallback>CG</AvatarFallback>
  //     </Avatar>
  //     <View className="flex justify-between flex-1 flex-row">
  //       <View>
  //         <Text>{item.name}</Text>
  //         <View className="flex-row gap-2">
  //           <View className="flex-row items-center">
  //             <Location />
  //             <Text className="text-sm">{item.created_at}</Text>
  //           </View>
  //           <View className="flex-row items-center">
  //             <Star />
  //             <Text className="text-sm">{item.updated_at}</Text>
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //     {/* <ArrowRight/> */}
  //   </View>
  //   </Pressable>
  // );


    const renderProduct = ({ item }) => (
      <View className="p-2 w-[50%]">
        <Pressable 
        // onPress={() => handlePress(`/customer/trucks/${item.id}`)}
        >
          <Image
            source={{uri:item.image || fallbackProductImage}}
            className="w-full h-48 rounded-lg bg-slate-200"
          />
          <Text className="mt-2 text-lg font-bold">{item.name}</Text>
  
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              {/* <RepeatIcon /> */}
              <Text className="text-[#1D1E20] text-xs">{item.plate_number}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              {/* <RepeatIcon /> */}
              <Text className="text-[#1D1E20] text-xs">{item.status}</Text>
            </View>
          </View>
          {/* <Text className="text-[#1D1E20]">{item.distance} • {item.time}</Text> */}
        </Pressable>
      </View>
    );
  return (
    <SafeAreaView className="flex-1 items-center bg-[#F9F9F9]  w-[100%] mx-auto">
      <View className="w-full  flex-1 bg-white p-4 rounded-xl">
        {/* <FlatList
        className="bg-white"
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
        /> */}
        <FlatList
              className="mx-2"
              data={products}
              renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
      </View>
    </SafeAreaView>
  );
};

export default Products;
