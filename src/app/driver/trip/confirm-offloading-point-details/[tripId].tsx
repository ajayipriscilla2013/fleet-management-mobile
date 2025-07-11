import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import Camera from "@/assets/svgs/Camera.svg";
import API from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import * as Location from "expo-location";
import ZoomedCameraComponent from "@/components/ZoomedCamera";
import { Picker } from "@react-native-picker/picker";

// Define the validation schema using Zod
const offloadingSchema = z.object({
  offloading_qty: z.coerce.number().min(1, "Tonnage Offloaded is required"),
  waybill_no: z.coerce.string().nonempty("Waybill Number is required"),
  remarks: z.string().min(1, "Remarks is Required"),
  delivery_location: z.string().nonempty("Delivery location required"),
  //product_picture: z.string().nonempty("Product picture is required"),

   /*odometer_reading: z.coerce
    .string()
    .nonempty("Odometer Reading is required")
    .regex(/^[0-9]*$/, "Must be a valid number"), */
    
});

const OffloadingPointScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [focusedField, setFocusedField] = useState(null);
  const [location, setLocation] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [formData, setFormData] = useState({
    trip_id: tripId,
    offloading_qty: "",
    waybill_no: "",
    odometer_reading: "",
    product_picture: "",
    odometer_picture: "",
    delivery_location: "",
    waybill_picture: "",
    latitude: null,
    longitude: null,
    delivery_time: new Date(),
    remarks: "",

    dataname: "driverOffloadingPoint",
  });

  // Request location permission and get the user's location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Location Permission Status:", status);
  
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }
  
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
  
        console.log("Current Location:", currentLocation);
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    })();
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);

  const {
    data: tripData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["thistripData", tripId],
    queryFn: async () => {
      const response = await API.post("trip/trip.php", {
        trip_id: tripId,
        dataname: "getTrip",
      });
      setFormData((prevData) => ({
        ...prevData,
        delivery_location: response.data.data.destination_name,
      }));
      return response.data.data.destination_name;
    },
  });

  const submitOffloadingData = async (data) => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
    const response = await API.post("trip/trip.php", {
      dataname: "driverOffloadingPoint",
      driver_id: userId,
      ...data,
      delivery_time: dayjs(data.delivery_time).format("YYYY-MM-DD HH:mm:ss"),
    });
    return response.data;
    } catch (error) {
      console.log(error);
      
    }
    
  };

  const mutation = useMutation({
    mutationFn: submitOffloadingData,
    onSuccess: () => {
      Alert.alert("Success", "Offloading point data submitted");
      queryClient.invalidateQueries("TripInfoForDriver");
      queryClient.invalidateQueries("inProgressTripsForDriver");
      router.push("/driver/trip?tab=inProgress");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Request Failed, Try Again";
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

  const handleDeliveryTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.delivery_time;
    setShowDeliveryTimePicker(false);
    setFormData((prevData) => ({ ...prevData, delivery_time: currentDate }));
  };

  const handleSubmit = async () => {
    console.log("Location at Submit:", location);
    console.log("FormData before Submit:", formData);
    
    if (!location) {
      let currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation) {
        setLocation(currentLocation);
      } else {
        Alert.alert("Location not available", "Please enable location services and try again.");
        return;
      }
    }
  
    // Ensure formData is updated with the latest location
    const updatedFormData = {
      ...formData,
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    };

    console.log("Updated FormData:", updatedFormData);
  
    try {
      setFormErrors({});
      offloadingSchema.parse(updatedFormData);
      mutation.mutate(updatedFormData);
    } catch (error) {
      console.log(error);
      
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      <View className="mb-4">
        <View className="flex-col justify-between">
          <View className="flex-row w-full  justify-between">
            <Text className="text-gray-600 mb-[10px]">Tonnage Offloaded</Text>
            {formErrors.offloading_qty && (
              <Text className="text-red-500 text-sm">
                {formErrors.offloading_qty}
              </Text>
            )}
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: focusedField ? "#C4CCF0" : "#D1D3D8",
              borderRadius: 8,
              paddingVertical: 2,
            }}
            className={`border bg-white rounded-md w-full  p-2 h-[60px] ${
              focusedField === formData.offloading_qty
                ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
            }`}
          >
            <Picker
              selectedValue={formData.offloading_qty}
              onValueChange={(itemValue) => {
                setFormData({ ...formData, offloading_qty: itemValue });
                // setIsFocused(true);
              }}
              className={`border bg-white rounded-md  p-2 h-[60px] ${
                focusedField === formData.offloading_qty
                  ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
                  : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
              }`}
            >
              <Picker.Item label="Select Tonnage" value="" />
              {[30, 45, 60]?.map((tonnage, index) => (
                <Picker.Item key={index} label={tonnage} value={tonnage} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      {[
        {
          label: "Delivery Location",
          name: "delivery_location",
          placeholder: "Loading...",
          error: formErrors.delivery_location,
          editable: false,
          numeric: true,
        },
        // { label: 'Tonnage Offloaded', name: 'offloading_qty', placeholder: 'Enter tonnage offloaded', error: formErrors.offloading_qty,numeric:true },
        {
          label: "Waybill Number",
          name: "waybill_no",
          placeholder: "Enter waybill number",
          error: formErrors.waybill_no,
        },
        {
          label: "Odometer Reading",
          name: "odometer_reading",
          placeholder: "Enter odometer reading",
          error: formErrors.odometer_reading,
          numeric: true,
        },
        {
          label: "Remarks",
          name: "remarks",
          placeholder: "Enter remarks",
          error: formErrors.remarks,
        },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
            {item.error && (
              <Text className="text-red-500 text-sm">{item.error}</Text>
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
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChangeText={(text) => handleInputChange(item.name, text)}
            editable={item.editable !== false}
            keyboardType={item.numeric ? "numeric" : "default"}
          />
        </View>
      ))}

      <View className="mb-4">
        <Text className="text-gray-600 mb-[10px]">Delivered On</Text>
        <TouchableOpacity
          onPress={() => setShowDeliveryTimePicker(true)}
          className={`border bg-white rounded-md p-2 h-[60px] justify-center ${
            focusedField === "delivery_time"
              ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
              : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
          }`}
        >
          <Text>{dayjs(formData.delivery_time).format("LL")}</Text>
        </TouchableOpacity>
        {formErrors.delivery_time && (
          <Text className="text-red-500 text-sm">
            {formErrors.delivery_time}
          </Text>
        )}
      </View>

      {showDeliveryTimePicker && (
        <DateTimePicker
          value={formData.delivery_time}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDeliveryTimeChange}
        />
      )}

      <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 rounded-lg">
        Note: Capture the following information: Current Odometer reading at
        fuelling point, Picture of the Truck Dashboard (Before and after
        fuelling), The fuel pump (Before and after fueling) and Picture of Truck
        Driver and Fuel Attendant together.
      </Text>

      {[
        { label: "Product Picture", field: "product_picture" },
        { label: "Odometer Picture", field: "odometer_picture" },
        { label: "Waybill Picture", field: "waybill_picture" },
      ].map((item, index) => (
        <>
          <Text className="text-gray-600 mb-[10px] capitalize">
            Upload {item.label}
          </Text>
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mb-4"
            onPress={() => openCameraForField(item.field)}
          >
            {formData[item.field] ? (
              <Image
                source={{ uri: formData[item.field] }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            ) : (
              <View className="flex items-center">
                <View className="h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full">
                  <Camera className="w-6 h-6 text-blue-600 mr-2" />
                </View>
                <Text className="font-semibold">Take a Snap</Text>
                <Text className="text-gray-500">Upload {item.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        </>
      ))}

      <TouchableOpacity
        className="bg-[#394F91]  p-4 mt-6 mb-6 h-[60px] rounded-md flex items-center justify-center"
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? "Submitting..." : "Confirm Offloading Details"}
        </Text>
      </TouchableOpacity>

      <Modal visible={cameraVisible} animationType="slide">
        <ZoomedCameraComponent
          onImageCaptured={handleImageCapture}
          onClose={() => setCameraVisible(false)}
        />
      </Modal>
    </ScrollView>
  );
};

export default OffloadingPointScreen;
