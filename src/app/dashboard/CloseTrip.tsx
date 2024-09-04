import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import API from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View, FlatList } from "react-native";

const CloseTrip = () => {
  // const [trips, setTrips] = useState([
  //   {
  //     tripId: "1",
  //     destination: "Lagos",
  //     departureTime: "10:00 AM",
  //     loadQuantity: "20 tons",
  //     truckLicensePlate: "ABC-123",
  //     truckMake: "Toyota",
  //     driverName: "John Doe",
  //   },
  //   {
  //     tripId: "2",
  //     destination: "Lagos",
  //     departureTime: "10:00 AM",
  //     loadQuantity: "20 tons",
  //     truckLicensePlate: "ABC-123",
  //     truckMake: "Toyota",
  //     driverName: "John Doe",
  //   },
  //   {
  //     tripId: "3",
  //     destination: "Lagos",
  //     departureTime: "10:00 AM",
  //     loadQuantity: "20 tons",
  //     truckLicensePlate: "ABC-123",
  //     truckMake: "Toyota",
  //     driverName: "John Doe",
  //   },
  // ]);

  const [trips,setTrips]= useState([])
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");
       
        
        const response = await API.post("trip/trip.php", {
          dataname: "getTrips",
        });
       
        setTrips(response.data.data);
       
      } catch (error) {
        console.error("API request error", error);
      }
    };

    fetchTrips();
  }, []);

  const closeTrip = async (trip_id) => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
     
      
      const response = await API.post("trip/trip.php", {
        trip_id,
  user_id,
  dataname: "closeTrip"
      });
     
      setTrips(response.data.data);
     
    } catch (error) {
      console.error("API request error", error);
    }
  };

  const handleCloseTrip = (tripId) => {
    // Logic to close the trip
    closeTrip(tripId)
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
            <Text>Trip ID: {item.trip_id}</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex flex-row justify-between">
            <Text>Destination: </Text>
            <Text> {item.destination}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text>Departure Time:</Text>
            <Text>{item.schedule_time}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text>Load Quantity: </Text>
            <Text>{item.loading_qty}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text>Customer Name: </Text>
            <Text> {item.customer_name}</Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text>Status: </Text>
            <Text> {item.status}</Text>
          </View>

          
        </CardContent>
        <Button
          title="Close Trip"
          color="#FF6347"
          onPress={() => onCloseTrip(item.trip_id)}
        />
      </Card>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={trips}
        keyExtractor={(item) => item.trip_id.toString()}
        renderItem={renderTrip}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};
