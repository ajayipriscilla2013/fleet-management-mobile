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

const Home = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  const vendorsData = [
    {
      id: 1,
      name: "Mobil Filling Station",
      location: "Airport Road, Abuja",
      rating: 4.8,
      distance: "6.60ml",
      time: "Est. 3h 41m",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Mobil Filling Station",
      location: "Airport Road, Abuja",
      rating: 4.8,
      distance: "6.60ml",
      time: "Est. 3h 41m",
      image: "https://via.placeholder.com/150",
    },
  ];

  const driversData = [
    {
      id: 1,
      name: "Uwurume Peter",
      trips: 20,
      rating: 4.8,
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Uwurume Peter",
      trips: 20,
      rating: 4.8,
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Uwurume Peter",
      trips: 20,
      rating: 4.8,
      image: "https://via.placeholder.com/50",
    },
    {
      id: 4,
      name: "Uwurume Peter",
      trips: 20,
      rating: 4.8,
      image: "https://via.placeholder.com/50",
    },
   
  ];

  const trucksData = [
    {
      id: 1,
      name: "Truck 1",
      model: "Mac18C230",
      license: "IWU9027083",
      image: Truck1,
    },
    {
      id: 2,
      name: "Truck 1",
      model: "Mac18C230",
      license: "IWU9027083",
      image: Truck1,
    },
    {
      id: 3,
      name: "Truck 1",
      model: "Mac18C230",
      license: "IWU9027083",
      image: Truck1,
    },
  ];


  const renderVendorItem = ({ item }) => (
    <View className="mr-4">
      <Image source={{ uri: item.image }} className="h-[210px] w-[298px] rounded-lg bg-slate-200" />
      <Text className="mt-2 text-lg font-bold mb-1">{item.name}</Text>
      <View className="flex flex-row items-center gap-1 mb-1">
        <LocationIcon />
        <Text className="text-[#1D1E20]">{item.location}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1">
          <StarIcon />
          <Text className="text-[#1D1E20] ">{item.rating}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <RepeatIcon />
          <Text className="text-[#1D1E20] ">Moderate</Text>
        </View>
        <View className="flex-row items-center gap-1 ">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.distance}</Text>
        </View>
        <View className="flex-row items-center gap-1 ">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.time}</Text>
        </View>
      </View>
    </View>
  );

  // Render Item for Drivers
  const renderDriverItem = ({ item }) => (
    <View className="items-center mr-4">
      <Image source={{ uri: item.image }} className="h-[51px] w-[51px] rounded-full bg-slate-400" />
      <Text className="mt-2 text-sm font-bold">{item.name}</Text>
      <View className="flex flex-row gap-2">
        <View className="flex flex-row items-center ">
          <LocationIcon />
          <Text className="text-[#1D1E20] text-xs">Trips: {item.trips}</Text>
        </View>
        <View className="flex flex-row items-center">
          <StarIcon />
          <Text className="text-[#1D1E20] text-xs"> {item.rating}</Text>
        </View>
      </View>
    </View>
  );

  // Render Item for Trucks
  const renderTruckItem = ({ item }) => (
    <View className="mr-4">
      <Image source={item.image} className="h-[210px] w-[298px] rounded-lg bg-slate-200" />
      <Text className="mt-2 text-lg text-[#1D1E20] font-bold">{item.name}</Text>
      <View className="flex flex-row gap-2">
        <View className="flex flex-row gap-1 items-center">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.model}</Text>
        </View>
        <View className="flex flex-row gap-1 items-center">
          <RepeatIcon />
          <Text className="text-[#1D1E20]">{item.license}</Text>
        </View>
      </View>
    </View>
  );

  // return (
  //   <SafeAreaView className="flex-1  items-center justify-center">
  //     <View className="flex  flex-col justify-between mx-2">
  //       {/* Card 1 */}
  //       <Pressable
  //         onPress={() => handlePress("/vendors")}
  //         style={{ width: "100%", marginBottom: 16 }}
  //       >
  //         <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
  //           <Card className="w-full">
  //             <CardHeader className="flex">
  //               <View className="flex flex-row w-full items-center   justify-between ">
  //                 <CardTitle className="text-[#232c48]">Vendors</CardTitle>
  //                 <FontAwesome name="plus-circle" size={20} color="#4161b4" />
  //               </View>
  //             </CardHeader>
  //             <CardContent>
  //               <Text className="text-base text-primary text-[#4c73c4]">
  //                 List of Vendors
  //               </Text>
  //             </CardContent>
  //           </Card>
  //         </View>
  //       </Pressable>

  //       {/* Card 2 */}
  //       <Pressable
  //         onPress={() => handlePress("/trucks/#trucks")}
  //         style={{ width: "100%", marginBottom: 16 }}
  //       >
  //         <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
  //           <Card className="w-full">
  //             <CardHeader className="flex">
  //               <View className="flex flex-row w-full items-center   justify-between ">
  //                 <CardTitle> Trucks</CardTitle>
  //                 <FontAwesome name="truck" size={24} color="#4161b4" />
  //               </View>
  //             </CardHeader>

  //             <CardContent>
  //               <Text className="text-base text-primary">List of trucks</Text>
  //             </CardContent>
  //           </Card>
  //         </View>
  //       </Pressable>

  //       {/* Card 3 */}
  //       <Pressable
  //         onPress={() => handlePress("/drivers")}
  //         style={{ width: "100%", marginBottom: 16 }}
  //       >
  //         <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
  //           <Card className="w-full">
  //             <CardHeader className="flex">
  //               <View className="flex flex-row w-full items-center   justify-between ">
  //                 <CardTitle>Drivers</CardTitle>
  //                 <MaterialIcons name="drive-eta" size={24} color="#4161b4" />
  //               </View>
  //             </CardHeader>

  //             <CardContent>
  //               <Text className="text-base text-primary">List of Drivers</Text>
  //             </CardContent>
  //           </Card>
  //         </View>
  //       </Pressable>

  //       {/* Card 4 */}
  //       <Pressable
  //         onPress={() => handlePress("/tripstats")}
  //         style={{ width: "100%", marginBottom: 16 }}
  //       >
  //         <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
  //           <Card className="w-full">
  //             <CardHeader className="flex">
  //               <View className="flex flex-row w-full items-center   justify-between ">
  //                 <CardTitle>Trips Completed</CardTitle>
  //                 <Entypo name="traffic-cone" size={24} color="#4161b4" />
  //               </View>
  //             </CardHeader>

  //             <CardContent>
  //               <Text className="text-base text-primary">Trips Statistics</Text>
  //             </CardContent>
  //           </Card>
  //         </View>
  //       </Pressable>

  //       {/* Card 5 */}
  //     </View>
  //   </SafeAreaView>
  // );

  return (
    // <SafeAreaView className="flex-1 bg-[#F9F9F9]">
          
          <View  className="flex-1 bg-[#F9F9F9] ">
          <View className="rounded-b-3xl flex-col ">
         <ImageBackground source={Bg} resizeMode="cover" className="h-[211px]">
      {/* Header */}
      <View className="mt-28 mx-6">
        <Text className="text-2xl text-white font-semibold">
          Welcome, <Text className="text-white font-bold text-2xl">Peter 😊</Text>
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
      <View className="mt-6 mb-8 mx-6">
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
      </View>

      {/* Drivers */}
      <View className="mt-6 mb-8 mx-6">
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-[#202020] ">Drivers</Text>
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
