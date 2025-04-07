import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  Modal,
} from "react-native";
import Camera from "@/assets/svgs/Camera.svg";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import ZoomedCameraComponent from "@/components/ZoomedCamera";

const fuelEntrySchema = z.object({
  current_location: z.string().nonempty("Current location is required"),
  liters_filled: z.number().positive("Litres filled must be a positive number"),
  amount_per_liter: z
    .number()
    .positive("Amount per litre must be a positive number"),
  total_amount: z
    .number()
    .nonnegative("Total amount must be a non-negative number"),
  // odometer_before: z
  //   .number()
  //   .min(0, "Odometer reading before must be a non-negative number"),
  // odometer_after: z
  //   .number()
  //   .min(0, "Odometer reading after must be a non-negative number"),
  pump_reading_before: z
    .number()
    .min(0, "Pump reading before must be a non-negative number"),
  pump_reading_after: z
    .number()
    .min(0, "Pump reading after must be a non-negative number"),
  driver_name: z.string().nonempty("Driver name is required"),
  attendant_picture: z.string().nonempty("Attendant picture is required"),
  truck_tank_picture: z.string().nonempty("Truck tank picture is required"),
  gauge_pump_picture: z.string().nonempty("Gauge pump picture is required"),
  driver_picture: z.string().nonempty("Driver picture is required"),
});

