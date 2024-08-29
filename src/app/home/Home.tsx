import React from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  return (
    <SafeAreaView className="flex-1  items-center justify-center">
      <View className="flex  flex-col justify-between mx-2">
        {/* Card 1 */}
        <Pressable
          onPress={() => handlePress("/vendors")}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle className="text-[#232c48]">Vendors</CardTitle>
                  <FontAwesome name="plus-circle" size={20} color="#4161b4" />
                </View>
              </CardHeader>
              <CardContent>
                <Text className="text-base text-primary text-[#4c73c4]">
                  List of Vendors
                </Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 2 */}
        <Pressable
          onPress={() => handlePress("/trucks/#trucks")}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle> Trucks</CardTitle>
                  <FontAwesome name="truck" size={24} color="#4161b4" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">List of trucks</Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 3 */}
        <Pressable
          onPress={() => handlePress("/drivers")}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Drivers</CardTitle>
                  <MaterialIcons name="drive-eta" size={24} color="#4161b4" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">List of Drivers</Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 4 */}
        <Pressable
          onPress={() => handlePress("/tripstats")}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <View className="bg-[#E2EBF7] border border-[#7ea9dc] rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Trips Completed</CardTitle>
                  <Entypo name="traffic-cone" size={24} color="#4161b4" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">Trips Statistics</Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 5 */}
      </View>
    </SafeAreaView>
  );
};

export default Home;
