import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from "react-native";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useRouter } from "expo-router";

import ArrowRight from "@/assets/svgs/arrow-right.svg";
import StarIcon from "@/assets/svgs/star.svg";
import LocationIcon from "@/assets/svgs/location.svg";
import RepeatIcon from "@/assets/svgs/repeat.svg";
import Truck1 from "@/assets/images/truck1.png";
import avatar1 from "@/assets/images/avatar1.png";
import Bg from "@/assets/images/image4.png"
import SearchIcon from "@/assets/svgs/search.svg";
import FilterIcon from "@/assets/svgs/filter.svg";
import { useQuery } from "@tanstack/react-query";
import { getDrivers, getTrucks, getVendors } from "@/src/services/other";
import { useAuth } from "@/src/context/AuthContext";

const Home = () => {
  const router = useRouter();
  const { loggedInUser,  } = useAuth();
  const handlePress = (path) => {
    router.push(path);
  };

  

  const {
    data: driversData,
    isLoading: isLoadingDrivers,
    isError: isErrorDrivers,
  } = useQuery({
    queryKey: ['drivers'], 
    queryFn: getDrivers});


 

  const {
    data: trucksData,
    isLoading: isLoadingTrucks,
    isError: isErrorTrucks,
  } = useQuery({queryKey:['trucks'],queryFn: getTrucks});

  
  
  const {
    data: vendorsData,
    isLoading: isLoadingVendors,
    isError: isErrorVendors,
  } = useQuery({queryKey:['vendors'],queryFn: getVendors});


  const fallbackDriverImage = "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=800";
  const fallbackTruckImage = "https://images.pexels.com/photos/188679/pexels-photo-188679.jpeg?auto=compress&cs=tinysrgb&w=800";
  const fallbackVendorImage = "https://images.pexels.com/photos/18335589/pexels-photo-18335589/free-photo-of-view-of-a-petrol-station-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=800";
  


  const renderVendorItem = ({ item }) => (
    <View className="mr-4">
      <Image
        source={{ uri: item.image|| fallbackVendorImage }}
        className="h-[210px] w-[298px] rounded-lg bg-slate-200"
      />
      <Text className="mt-2 text-lg font-bold mb-1">{item.name}</Text>
      <View className="flex flex-row items-center gap-1 mb-1">
        <LocationIcon />
        <Text className="text-[#1D1E20]">{item.address}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1">
          <StarIcon />
          <Text className="text-[#1D1E20] ">{item.email}</Text>
        </View>
        <View className="flex-row items-center gap-1 ">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.vendor_type_name}</Text>
        </View>
        
      </View>
    </View>
  );

  // Render Item for Drivers
  const renderDriverItem = ({ item }) => (
    <View className="items-center mr-4">
      <Image
        source={{ uri: item.image || fallbackDriverImage }}
        className="h-[51px] w-[51px] rounded-full bg-slate-400"
      />
      <Text className="mt-2 text-sm font-bold">{item.driver_name}</Text>
      <View className="flex flex-row gap-2">
        <View className="flex flex-row items-center ">
          <LocationIcon />
          <Text className="text-[#1D1E20] text-xs">{item.truck_driver_id}</Text>
        </View>
        <View className="flex flex-row items-center">
          <StarIcon />
          <Text className="text-[#1D1E20] text-xs"> {item.truck_plate_number}</Text>
        </View>
      </View>
    </View>
  );

  // Render Item for Trucks
  const renderTruckItem = ({ item }) => (
    <View className="mr-4">
      <Image
        source={{uri:item.image || fallbackTruckImage}}
        className="h-[210px] w-[298px] rounded-lg bg-slate-200"
      />
      <Text className="mt-2 text-lg text-[#1D1E20] font-bold">{item.plate_number}</Text>
      <View className="flex flex-row gap-2">
        <View className="flex flex-row gap-1 items-center">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.model}</Text>
        </View>
        <View className="flex flex-row gap-1 items-center">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.status}</Text>
        </View>
      </View>
    </View>
  );


  return (
    // <SafeAreaView className="flex-1 bg-[#F9F9F9]">
          
          <View  className="flex-1 bg-[#F9F9F9] ">
          <View className="rounded-b-3xl flex-col ">
         <ImageBackground source={Bg} resizeMode="cover" className="h-[211px]">
      {/* Header */}
      <View className="mt-28 mx-6">
        <Text className="text-2xl text-white font-semibold">
          Welcome, <Text className="text-white font-bold text-2xl capitalize">{loggedInUser?.first_name} 😊</Text>
        </Text>
      </View>

      {/* Search Bar */}
      <View className="mt-4 flex-row items-center mx-6 bg-white border border-gray-300 rounded-lg p-4">
        <SearchIcon />
        <TextInput
          placeholder="Find Vendor"
          className="ml-2 flex-1 text-[#CDCDD0]"
        />
        <FilterIcon />
      </View>

      </ImageBackground>
      </View>
      
      <ScrollView className="flex-1 bg-[#F9F9F9] ">
      {/* Vendors */}
      {/* <View className="mt-6 mb-8 mx-6">
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-[#202020] ">Vendors</Text>
          <TouchableOpacity onPress={() => handlePress("/vendors")}>
            <View
              className="flex flex-row items-center gap-1"
            >
              <Text className="text-[#394F91] text-xs ">View All</Text>
              <ArrowRight />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={vendorsData}
          renderItem={renderVendorItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        />
      </View> */}

      {/* Drivers */}
      <View className="mt-6 mb-8 mx-6">
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-[#202020] ">Drivers</Text>
          <TouchableOpacity onPress={() => handlePress("/fuel-attendant/drivers")}>
            <View
              className="flex flex-row items-center gap-1"
            >
              <Text className="text-[#394F91] text-xs ">View All</Text>
              <ArrowRight />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={driversData}
          renderItem={renderDriverItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        />
      </View>

      {/* Trucks */}
      <View className="mt-6 mx-6">
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-[#202020] ">Trucks</Text>
          <TouchableOpacity onPress={() => handlePress("/fuel-attendant/trucks")}>
            <View
              className="flex flex-row items-center gap-1"
            >
              <Text className="text-[#394F91] text-xs ">View All</Text>
              <ArrowRight />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={trucksData}
          renderItem={renderTruckItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        />
      </View>

      </ScrollView>
      </View>
    // </SafeAreaView>

  );
};

export default Home;
