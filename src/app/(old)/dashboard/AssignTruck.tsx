import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import RNPickerSelect from "react-native-picker-select";
import { useEffect, useState } from "react";
import API from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Switch } from 'react-native-switch';

const assignTruckSchema = z.object({
  // truckdriver_id: z.string().min(1, "Truck driver is required"),
  trip_id: z.string().min(1, "Trip is required"),
  fuelling: z.enum(["0", "1"], "Fuelling must be either '0' or '1'"),
});

type AssignTruckFormData = z.infer<typeof assignTruckSchema>;

const AssignTruck = () => {
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isFuellingRequired, setIsFuellingRequired] = useState(false);

  const fetchDrivers = async () => {
    try {
      const response = await API.post("trip/trip.php", {
        dataname: "getTruckDrivers",
      });
      console.log("Drivers fetched:", response.data);
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching truck Drivers:", error);
      Alert.alert("Error", "Failed to fetch truck drivers");
    }
  };

  const fetchTrips = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "getTrips",
        user_id,
      });
      setTrips(response.data.data || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert("Error", "Failed to fetch trips");
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchTrips();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssignTruckFormData>({
    resolver: zodResolver(assignTruckSchema),
    defaultValues: {
      fuelling: "0",
    },
  });

  useEffect(() => {
    setValue("fuelling", isFuellingRequired ? "1" : "0");
  }, [isFuellingRequired, setValue]);

  const onSubmit = async (data: AssignTruckFormData) => {
    console.log("Form data:", data);
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const formattedData = {
        truck_driver_id: "fma2658", // rather data.truck_driver_id
        trip_id: data.trip_id,
        fuelling: data.fuelling,
        user_id,
        dataname: "assignTruckDriverToTrip"
      };
      console.log("Sending data:", formattedData);
  
      const response = await API.post("trip/trip.php", formattedData);
      console.log("API Response:", response.data);
  
      if (response.data.status === "success") {
        Alert.alert(
          "Assignment Successful",
          "The truck driver has been successfully assigned to the trip!"
        );
        router.push("/dashboard/createdtrips");
      } else {
        Alert.alert("Submission Failed", response.data.message || "Please check your input.");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      
      // Check if the error has a response and display the message
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        // Display the error message from the API response
        Alert.alert(
          "Error",
          error.response.data.message || "An unexpected error occurred."
        );
      } else {
        // If there's no response from the server, display a generic error message
        Alert.alert(
          "Error",
          "An error occurred while submitting the assignment details."
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ScrollView
        className="w-full m-0 p-0 flex-col"
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
      >
        <View className="w-[90%] bg-white p-4 rounded-xl">
          <Text className="text-base font-semibold mb-2">Drivers</Text>
          <Controller
            control={control}
            name="truckdriver_id"
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                placeholder={{ label: "Select Driver", value: null }}
                value={value}
                onValueChange={onChange}
                items={drivers.map((driver) => ({
                  label: `${driver.driver_name} ${driver.truck_plate_number}`,
                  value: driver.id,
                }))}
                style={{
                  inputIOS: {
                    width: "100%",
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  },
                }}
              />
            )}
          />
          {errors.truckdriver_id && (
            <Text className="text-red-500">{errors.truckdriver_id.message}</Text>
          )}

          <Text className="text-base font-semibold mb-2">Trips</Text>
          <Controller
            control={control}
            name="trip_id"
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                placeholder={{ label: "Select Trip", value: null }}
                value={value}
                onValueChange={onChange}
                items={trips.map((trip) => ({
                  label: `${trip.origin} to ${trip.destination}`,
                  value: trip.trip_id,
                }))}
                style={{
                  inputIOS: {
                    width: "100%",
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  },
                }}
              />
            )}
          />
          {errors.trip_id && (
            <Text className="text-red-500">{errors.trip_id.message}</Text>
          )}

          <View className="my-4">
            <Text className="text-base font-semibold mb-2">Fuelling Required</Text>
            <Switch
              value={isFuellingRequired}
              onValueChange={(val) => {
                setIsFuellingRequired(val);
                setValue("fuelling", val ? "1" : "0");
              }}
              activeText={'Yes'}
              inActiveText={'No'}
              circleSize={30}
              barHeight={30}
              circleBorderWidth={3}
              backgroundActive={'#3A5092'}
              backgroundInactive={'gray'}
              circleActiveColor={'#3A5092'}
              circleInActiveColor={'#000000'}
              switchRightPx={30}
              switchLeftPx={30}
              switchWidthMultiplier={2}
            />
          </View>

          <Controller
            control={control}
            name="fuelling"
            render={({ field: { value } }) => (
              <Input
                type="hidden"
                value={value}
              />
            )}
          />
        </View>

        <Button
          label="Submit"
          className="my-4 bg-[#3A5092] w-[90%]"
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssignTruck;