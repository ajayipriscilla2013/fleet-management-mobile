import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import CreatedTrips from "./CreatedTrips";

const TripDetails = () => {
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
};

export default TripDetails;
