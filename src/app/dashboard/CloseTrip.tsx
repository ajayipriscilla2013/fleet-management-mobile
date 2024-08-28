import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useState } from "react";
import { Button, SafeAreaView, Text, View, FlatList } from "react-native";

const CloseTrip = () => {
  const [trips, setTrips] = useState([
    {
      tripId: "1",
      destination: "Lagos",
      departureTime: "10:00 AM",
      loadQuantity: "20 tons",
      truckLicensePlate: "ABC-123",
      truckMake: "Toyota",
      driverName: "John Doe",
    },
    {
      tripId: "2",
      destination: "Lagos",
      departureTime: "10:00 AM",
      loadQuantity: "20 tons",
      truckLicensePlate: "ABC-123",
      truckMake: "Toyota",
      driverName: "John Doe",
    },
    {
      tripId: "3",
      destination: "Lagos",
      departureTime: "10:00 AM",
      loadQuantity: "20 tons",
      truckLicensePlate: "ABC-123",
      truckMake: "Toyota",
      driverName: "John Doe",
    },
  ]);

  const handleCloseTrip = (tripId) => {
    // Logic to close the trip
    console.log(`Closing trip with ID: ${tripId}`);
    // You might want to update the trips state to remove the closed trip
  };

  return <CloseTrips trips={trips} onCloseTrip={handleCloseTrip} />;
};

export default CloseTrip;

const CloseTrips = ({ trips, onCloseTrip }) => {
  const renderTrip = ({ item }) => (
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
        <Button
          title="Close Trip"
          color="#FF6347"
          onPress={() => onCloseTrip(item.tripId)}
        />
      </Card>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={trips}
        keyExtractor={(item) => item.tripId.toString()}
        renderItem={renderTrip}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};