const FuelInformationScreen = () => {
  const { request_id } = useLocalSearchParams();
  console.log("trip_ID from Fuel Attendant", request_id);
  const router = useRouter();

  const [focusedField, setFocusedField] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [formData, setFormData] = useState({
    fuel_request_id: request_id,
    current_location: "",
    liters_filled: "",
    amount_per_liter: "",
    total_amount: "",
    // odometer_before: "",
    // odometer_after: "",
    pump_reading_before: "",
    pump_reading_after: "",
    driver_name: "",
    attendant_picture: "",
    truck_tank_picture: "",
    gauge_pump_picture: "",
    driver_picture: "",
    dataname: "attendantFuelEntry",
  });
  // const [images, setImages] = useState({
  //   attendant_picture: null,
  //   truck_tank_picture: null,
  //   gauge_pump_picture: null,
  //   driver_picture: null,
  // });
  const [errors, setErrors] = useState({});

  const submitFuelData = async (data) => {
    const vendor_agent_id = await AsyncStorage.getItem("user_id");
    console.log("LOOK HERE",vendor_agent_id);
    
    const response = await API.post("trip/trip.php", {
      dataname: "attendantFuelEntry",
      vendor_agent_id,
      ...data,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitFuelData,
    onSuccess: () => {
      console.log("Fuel data submitted");
      Alert.alert("Success", "Fuel data confirmed");
      router.push("/fuel-attendant/trip?tab=fueled");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Request Failed Try again";
      console.error("Error submitting data:", error);
      Alert.alert("Error", `${errorMessage}`);
      
    },
  });

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageCapture = (image) => {
    if (currentField) {
      setFormData((prevData) => ({ ...prevData, [currentField]: image.uri }));
      setCameraVisible(false);
    }
  };

  const openCameraForField = (field) => {
    setCurrentField(field);
    setCameraVisible(true);
  };
  const calculateTotalAmount = () => {
    const liters = parseFloat(formData.liters_filled) || 0;
    const pricePerLiter = parseFloat(formData.amount_per_liter) || 0;
    const total = liters * pricePerLiter;
    setFormData((prevData) => ({
      ...prevData,
      total_amount: total.toFixed(2),
    }));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [formData.liters_filled, formData.amount_per_liter]);

  const handleSubmit = () => {
    try {
      // Parse the form data using Zod schema
      fuelEntrySchema.parse({
        ...formData,
        liters_filled: parseFloat(formData.liters_filled),
        amount_per_liter: parseFloat(formData.amount_per_liter),
        total_amount: parseFloat(formData.total_amount),
        odometer_before: parseFloat(formData.odometer_before),
        odometer_after: parseFloat(formData.odometer_after),
        pump_reading_before: parseFloat(formData.pump_reading_before),
        pump_reading_after: parseFloat(formData.pump_reading_after),
      });

      mutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form errors based on Zod validation
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setErrors(errors);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
        {[
          {
            label: "Current Location",
            name: "current_location",
            placeholder: "Ibadan",
          },
          {
            label: "Fuel Price Per Litre",
            name: "amount_per_liter",
            placeholder: "₦900",
            numeric:true
          },
          {
            label: "Total Litres",
            name: "liters_filled",
            placeholder: "Enter total litres",
            numeric:true
          },
          {
            label: "Total Fuel Price",
            name: "total_amount",
            placeholder: "Enter total fuel price",
            numeric:true
          },
          // {
          //   label: "Odometer Reading Before",
          //   name: "odometer_before",
          //   placeholder: "Enter odometer",
          //   numeric:true
          // },
          // {
          //   label: "Odometer Reading After",
          //   name: "odometer_after",
          //   placeholder: "Enter odometer",
          //   numeric:true
          // },
          {
            label: "Pump Reading Before",
            name: "pump_reading_before",
            placeholder: "Enter Pump Reading",
            numeric:true
          },
          {
            label: "Pump Reading After",
            name: "pump_reading_after",
            placeholder: "Enter Pump Reading",
            numeric:true
          },
          {
            label: "Name of Truck Driver",
            name: "driver_name",
            placeholder: "Enter name of Truck Driver",
          },
        ].map((item, index) => (
          <View key={item.label} className="mb-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
              {errors[item.name] && (
                <Text className="text-red-500">{errors[item.name]}</Text>
              )}
            </View>
            <TextInput
            onFocus={() => setFocusedField(item.name)}
            onBlur={() => setFocusedField(null)}
            className={`border bg-white rounded-md p-2 h-[60px] ${
              focusedField === item.name
                ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
            }`}
              // className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border  border-[#C4CCF0] bg-white rounded-md p-2 h-[60px]"
              placeholder={item.placeholder}
              value={formData[item.name]}
              keyboardType={item.numeric?"numeric":"default"}
              onChangeText={(text) => handleInputChange(item.name, text)}
            />
          </View>
        ))}

        <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
          Note: Capture the following information: Current Odometer reading at
          fuelling point, Picture of the Truck Dashboard (Before and after
          fuelling), The fuel pump (Before and after fueling) and Picture of
          Truck Driver and Fuel Attendant together.
        </Text>

        {[
          {label:"Attendant Picture",field:"attendant_picture"},
          {label:"Truck Tank Picture",field:"truck_tank_picture"},
          {label:"Gauge Pump Picture",field:"gauge_pump_picture"},
          {label:"Driver Picture",field:"driver_picture"},
        ].map((item,index) => (
          <>
          <Text className="text-gray-600 mt-[10px]  capitalize">Upload {item.label}</Text>
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4"
            onPress={() => openCameraForField(item.field)}
          >
            <View className="flex flex-col items-center">
              {formData[item.field] ? (
                <Image
                  source={{ uri: formData[item.field] }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
              ) : (
                <>
                  <View className="h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full">
                    <Camera className="w-6 h-6 text-blue-600 mr-2" />
                  </View>
                  <Text className="font-semibold">Take a Snap</Text>
                  <Text className="text-center text-gray-500 text-sm mt-2">
                    {item.label}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          </>
        ))}


        <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4 mt-6"
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          <Text className="text-white text-center font-semibold">
            {mutation.isPending ? "Submitting..." : "Confirm Fuel"}
          </Text>
        </TouchableOpacity>


        <Modal visible={cameraVisible} animationType="slide">
        <ZoomedCameraComponent
          onImageCaptured={handleImageCapture}
          onClose={() => setCameraVisible(false)}
        />
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FuelInformationScreen;
