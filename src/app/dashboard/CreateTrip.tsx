import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Alert, ScrollView, Text } from "react-native";
import axios from "axios";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";

const tripSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.string().min(1, "Departure Time is required"),
  loadQuantity: z.string().min(1, "Load Quantity is required"),
  truckLicensePlate: z.string().min(1, "Truck License Plate is required"),
  truckMake: z.string().min(1, "Truck Make is required"),
  truckModel: z.string().min(1, "Truck Model is required"),
  driverName: z.string().min(1, "Driver Name is required"),
  driverContact: z.string().min(1, "Driver Contact is required"),
  currentFuelLevel: z.string().min(1, "Current Fuel Level is required"),
  recommendedFuelQuantity: z
    .string()
    .min(1, "Recommended Fuel Quantity is required"),
  nearestFuelStation: z.string().min(1, "Nearest Fuel Station is required"),
});

type TripFormData = z.infer<typeof tripSchema>;

const CreateTrip = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  // Fetch trucks data from the backend
  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/c/c8ef-f2ef-4c2d-91f0"
        );
        console.log(response.data);

        setTrucks(response.data.trucks);
      } catch (error) {
        console.error("Error fetching trucks:", error);
      }
    };

    fetchTrucks();
  }, []);

  const handleTruckChange = (licensePlate: string) => {
    setSelectedTruck(licensePlate);

    // Find the selected truck and autopopulate other fields
    const selected = trucks.find(
      (truck) => truck.licensePlate === licensePlate
    );

    if (selected) {
      setValue("truckMake", selected.make);
      setValue("truckModel", selected.model);
      setValue("driverName", selected.driverName);
      setValue("driverContact", selected.driverContact);
    }
  };

  const handleTripSubmit: SubmitHandler<TripFormData> = async (
    data: TripFormData
  ) => {
    console.log(data);

    try {
      const response = await axios.post("http://10.0.2.2:3000/trips", data);
      console.log(response);

      if (response.status === 200) {
        Alert.alert(
          "Trip Created",
          "Your trip details have been successfully submitted!"
        );
      } else {
        Alert.alert("Submission Failed", "Please check your input.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while submitting the trip details."
      );
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
        }}
        style={{ width: "100%" }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: "white",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Controller
            control={control}
            name="tripId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Trip ID"
                placeholder="Enter Trip ID"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.tripId?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="destination"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Destination"
                placeholder="Enter Destination"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.destination?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="departureTime"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Departure Time"
                placeholder="Enter Departure Time"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.departureTime?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="loadQuantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Load Quantity"
                placeholder="Enter Load Quantity"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.loadQuantity?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Text className="text-base font-semibold mb-2">
            Truck License Plate
          </Text>
          <RNPickerSelect
            placeholder={{ label: "Select Truck", value: null }}
            value={selectedTruck}
            // className="border border-input py-2.5 px-4 rounded-lg"
            onValueChange={(value) => handleTruckChange(value)}
            items={trucks.map((truck) => ({
              label: truck.licensePlate,
              value: truck.licensePlate,
            }))}
            style={{
              inputIOS: {
                width: "100%",
                marginBottom: 16,
                borderWidth: 1, // Equivalent to `border`
                borderColor: "#D1D5DB", // Equivalent to `border-input` (you may need to adjust the color)
                paddingVertical: 10, // Equivalent to `py-2.5`
                paddingHorizontal: 16, // Equivalent to `px-4`
                borderRadius: 8, // Equivalent to `rounded-lg`
              },
            }}
          />
          <Controller
            control={control}
            name="truckMake"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Truck Make"
                placeholder="Enter Truck Make"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.truckMake?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="truckModel"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Truck Model"
                placeholder="Enter Truck Model"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.truckModel?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="driverName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Driver Name"
                placeholder="Enter Driver Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.driverName?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="driverContact"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Driver Contact"
                placeholder="Enter Driver Contact"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.driverContact?.message as string}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          {/* Add other form fields as needed */}
        </View>

        <Button
          label="Create Trip"
          style={{ width: "90%", marginTop: 16, backgroundColor: "#3A5092" }}
          // onPress={handleSubmit(handleTripSubmit)}
          onPress={() => router.push("/dashboard/TripDetails")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTrip;
