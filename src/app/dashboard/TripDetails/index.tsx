import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Button } from "react-native";
import CreatedTrips from "../CreatedTrips";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";

// onPress={() => router.navigate("/dashboard/TripDetails/1")}
export default function Page() {
  const { slug } = useLocalSearchParams();
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

  const tripsData = [
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
  ];
  return <CreatedTrips trips={trips} />;
}
