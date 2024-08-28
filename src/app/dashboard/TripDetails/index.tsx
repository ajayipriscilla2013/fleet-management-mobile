import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import React from "react";
import { SafeAreaView, ScrollView, Text, View, Button } from "react-native";
import CreatedTrips from "../CreatedTrips";

// onPress={() => router.navigate("/dashboard/TripDetails/1")}
export default function Page() {
  const { slug } = useLocalSearchParams();
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
  return <CreatedTrips trips={tripsData} />;
}
