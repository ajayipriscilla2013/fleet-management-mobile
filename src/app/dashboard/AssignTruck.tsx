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

const assignTruckSchema = z.object({
  truckdriver_id: z.string().min(1, "Tank Level is required"),
  trip_id: z.string().min(1, "Tank Level is required"),
});

type assignTruckFormData = z.infer<typeof assignTruckSchema>;

const AssignTruck = () => {

  const [drivers, setDrivers] = useState([]);
  const [trips,setTrips]= useState([])
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await API.post("trip/trip.php", {
          dataname: "getTruckDrivers",
        });
        setDrivers(response.data.data);
      } catch (error) {
        console.error("Error fetching truck Drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

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

  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<assignTruckFormData>({
    resolver: zodResolver(assignTruckSchema),
  });

  const onSubmit = async(data: assignTruckFormData) => {
    const user_id = await AsyncStorage.getItem("user_id");
    const formattedData = {
     truckdriver_id: data.truckdriver_id,
  trip_id: data.trip_id,
  user_id,
  dataname: "assignTruckDriverToTrip"
    };
    console.log("Form data:", data);
    try {
      const response = await API.post("trip/trip.php", formattedData);
  
      console.log("API Response:", response.data);
  
      if (response.status === 201) {
        Alert.alert(
          "Trip Created",
          "Your trip details have been successfully submitted!"
        );
        router.push("/dashboard/createdtrips")
      }
       else {
        Alert.alert("Submission Failed", "Please check your input.");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      Alert.alert(
        "Error",
        "An error occurred while submitting the trip details."
      );
    }
  };
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ScrollView
        className="w-full m-0 p-0 flex-co "
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        // contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
        // keyboardShouldPersistTaps="handled"
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
                  label: `${driver.driver_name} ${driver.truck_plate_number} `,
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
                  label: `${trip.origin} to ${trip.destination} `,
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
        </View>

        <Button
          label="Submit"
          className=" my-4 bg-[#3A5092] w-[90%]"
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssignTruck;
