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
import { useQuery } from "@tanstack/react-query";
import { getVendors } from "@/src/services/other";

const data = [
  {
    id: "1",
    title: "NNPC Filling Station",
    location: "Airport Road, Abuja",
    rating: 4.8,
    difficulty: "Moderate",
    distance: "6.60 mi",
    time: "Est. 3h 41m",
    image:
      "https://global.ariseplay.com/amg/www.arise.tv/uploads/2023/07/NNPC-1.png",
  },
  {
    id: "2",
    title: "Mobil Filling Station",
    location: "Maitama,Abuja",
    rating: 4.8,
    difficulty: "Moderate",
    distance: "6.60 mi",
    time: "Est. 3h 41m",
    image:
      "https://media.licdn.com/dms/image/v2/D4E1BAQER3MSRWRZ6NQ/company-background_10000/company-background_10000/0/1654858641040/shafa_energy_ltd_cover?e=2147483647&v=beta&t=V0jFdjfBIVN7TmQJOTH9e_5TFj64yHWauhIN16_aZp8",
  },
  {
    id: "2",
    title: "Mobil Filling Station",
    location: "Maitama,Abuja",
    rating: 4.8,
    difficulty: "Moderate",
    distance: "6.60 mi",
    time: "Est. 3h 41m",
    image:
      "https://media.licdn.com/dms/image/v2/D4E1BAQER3MSRWRZ6NQ/company-background_10000/company-background_10000/0/1654858641040/shafa_energy_ltd_cover?e=2147483647&v=beta&t=V0jFdjfBIVN7TmQJOTH9e_5TFj64yHWauhIN16_aZp8",
  },
  {
    id: "2",
    title: "Mobil Filling Station",
    location: "Maitama,Abuja",
    rating: 4.8,
    difficulty: "Moderate",
    distance: "6.60 mi",
    time: "Est. 3h 41m",
    image:
      "https://media.licdn.com/dms/image/v2/D4E1BAQER3MSRWRZ6NQ/company-background_10000/company-background_10000/0/1654858641040/shafa_energy_ltd_cover?e=2147483647&v=beta&t=V0jFdjfBIVN7TmQJOTH9e_5TFj64yHWauhIN16_aZp8",
  },
  {
    id: "2",
    title: "Mobil Filling Station",
    location: "Maitama,Abuja",
    rating: 4.8,
    difficulty: "Moderate",
    distance: "6.60 mi",
    time: "Est. 3h 41m",
    image:
      "https://media.licdn.com/dms/image/v2/D4E1BAQER3MSRWRZ6NQ/company-background_10000/company-background_10000/0/1654858641040/shafa_energy_ltd_cover?e=2147483647&v=beta&t=V0jFdjfBIVN7TmQJOTH9e_5TFj64yHWauhIN16_aZp8",
  },
];

const fallbackVendorImage = "https://images.pexels.com/photos/18335589/pexels-photo-18335589/free-photo-of-view-of-a-petrol-station-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=800";


const Vendors = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };

  const {
    data: vendorsData,
    isLoading: isLoadingVendors,
    isError: isErrorVendors,
  } = useQuery({queryKey:['vendors'],queryFn: getVendors});

  console.log(vendorsData);

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
      <View className="w-full h-48 rounded-lg bg-[#e0e0e0] animate-pulse" />
      <View className="mt-2 h-4 w-3/4 bg-[#e0e0e0] rounded-lg animate-pulse" />
      <View className="mt-2 h-3 w-2/3 bg-[#e0e0e0] rounded-lg animate-pulse" />
      <View className="mt-2 flex-row items-center gap-2">
        <View className="h-3 w-1/4 bg-[#e0e0e0] rounded-lg animate-pulse" />
        <View className="h-3 w-1/4 bg-[#e0e0e0] rounded-lg animate-pulse" />
      </View>
      <View className="mt-2 h-3 w-2/3 bg-[#e0e0e0] rounded-lg animate-pulse" />
    </View>
  );



  const renderVendorsContent=()=>{
    if (isLoadingVendors){
      renderSkeleton()
    }
    return (
      <FlatList
      data={vendorsData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ paddingHorizontal: 8,  }}
    />
    )
  }
  

  const renderItem = ({ item }) => (
    <View className="p-2 w-[50%]">
      <Pressable  onPress={() => handlePress(`/driver/vendors/${item.id}`)}>

      
      <Image
        source={{ uri: item.image || fallbackVendorImage}}
        className="w-full h-48 rounded-lg bg-slate-200"
      />
      <Text className="mt-2 text-lg font-bold">{item.name}</Text>
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1">
          <StarIcon />
          <Text className="text-[#1D1E20] ">{item.phone_no}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.vendor_type_name}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1">
        <LocationIcon />
        <Text className="text-[#1D1E20]">{item.address}</Text>
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
          placeholder="Find Vendor"
          className="ml-2 flex-1 text-[#CDCDD0]"
        />
        <FilterIcon />
      </View>

      
      {renderVendorsContent()}

         
      
    </SafeAreaView>
  );
};

export default Vendors;
