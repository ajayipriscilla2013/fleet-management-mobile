import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Image, SafeAreaView, Text, View, FlatList } from "react-native";

import ArrowRight from "@/assets/images/ArrowRight.png";
import Truck1 from "@/assets/images/truck1.png";
import Truck2 from "@/assets/images/truck2.png";
import Truck3 from "@/assets/images/truck3.png";
import { Stack } from "expo-router";

const Drivers = () => {
  const drivers = [
    {
      id: "1",
      name: "Marcus Tahoma",
      location: "Lagos, Nigeria",
      tripsCompleted: 5,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "2",
      name: "Sophia Williams",
      location: "Abuja, Nigeria",
      tripsCompleted: 3,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "3",
      name: "John Doe",
      location: "Ibadan, Nigeria",
      tripsCompleted: 7,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "4",
      name: "Jane Smith",
      location: "Enugu, Nigeria",
      tripsCompleted: 2,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "5",
      name: "Michael Johnson",
      location: "Port Harcourt, Nigeria",
      tripsCompleted: 4,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "6",
      name: "Marcus Tahoma",
      location: "Benue, Nigeria",
      tripsCompleted: 4,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "7",
      name: "Tofunm Banke",
      location: "Ondo, Nigeria",
      tripsCompleted: 11,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
    {
      id: "8",
      name: "Ignatius Timothy",
      location: "Kaduna, Nigeria",
      tripsCompleted: 11,
      imageUrl:
        "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
    },
  ];

  const renderDrivers = ({ item }: any) => (
    <View className="border-[#E2E8F0] border py-6 px-4 flex-row items-center mb-4">
      <Avatar className="mr-5">
        <AvatarImage
          source={{
            uri: item.imageUrl,
          }}
        />
        <AvatarFallback>CG</AvatarFallback>
      </Avatar>
      <View className="flex justify-between flex-1 flex-row">
        <View>
          <Text>{item.name}</Text>
          <Text className="text-[#64748B] text-xs">{item.location}</Text>
        </View>
        <View className="flex flex-col items-end">
          <Text className="text-[#64748B]">
            {item.tripsCompleted} Trips Completed
          </Text>
          <View className="flex flex-row items-center justify-between">
            <Button
              className="bg-[#3A5092]"
              size="badge"
              label="⭐️⭐️⭐️⭐️⭐️"
            />
            <Image source={ArrowRight} />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 items-center  w-[100%] mx-auto">
      <View className="w-full  flex-1 bg-white p-4 rounded-xl">
        <FlatList
          data={drivers}
          renderItem={renderDrivers}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default Drivers;
