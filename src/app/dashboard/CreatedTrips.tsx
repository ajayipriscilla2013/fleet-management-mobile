import React from "react";
import { View, Text, FlatList, SafeAreaView, Pressable } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Link } from "expo-router";

const CreatedTrips = ({ trips }) => {
  const renderItem = ({ item }) => (
    <Link href={`/dashboard/TripDetails/${item.tripId}`} asChild>
      <Pressable>
        <View className="  justify-center bg-white rounded-xl  mb-4">
          <Card className=" ">
            <CardHeader>
              <CardTitle className="flex-row justify-between items-center">
                <Text>Trip ID: {item.tripId}</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex flex-row justify-between">
                <Text>Destination: </Text>
                <Text> {item.destination}</Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text>Departure Time:</Text>
                <Text>{item.departureTime}</Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text>Load Quantity: </Text>
                <Text>{item.loadQuantity}</Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text>Truck License Plate: </Text>
                <Text> {item.truckLicensePlate}</Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text>Truck Make: </Text>
                <Text> {item.truckMake}</Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text>Driver:</Text>
                <Text>{item.driverName}</Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <SafeAreaView className="flex-1 w-[100%] p-4">
      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={(item) => item.tripId.toString()}
        numColumns={1}
        contentContainerStyle={{
          //   justifyContent: "space-between",
          //   alignItems: "center",
          //   width: "100%",
          padding: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default CreatedTrips;
