import React from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useRouter } from "expo-router";

const Trip = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex flex-wrap flex-row justify-between mx-2">
        {/* Card 1 */}
        <Pressable
          onPress={() => handlePress("/dashboard/CreateTrip")}
          style={{ width: "48%", marginBottom: 16 }}
        >
          <View className="bg-white rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Create Trip</CardTitle>
                  <FontAwesome name="plus-circle" size={20} color="black" />
                </View>
              </CardHeader>
              <CardContent>
                <Text className="text-base text-primary">
                  Easily Schedule a Trip
                </Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 2 */}
        <Pressable
          onPress={() => handlePress("/dashboard/AssignTruck")}
          style={{ width: "48%", marginBottom: 16 }}
        >
          <View className="bg-white rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Assign Truck</CardTitle>
                  <FontAwesome name="truck" size={24} color="black" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">Pick a truck</Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 3 */}
        <Pressable
          onPress={() => handlePress("/dashboard/TripDetails")}
          style={{ width: "48%", marginBottom: 16 }}
        >
          <View className="bg-white rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Trip Details</CardTitle>
                  <FontAwesome name="info-circle" size={24} color="black" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">
                  View details of your Trip
                </Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 4 */}
        <Pressable
          onPress={() => handlePress("/dashboard/TripProgress")}
          style={{ width: "48%", marginBottom: 16 }}
        >
          <View className="bg-white rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Trip Progress</CardTitle>
                  <FontAwesome name="map-marker" size={24} color="black" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">
                  View your trip Progress
                </Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 5 */}
        <Pressable
          onPress={() => handlePress("/dashboard/FuelManagement")}
          style={{ width: "48%", marginBottom: 16 }}
        >
          <View className="bg-white rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Fuel Mgt</CardTitle>
                  <MaterialCommunityIcons name="fuel" size={24} color="black" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">
                  Trip Fuel Management
                </Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>

        {/* Card 6 */}
        <Pressable
          onPress={() => handlePress("/dashboard/CloseTrip")}
          style={{ width: "48%", marginBottom: 16 }}
        >
          <View className="bg-white rounded-xl">
            <Card className="w-full">
              <CardHeader className="flex">
                <View className="flex flex-row w-full items-center   justify-between ">
                  <CardTitle>Close Trip</CardTitle>
                  <FontAwesome name="check-circle" size={24} color="black" />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-base text-primary">Complete a Trip</Text>
              </CardContent>
            </Card>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Trip;
