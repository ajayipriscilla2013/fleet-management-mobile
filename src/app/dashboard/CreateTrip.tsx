import {
  View,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView,
} from "react-native";
import React from "react";
import axios from "axios";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const handleTripSubmit: SubmitHandler<TripFormData> = async (
    data: TripFormData
  ) => {
    console.log(data);

    try {
      const response = await axios.post("http://example.com/api/trip", data);
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
    <SafeAreaView className="flex-1 items-center justify-center">
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
      {/* <KeyboardAwareScrollView> */}
      <ScrollView
        className="w-full m-0 p-0 flex-co "
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
      >
        <View className="w-[90%] bg-white p-4 rounded-xl">
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
                className="mb-4 "
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
                className="mb-4"
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
                className="mb-4"
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
                className="mb-4"
              />
            )}
          />
          <Controller
            control={control}
            name="truckLicensePlate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Truck License Plate"
                placeholder="Enter Truck License Plate"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.truckLicensePlate?.message as string}
                className="mb-4"
              />
            )}
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
                className="mb-4"
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
                className="mb-4"
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
                className="mb-4"
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
                className="mb-4"
              />
            )}
          />
          <Controller
            control={control}
            name="currentFuelLevel"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Current Fuel Level"
                placeholder="Enter Current Fuel Level"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.currentFuelLevel?.message as string}
                className="mb-4"
              />
            )}
          />
          <Controller
            control={control}
            name="recommendedFuelQuantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Recommended Fuel Quantity"
                placeholder="Enter Recommended Fuel Quantity"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.recommendedFuelQuantity?.message as string}
                className="mb-4"
              />
            )}
          />
          <Controller
            control={control}
            name="nearestFuelStation"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nearest Fuel Station"
                placeholder="Enter Nearest Fuel Station"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.nearestFuelStation?.message as string}
                className="mb-4"
              />
            )}
          />
        </View>

        <Button
          label="Create Trip"
          className="w-[90%] my-4 bg-[#3A5092]"
          // onPress={handleSubmit(handleTripSubmit)}
          onPress={() => router.push("/dashboard/TripDetails")}
        />
      </ScrollView>
      {/* </KeyboardAwareScrollView> */}
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default CreateTrip;
