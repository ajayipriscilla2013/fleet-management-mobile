import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Texaco from "@/assets/images/texaco.jpg";

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
    title: "AY Shafa Filling Station",
    location: "Maitama,Abuja",
    rating: 4.8,
    difficulty: "Moderate",
    distance: "6.60 mi",
    time: "Est. 3h 41m",
    image:
      "https://media.licdn.com/dms/image/v2/D4E1BAQER3MSRWRZ6NQ/company-background_10000/company-background_10000/0/1654858641040/shafa_energy_ltd_cover?e=2147483647&v=beta&t=V0jFdjfBIVN7TmQJOTH9e_5TFj64yHWauhIN16_aZp8",
  },
];

const Vendors = () => {
  const renderItem = ({ item }) => (
    <View className="p-4 mb-4">
      <Image source={{ uri: item.image }} className="h-72 w-full rounded-xl" />

      <View className="mt-2 px-2">
        <Text className="font-bold text-base">{item.title}</Text>
        <Text className="text-[#888] ">{item.location}</Text>
        <View className="text-[#888] flex flex-row items-center ">
          <Text className="text-[#888]  text-xs ">{item.rating} ★</Text>
          <Text className="text-[#888]  text-xs mx-2">•</Text>
          <Text className="text-[#888]  text-xs ">{item.difficulty}</Text>
          <Text className="text-[#888]  text-xs mx-2">•</Text>
          <Text className="text-[#888]  text-xs ">{item.distance}</Text>
          <Text className="text-[#888]  text-xs mx-2">•</Text>
          <Text className="text-[#888]  text-xs">{item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 mx-auto  w-[100%]  bg-white">
      {/* Search Bar */}
      <View className="flex flex-row items-center bg-[#f0f0f0]  rounded-r-full rounded-l-full p-2 m-6 mt-2">
        <FontAwesome name="search" size={20} color="#888" />
        <TextInput
          placeholder="Find Vendor"
          style={{ marginLeft: 8, fontSize: 16, flex: 1 }}
        />
        <FontAwesome name="sliders" size={20} color="#888" />
      </View>

      {/* Filter Buttons */}
      <View className="flex flex-row mt-4 justify-between px-6">
        <TouchableOpacity className="bg-[#3A5092] py-2 px-4  rounded-3xl">
          <Text className="text-white  font-bold">Nearby</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#E8E8E8] py-2 px-4 rounded-3xl">
          <Text className="text-black  font-bold">Fuel Station</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#E8E8E8] py-2 px-4 rounded-3xl">
          <Text className="text-black  font-bold">Sand</Text>
        </TouchableOpacity>
      </View>

      {/* Content List */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 16 }}
      />
    </SafeAreaView>
  );
};

export default Vendors;
