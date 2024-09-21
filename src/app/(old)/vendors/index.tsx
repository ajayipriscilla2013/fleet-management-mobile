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

// const Vendors = () => {

//   const [vendors,setVendors]= useState([])

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//          const response = await API.post("trip/trip.php", {
//           dataname: "getVendors",

//         });

//         setVendors(response.data.vendors);

//       } catch (error) {
//         console.error("API request error", error);
//       }
//     };

//     fetchVendors();
//   }, []);
//   const renderItem = ({ item }) => (
//     <View className="p-4 mb-4">
//       <Image source={{ uri: "https://global.ariseplay.com/amg/www.arise.tv/uploads/2023/07/NNPC-1.png" }} className="h-72 w-full rounded-xl" />

//       <View className="mt-2 px-2">
//         <Text className="font-bold text-base">{item.name}</Text>
//         <Text className="text-[#888] ">{item.address}</Text>
//         <View className="text-[#888] flex flex-row items-center ">
//           <Text className="text-[#888]  text-xs ">{item.rating} ★</Text>
//           <Text className="text-[#888]  text-xs mx-2">•</Text>
//           <Text className="text-[#888]  text-xs ">{item.vendor_type_name}</Text>
//           <Text className="text-[#888]  text-xs mx-2">•</Text>
//           <Text className="text-[#888]  text-xs ">{item.email}</Text>
//           <Text className="text-[#888]  text-xs mx-2">•</Text>
//           <Text className="text-[#888]  text-xs">{item.phone_no}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 mx-auto  w-[100%]  bg-white">
//       {/* Search Bar */}
//       <View className="flex flex-row items-center bg-[#f0f0f0]  rounded-r-full rounded-l-full p-2 m-6 mt-2">
//         <FontAwesome name="search" size={20} color="#888" />
//         <TextInput
//           placeholder="Find Vendor"
//           style={{ marginLeft: 8, fontSize: 16, flex: 1 }}
//         />
//         <FontAwesome name="sliders" size={20} color="#888" />
//       </View>

//       {/* Filter Buttons */}
//       <View className="flex flex-row mt-4 justify-between px-6">
//         <TouchableOpacity className="bg-[#3A5092] py-2 px-4  rounded-3xl">
//           <Text className="text-white  font-bold">Nearby</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-[#E8E8E8] py-2 px-4 rounded-3xl">
//           <Text className="text-black  font-bold">Fuel Station</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="bg-[#E8E8E8] py-2 px-4 rounded-3xl">
//           <Text className="text-black  font-bold">Sand</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Content List */}
//       <FlatList
//         data={vendors}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         style={{ marginTop: 16 }}
//       />
//     </SafeAreaView>
//   );
// };

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
  

  const renderItem = ({ item }) => (
    <View className="p-2 w-[50%]">
      <Pressable  onPress={() => handlePress(`/vendors/${item.id}`)}>

      
      <Image
        source={{ uri: item.image }}
        className="w-full h-48 rounded-lg bg-slate-200"
      />
      <Text className="mt-2 text-lg font-bold">{item.name}</Text>
      <View className="flex-row items-center gap-1">
        <LocationIcon />
        <Text className="text-[#1D1E20]">{item.address}</Text>
      </View>
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

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" title="All" />
          <TabsTrigger value="fuelStations" title="Fuel Stations" />
          <TabsTrigger value="others" title="Others" />
        </TabsList>

        <TabsContent value="all" className="flex-1 ">
          <FlatList
            data={vendorsData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingHorizontal: 8,  }}
          />
        </TabsContent>
      </Tabs>
    </SafeAreaView>
  );
};

export default Vendors;
