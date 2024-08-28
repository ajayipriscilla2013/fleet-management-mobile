import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { Image, SafeAreaView, Text, View, FlatList } from "react-native";

import ArrowRight from "@/assets/images/ArrowRight.png";
import Truck1 from "@/assets/images/truck1.png";
import Truck2 from "@/assets/images/truck2.png";
import Truck3 from "@/assets/images/truck3.png";

const Trip = () => {
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

  const trucks = [
    {
      id: "1",
      plateNumber: "UKW-328-XGH",
      brand: "MAN, TGX",
      image: Truck1,
    },
    {
      id: "2",
      plateNumber: "LND-452-PTR",
      brand: "Volvo, FH16",
      image: Truck2,
    },
    {
      id: "3",
      plateNumber: "ABC-123-DEF",
      brand: "Scania, R-Series",
      image: Truck3,
    },
    {
      id: "4",
      plateNumber: "XYZ-789-GHI",
      brand: "Mercedes-Benz, Actros",
      image: Truck3,
    },
    {
      id: "5",
      plateNumber: "QWE-456-JKL",
      brand: "DAF, XF",
      image: Truck1,
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

  const renderTrucks = ({ item }: any) => (
    <View className="border-[#E2E8F0] border py-6 px-4 flex-row items-center mb-4">
      <Avatar className="mr-5">
        <AvatarImage source={item.image} />
        <AvatarFallback>CG</AvatarFallback>
      </Avatar>
      <View className="flex justify-between flex-1 flex-row">
        <View>
          <Text>{item.plateNumber}</Text>
          <Text className="text-[#64748B] text-xs">{item.brand}</Text>
        </View>
        <View className="flex flex-col items-end">
          <View className="flex flex-row items-center justify-between">
            <Image source={ArrowRight} />
          </View>
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView className="flex-1 items-center  w-[90%] mx-auto">
      <View>
        <Tabs defaultValue="drivers">
          <TabsList>
            <TabsTrigger value="drivers" id="drivers" title="Drivers" />
            <TabsTrigger value="trucks" id="trucks" title="Trucks" />
          </TabsList>

          <TabsContent className="p-0 border-none" value="drivers">
            <FlatList
              data={drivers}
              renderItem={renderDrivers}
              keyExtractor={(item) => item.id}
            />
          </TabsContent>

          <TabsContent value="trucks">
            <FlatList
              data={trucks}
              renderItem={renderTrucks}
              keyExtractor={(item) => item.id}
            />
          </TabsContent>
        </Tabs>
      </View>
    </SafeAreaView>
  );
};

export default Trip;

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
// import { Badge } from "@/components/Badge";
// import { Button } from "@/components/Button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
// import { Image, SafeAreaView, Text, View } from "react-native";

// import ArrowRight from "@/assets/images/ArrowRight.png";

// const Trip = () => {
//   return (
//     <SafeAreaView className="flex-1 items-center w-[90%] mx-auto">
//       <View>
//         <Tabs defaultValue="drivers">
//           <TabsList>
//             <TabsTrigger value="drivers" id="drivers" title="Drivers" />
//             <TabsTrigger value="trucks" id="trucks" title="Trucks" />
//           </TabsList>
//           <TabsContent className="p-0 border-none" value="drivers">
//             {[
//               ...Array(5).map((_, index) => (
//                 <View
//                   key={index}
//                   className=" border-[#E2E8F0] border py-6 px-4 flex-row items-center mb-4 "
//                 >
//                   <Avatar className="mr-5">
//                     <AvatarImage
//                       source={{
//                         uri: "https://pbs.twimg.com/profile_images/1745949238519803904/ZHwM5B07_400x400.jpg",
//                       }}
//                     />
//                     <AvatarFallback>CG</AvatarFallback>
//                   </Avatar>
//                   <View className="flex justify-end  gap-16  flex-row">
//                     <View className="">
//                       <Text className="">Marcus Tahoma</Text>
//                       <Text className="text-[#64748B] text-xs">
//                         Lagos, Nigeria
//                       </Text>
//                     </View>
//                     <View className="flex flex-col">
//                       <Text className="text-[#64748B]">5 Trips Completed</Text>
//                       <View className="flex flex-row items-center justify-between">
//                         <Button
//                           className="bg-[#3A5092]"
//                           size="badge"
//                           label="⭐️⭐️⭐️⭐️⭐️"
//                         />
//                         <Image source={ArrowRight} />
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               )),
//             ]}
//           </TabsContent>
//           <TabsContent value="trucks">
//             <Text className="text-primary">Change your password here.</Text>
//           </TabsContent>
//         </Tabs>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Trip;
