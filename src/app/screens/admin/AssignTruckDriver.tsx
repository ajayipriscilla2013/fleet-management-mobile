import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import Picker from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";
import { z } from "zod";
import SuccessIcon from "@/assets/images/success.png";
import AssignDriverToTruckScreen from "./AssignTruckToDriver";

const assignDriverSchema = z.object({
  truck_driver_id: z.string().min(1, "Truck Driver is required"),
  trip_id: z.string().min(1, "Trip is required"),
  // fuelling: z.enum(["0", "1"]),
});

// const AssignTruckDriverScreen = ({ onAssignDriver, setIsFuelling }) => {
const AssignTruckDriverScreen = ({ onAssignDriver }) => {
  const [formData, setFormData] = useState({
    truck_driver_id: "",
    trip_id: "",
    // fuelling: "0",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [assignDriverModalVisible, setAssignDriverModalVisible] =
    useState(false); // State for controlling AssignDriver modal
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [truckName, setTruckName] = useState("");
  const [truckPlateNumber, setTruckPlateNumber] = useState("");

  const { data: driversData = [], isLoading: isDriversLoading } = useQuery({
    queryKey: ["driversforAssigning"],
    queryFn: async () => {
      const response = await API.post("trip/trip.php", {
        dataname: "getUnassignedDrivers",
      });
      return response.data.data;
    },
  });

  const drivers = driversData.map((driver) => ({
    label: driver.driver_name,
    value: driver.truck_driver_id,
  }));

 


  useEffect(() => {
    refetchTrips()
    if (formData.truck_driver_id) {
      const selectedDriver = driversData.find(
        (driver) => driver.truck_driver_id === formData.truck_driver_id
      );
      if (selectedDriver) {
        setTruckName(selectedDriver.truck_name);
        setTruckPlateNumber(selectedDriver.truck_plate_number);
      }
    }
  }, [formData.truck_driver_id, driversData]);

  const { data: trips = [], isLoading: isTripsLoading,refetch:refetchTrips } = useQuery({
    queryKey: ["tripsToBeAssigned"],
    queryFn: async () => {
      // const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "getInitiatedTrips",
        // user_id,
      });
      return response.data.data.map((trip) => ({
        label: `${trip.trip_id} - ${trip.origin_name} to ${trip.destination_name}`,
        value: trip.trip_id,
      }));
    },
  });

  useEffect(()=>{
    refetchTrips()
  },[trips])

  const assignTruckDriverMutation = useMutation({
    mutationFn: async () => {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "assignTruckDriverToTrip",
        ...formData,
        user_id,
      });
      return response.data;
    },
    onSuccess: () => {
      Alert.alert("Success", `Driver Assigned to Trip`);
      // setModalVisible(true);
      onAssignDriver();
    },
    onError: (error) => {
     const errorMessage =
      error.response?.data?.message || "Request Failed, Try Again";
    console.error("Error submitting data:", error);
    Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleSubmit = () => {
    const validation = assignDriverSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    assignTruckDriverMutation.mutate();
    setErrors({});
  };

  const getPickerStyle = (fieldName) => ({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: focusedField === fieldName ? "#394F91" : "#C4CCF0",
      borderRadius: 4,
      color: "black",
      paddingRight: 30,
      backgroundColor: focusedField === fieldName ? "#F0F2FF" : "white",
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: focusedField === fieldName ? "#394F91" : "#C4CCF0",
      borderRadius: 12,
      color: "black",
      paddingRight: 30,
      backgroundColor: focusedField === fieldName ? "#F0F2FF" : "white",
    },
  });

  return (
    <ScrollView className="flex-1 pt-6">
      <View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600 mb-[10px]">Truck Driver</Text>
          {errors.truck_driver_id && (
            <Text className="mb-2 text-red-500">{errors.truck_driver_id}</Text>
          )}
        </View>
        <View
          className="mb-4 bg-white rounded-md p-2 h-[60px]"
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
            paddingVertical: 2,
          }}
        >
          <Picker
            value={formData.truck_driver_id}
            onValueChange={(value) =>
              setFormData({ ...formData, truck_driver_id: value })
            }
            items={drivers}
            placeholder={{ label: "Select Truck Driver", value: "" }}
            style={getPickerStyle("truck_driver_id")}
            onOpen={() => setFocusedField("truck_driver_id")}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Truck Name</Text>
        <TextInput
          value={truckName}
          editable={false}
          className="mb-4 bg-gray-100 rounded-md p-2 h-[60px]"
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
          }}
        />
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Truck Plate Number</Text>
        <TextInput
          value={truckPlateNumber}
          editable={false}
          className="mb-4 bg-gray-100 rounded-md p-2 h-[60px]"
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
          }}
        />
      </View>


      <Text className="text-gray-600 mb-[10px]">Assign Different Truck to Driver</Text>
      <TouchableOpacity
        className="bg-white rounded-md p-2 mb-4 h-[60px] justify-center"
        style={{
          borderWidth: 1,
          borderColor: "#C4CCF0",
          borderRadius: 8,
        }}
        onPress={() => setAssignDriverModalVisible(true)}
      >
        <Text className="text-gray-600">Do you want to Assign Driver to Another Truck?</Text>
      </TouchableOpacity>

      <View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600 mb-[10px]">Trips</Text>
          {errors.trip_id && (
            <Text className="mb-2 text-red-500">{errors.trip_id}</Text>
          )}
        </View>
        <View
          className="mb-4 bg-white rounded-md p-2 h-[60px]"
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
            paddingVertical: 2,
          }}
        >
          <Picker
            value={formData.trip_id}
            onValueChange={(value) =>
              setFormData({ ...formData, trip_id: value })
            }
            items={trips}
            placeholder={{ label: "Select Trip", value: "" }}
            style={getPickerStyle("trip_id")}
            onOpen={() => setFocusedField("trip_id")}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View>

      {/* <View>
        <Text className="text-gray-600 mb-[10px]">Fueling ?</Text>
        <View
          className="mb-4 bg-white rounded-md p-2 h-[60px]"
          style={{
            borderWidth: 1,
            borderColor: "#C4CCF0",
            borderRadius: 8,
            paddingVertical: 2,
          }}
        >
          <Picker
            value={formData.fuelling}
            onValueChange={(value) => {
              setFormData({ ...formData, fuelling: value });
              setIsFuelling(value);
            }}
            items={[
              { label: "No", value: "0" },
              { label: "Yes", value: "1" },
            ]}
            placeholder={{ label: "Select Fueling Option", value: null }}
            style={getPickerStyle("fuelling")}
            onOpen={() => setFocusedField("fuelling")}
            onClose={() => setFocusedField(null)}
          />
        </View>
      </View> */}

      <TouchableOpacity
        className={`rounded-2xl p-4 mt-6 ${
          assignTruckDriverMutation.isPending ? "bg-[#8896C3]" : "bg-[#394F91]"
        }`}
        disabled={
          assignTruckDriverMutation.isPending ||
          isDriversLoading ||
          isTripsLoading
        }
        onPress={handleSubmit}
      >
        {assignTruckDriverMutation.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text className="text-white text-center font-semibold">Submit</Text>
        )}
      </TouchableOpacity>

      {/* Assign Driver Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={assignDriverModalVisible}
        onRequestClose={() => setAssignDriverModalVisible(false)}
      >
        <View className=" flex-1 p-4">
        <TouchableOpacity
        style={{ alignSelf: 'flex-start' }}
        onPress={() => setAssignDriverModalVisible(false)}
      >
        <Text style={{ fontSize: 18, color: '#394F91' }}>Close</Text>
      </TouchableOpacity>
        <Text className="font-semibold text-center text-xl text-[#394F91] mb-2">Assign Different Truck to Driver</Text>
          <AssignDriverToTruckScreen
          onAssignDriver={() => {
            setAssignDriverModalVisible(false);
          }}
          />
        </View>
      </Modal>
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0, 0, 0, 0.5)] gap-4">
          <View className='m-5 bg-white rounded-2xl p-9 items-center' style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
              <Image source={SuccessIcon} />
            </View>
            <Text className="font-semibold text-center text-xl text-[#394F91]">Assignment Successful 🚀</Text>
            <Text className="text-primary text-center mt-2">
              You have successfully assigned a truck driver to the trip
            </Text>
            <TouchableOpacity
              className="bg-[#394F91] p-4 rounded-lg mt-4 w-full"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

export default AssignTruckDriverScreen;
