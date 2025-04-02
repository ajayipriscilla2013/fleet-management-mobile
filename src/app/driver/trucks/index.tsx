import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Texaco from "@/assets/images/texaco.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import StarIcon from "@/assets/svgs/star.svg";
import LocationIcon from "@/assets/svgs/location.svg";
import RepeatIcon from "@/assets/svgs/repeat.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useRouter } from "expo-router";
import TruckImg from "@/assets/images/truck.png";
import { useQuery } from "@tanstack/react-query";
import { getTrucks } from "@/src/services/other";





const Trucks = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };

  const{data,isLoading}=useQuery({
    queryKey:["trucks"],
    queryFn:getTrucks
  })
  const fallbackTruckImage = "https://images.pexels.com/photos/188679/pexels-photo-188679.jpeg?auto=compress&cs=tinysrgb&w=800";

  const renderSkeleton = () => (
    <FlatList
      data={Array(6).fill({})} // Array of 6 empty objects to simulate 6 skeleton items
      renderItem={renderSkeletonItem}
      keyExtractor={(_, index) => `skeleton-${index}`}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingHorizontal: 8 }}
    />
  );

  const renderSkeletonItem = () => (
    <View className="p-2 w-[50%]">
      <View className="w-full h-48 rounded-lg bg-[##e0e0e0] animate-pulse" />
      <View className="mt-2 h-4 w-3/4 bg-[##e0e0e0] rounded-lg animate-pulse" />
      <View className="mt-2 h-3 w-2/3 bg-[##e0e0e0] rounded-lg animate-pulse" />
      <View className="mt-2 flex-row items-center gap-2">
        <View className="h-3 w-1/4 bg-[##e0e0e0] rounded-lg animate-pulse" />
        <View className="h-3 w-1/4 bg-[##e0e0e0] rounded-lg animate-pulse" />
      </View>
      <View className="mt-2 h-3 w-2/3 bg-[##e0e0e0] rounded-lg animate-pulse" />
    </View>
  );

  const renderTrucksContent=()=>{
    if (isLoading){
      renderSkeleton()
    }
    return (
      <FlatList
      className="mx-2"
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    )
  }


  const renderItem = ({ item }) => (
    <View className="p-2 w-[50%]">
      <Pressable onPress={() => handlePress(`/driver/trucks/${item.id}`)}>
        <Image
          source={{uri:item.image || fallbackTruckImage}}
          className="w-full h-48 rounded-lg bg-slate-200"
        />
        <Text className="mt-2 text-lg font-bold">{item.model}</Text>

        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <RepeatIcon />
            <Text className="text-[#1D1E20] text-xs">{item.plate_number}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <RepeatIcon />
            <Text className="text-[#1D1E20] text-xs">{item.status}</Text>
          </View>
        </View>
        {/* <Text className="text-[#1D1E20]">{item.distance} • {item.time}</Text> */}
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 ">
      {/* Search Bar */}
      <View className="mt-4 mb-[10px] mx-6  flex-row items-center border-gray-100 border bg-white rounded-lg p-4">
        <SearchIcon />
        <TextInput
          placeholder="Find Truck"
          className="ml-2 flex-1 text-[#CDCDD0]"
        />
        <FilterIcon />
      </View>


          {renderTrucksContent()}
       
    </SafeAreaView>
  );
};

export default Trucks;
