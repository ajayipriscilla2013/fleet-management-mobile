import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";
import { z } from "zod";
import AssignDriverToTruckScreen from "./AssignTruckToDriver";
import SuccessIcon from "@/assets/images/success.png";

const assignDriverSchema = z.object({
  truck_driver_id: z.string().min(1, "Truck Driver is required"),
  trip_id: z.string().min(1, "Trip is required"),
  // fuelling: z.enum(["0", "1"]),
});

const AssignTruckDriverScreen = ({ onAssignDriver }) => {
  const [formData, setFormData] = useState({
    truck_driver_id: "",
    trip_id: "",
  });

  const queryClient= useQueryClient()
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [truckName, setTruckName] = useState("");
  const [truckPlateNumber, setTruckPlateNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
    const [assignDriverModalVisible, setAssignDriverModalVisible] =useState(false); // State for controlling AssignDriver modal
    const [focusedField, setFocusedField] = useState(null);
    

  const { data: driversData = [], isLoading: isDriversLoading } = useQuery({
    queryKey: ["driversforAssigning"],
    queryFn: async () => {
      const response = await API.post("trip/trip.php", {
        dataname: "getUnassignedDrivers",
      });
      return response.data.data;
    },
  });

  useEffect(() => {
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
      queryClient.invalidateQueries('initiatedTripsForAdmin')
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
          className={`mb-4 bg-white rounded-md p-2 h-[60px] ${
            isFocused
              ? "shadow-[0px 4px 6px rgba(238, 240, 251, 1)] border-[#C4CCF0]"
              : "border-[#D1D3D8]"
          }`}
          style={{
            borderWidth: 1,
            borderColor: isFocused ? "#C4CCF0" : "#D1D3D8",
            borderRadius: 8,
            paddingVertical: 2,
          }}
        >
          <Picker
            selectedValue={formData.truck_driver_id}
            onValueChange={(itemValue) => {
              setFormData({ ...formData, truck_driver_id: itemValue });
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <Picker.Item label="Select Truck Driver" value="" />
            {driversData.map((driver) => (
              <Picker.Item
                key={driver.truck_driver_id}
                label={driver.driver_name}
                value={driver.truck_driver_id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Truck Name</Text>
        <TextInput
          value={truckName}
          editable={false}
          className="mb-4 bg-gray-100 rounded-md p-2 h-[60px]"
          style={{ borderWidth: 1, borderColor: "#C4CCF0", borderRadius: 8 }}
        />
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Truck Plate Number</Text>
        <TextInput
          value={truckPlateNumber}
          editable={false}
          className="mb-4 bg-gray-100 rounded-md p-2 h-[60px]"
          style={{ borderWidth: 1, borderColor: "#C4CCF0", borderRadius: 8 }}
        />
      </View>

      <View>
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
      {errors.trip_id && <Text className="mb-2 text-red-500">{errors.trip_id}</Text>}
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
        selectedValue={formData.trip_id}
        onValueChange={(value) => setFormData({ ...formData, trip_id: value })}
        style={{ color: "#000" }} // Customize as needed
      >
        <Picker.Item label="Select Trip" value="" />
        {trips.map((trip, index) => (
          <Picker.Item key={index} label={trip.label} value={trip.value} />
        ))}
      </Picker>
    </View>
  </View>
</View>

      

{/* 
        <View>
  <Text className="text-gray-600 mb-[10px]">Fueling?</Text>
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
      selectedValue={formData.fuelling}
      onValueChange={(value) => {
        setFormData({ ...formData, fuelling: value });
        // setIsFuelling(value);
      }}
      style={{ color: "#000" }} // Customize as needed
    >
      <Picker.Item label="Select Fueling Option" value={null} />
      <Picker.Item label="No" value="0" />
      <Picker.Item label="Yes" value="1" />
    </Picker>
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
    </ScrollView>
  );
};

export default AssignTruckDriverScreen;
