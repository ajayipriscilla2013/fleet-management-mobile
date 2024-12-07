import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  getCustomers,
  getLoadingPoint,
  getProductType,
} from "@/src/services/other";
import API from "@/src/services/api";
import Tick from "@/assets/svgs/tick.svg";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Tabs } from "expo-router";
import { Button } from "@/components/Button";
import { TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import AssignTruckDriverScreen from "./AssignTruckDriver";
import AssignVendorScreen from "./AssignVendorToTrip";
import SuccessIcon from "@/assets/images/success.png";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { z } from "zod";
import CustomModal from "@/components/CustomModal";

dayjs.extend(localizedFormat);
const tripSchema = z.object({
  producttype_id: z.number().min(1, "Product type is required"),
  loading_point: z.number().min(1, "Loading point is required"),
  offloading_point: z.number().min(1, "Offloading point is required"),
  customer_id: z.string().min(1, "Customer is required"),
  is_customer_confirmation_required: z.enum(["0", "1"]),
  loading_qty: z
    .string()
    .regex(/^\d+$/, "Loading quantity must be a number")
    .refine(
      (val) => parseInt(val, 10) > 0,
      "Loading quantity must be greater than 0"
    ),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }),
  // user_id: z.string(),
});

const CreateTripForm = () => {
  const [activeTab, setActiveTab] = useState("tripInfo");
  const [isFuelling, setIsFuelling] = useState("0");

  const [formData, setFormData] = useState({
    producttype_id: "",
    loading_point: "",
    offloading_point: "",
    customer_id: "",
    is_customer_confirmation_required: "0",
    loading_qty: "",
    start_date: new Date(),
    end_date: new Date(),
    user_id: "",
  });

  const [loadingPoints, setLoadingPoints] = useState([]);
  const [offloadingPoints, setOffloadingPoints] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [errors, setErrors] = useState({}); // To hold form errors

  useEffect(() => {
    const fetchData = async () => {
      const loadingPointsData = await getLoadingPoint();
      const offloadingPointsData = await getLoadingPoint();
      const productTypesData = await getProductType();
      const customersData = await getCustomers();
      await AsyncStorage.getItem("user_id");
      setLoadingPoints(loadingPointsData);
      setOffloadingPoints(offloadingPointsData);
      setProductTypes(productTypesData);
      setCustomers(customersData);
    };

    fetchData();
  }, []);
  const createTripMutation = useMutation({
    mutationFn: async (newTrip) => {
      const user_id = await AsyncStorage.getItem("user_id");
      API.post("trip/trip.php", {
        ...newTrip,
        user_id,
        dataname: "createTrip",
      });
    },
    onSuccess: (data) => {
      console.log("Trip created successfully", data);
      Alert.alert("Success", "Trip Created Succeefully");
      setActiveTab("assignTruckDriver");
      // setModalContent({
      //   title: " Successful 🚀",
      //   message: "Trip Creation successfull",
      //   content: (
      //     <View>
           
      //     </View>
      //   ),
      //   icon: SuccessIcon,
      //   buttonText: "Continue",
      //   buttonColor: "#394F91",
      //   titleColor: "#394F91"
      // });
      // setModalVisible(true);
      // Handle success (e.g., show a success message, navigate to another screen)
      // QueryClient.invalidateQueries('trips'); // Assuming you have a 'trips' query to refetch
    },
    onError: (error) => {
      // Check if the error response contains a message
      const errorMessage =
        error.response?.data?.message || "Request Failed, Try Again";

      console.error("Error submitting data:", errorMessage);
      Alert.alert("Error", `${errorMessage}`);
  
    },
  });

  const handleSubmit = () => {
    // Use Zod to validate the form data
    const result = tripSchema.safeParse(formData);

    if (!result.success) {
      // Collect the validation errors from Zod
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const tripData = {
      ...formData,
      // start_date: formData.start_date.toISOString().slice(0, 19).replace('T', ' '),
      // end_date: formData.end_date.toISOString().slice(0, 19).replace('T', ' '),
      start_date: dayjs(formData.start_date).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(formData.end_date).format("YYYY-MM-DD HH:mm:ss"),
      loading_qty: parseInt(formData.loading_qty, 10),
    };
    createTripMutation.mutate(tripData);
    setErrors({});
  };

  const handleAssignDriver = () => {
    // Logic to assign truck driver
    // On success, switch to the AssignVendor form
    if (isFuelling === "1") {
      setActiveTab("assignVendor");
    } else {
      // setModalVisible(true);
    }
  };

  const handleAssignVendor = () => {
    // Logic to assign vendor
    // After this, you could redirect to another screen or show success
    // setActiveTab("success");
    router.navigate("/screens/admin/createTrip");
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    const currentDate = selectedDate || formData[dateType];
    setFormData({ ...formData, [dateType]: currentDate });
    if (dateType === "start_date") {
      setShowStartDate(false);
    } else {
      setShowEndDate(false);
    }
  };

  const renderTripInformation = () => {
    return (
      <>
        <View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 mb-[10px]">Product Type</Text>
            {errors.producttype_id && (
              <Text className="mb-2" style={{ color: "red" }}>
                {errors.producttype_id}
              </Text>
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
              selectedValue={formData.producttype_id}
              onValueChange={(itemValue) => {
                setFormData({ ...formData, producttype_id: itemValue });
                setIsFocused(true); // Simulating focus when selecting an item
              }}
              onFocus={() => setIsFocused(true)} // Optionally simulate focus (not natively available in Picker)
              onBlur={() => setIsFocused(false)}
            >
              <Picker.Item label="Select Product Type" value="" />
              {productTypes?.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 mb-[10px]">Loading Point</Text>
            {errors.loading_point && (
              <Text className="mb-2" style={{ color: "red" }}>
                {errors.loading_point}
              </Text>
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
              selectedValue={formData.loading_point}
              onValueChange={(itemValue) => {
                setFormData({ ...formData, loading_point: itemValue });
                setIsFocused(true);
              }}
            >
              <Picker.Item label="Select Loading Point" value="" />
              {loadingPoints?.map((point) => (
                <Picker.Item
                  key={point.id}
                  label={point.location}
                  value={point.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 mb-[10px]">Offloading Point</Text>
            {errors.offloading_point && (
              <Text className="mb-2" style={{ color: "red" }}>
                {errors.offloading_point}
              </Text>
            )}
          </View>
          <View
            className="mb-4 bg-white"
            style={{
              borderWidth: 1,
              borderColor: "#C4CCF0",
              borderRadius: 8,
              paddingVertical: 2,
              // paddingHorizontal: 10,
            }}
          >
            <Picker
              selectedValue={formData.offloading_point}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, offloading_point: itemValue })
              }
            >
              <Picker.Item label="Select Offloading Point" value="" />
              {offloadingPoints?.map((point) => (
                <Picker.Item
                  key={point.id}
                  label={point.location}
                  value={point.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 mb-[10px]">Customer</Text>
            {errors.customer_id && (
              <Text className="mb-2" style={{ color: "red" }}>
                {errors.customer_id}
              </Text>
            )}
          </View>
          <View
            className="mb-4 bg-white"
            style={{
              borderWidth: 1,
              borderColor: "#C4CCF0",
              borderRadius: 8,
              paddingVertical: 2,
              // paddingHorizontal: 10,
            }}
          >
            <Picker
              selectedValue={formData.customer_id}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, customer_id: itemValue })
              }
            >
              <Picker.Item label="Select Customer" value="" />
              {customers?.map((customer) => (
                <Picker.Item
                  key={customer.user_id}
                  label={customer.username}
                  value={customer.user_id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View>
          <Text className="text-gray-600 mb-[10px]">
            Who should confirm loading?
          </Text>
          <View
            className="mb-4 bg-white"
            style={{
              borderWidth: 1,
              borderColor: "#C4CCF0",
              borderRadius: 8,
              paddingVertical: 2,
              // paddingHorizontal: 10,
            }}
          >
            <Picker
              selectedValue={formData.is_customer_confirmation_required}
              onValueChange={(itemValue) =>
                setFormData({
                  ...formData,
                  is_customer_confirmation_required: itemValue,
                })
              }
            >
              <Picker.Item label="Both" value="1" />
              <Picker.Item
                label="Customer Confirmation Not Required"
                value="0"
              />
            </Picker>
          </View>
        </View>

        <View className="mb-4">
          <View className="fldx-row justify-between">
            <Text className="text-gray-600 mb-[10px]">Loading Quantity</Text>
            {errors.loading_qty && (
              <Text className="mb-2" style={{ color: "red" }}>
                {errors.loading_qty}
              </Text>
            )}
          </View>
          <TextInput
            placeholder="Loading Quantity (Tons)"
            keyboardType="numeric"
            value={formData.loading_qty}
            onChangeText={(text) =>
              setFormData({ ...formData, loading_qty: text })
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`border bg-white   rounded-md p-2 h-[60px] ${
              isFocused
                ? "shadow-[0px 4px 6px rgba(238, 240, 251, 1)] border-[#C4CCF0]"
                : "border-[#D1D3D8]"
            }`}
          />
        </View>

        <Text className="text-gray-600 mb-[10px]">Start Date </Text>
        <View style={{ marginBottom: 16 }}>
          <Button
            label={
              <Text style={{ color: "#000" }}>
                {dayjs(formData.start_date).format("LL")}
              </Text>
            }
            onPress={() => setShowStartDate(true)}
            className="border h-[60px]"
            style={{
              backgroundColor: "#fff",
              borderColor: "#D1D5DB",
              // paddingVertical: 10,
              // paddingHorizontal: 16,
            }}
          />
        </View>
        {showStartDate && (
          <DateTimePicker
            value={formData.start_date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) =>
              handleDateChange(event, selectedDate, "start_date")
            }
          />
        )}

        <Text className="text-gray-600 mb-[10px]">End Date </Text>
        <View style={{ marginBottom: 16 }}>
          <Button
            label={
              <Text style={{ color: "#000" }}>
                {dayjs(formData.end_date).format("LL")}
              </Text>
            }
            onPress={() => setShowEndDate(true)}
            className="border text-left h-[60px]"
            style={{
              backgroundColor: "#fff",
              borderColor: "#D1D5DB",
              paddingVertical: 10,
              paddingHorizontal: 16,
            }}
          />
        </View>
        {showEndDate && (
          <DateTimePicker
            value={formData.end_date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) =>
              handleDateChange(event, selectedDate, "end_date")
            }
          />
        )}

        <TouchableOpacity
          className="bg-[#394F91] rounded-2xl p-4 mt-6"
          onPress={handleSubmit}
        >
          {createTripMutation.isPending ? (
            <ActivityIndicator color="#FFF" /> // Show loading spinner
          ) : (
            <Text className="text-white text-center font-semibold">
              Create Trip
            </Text>
          )}
        </TouchableOpacity>
      </>
    );
  };

  const renderAssignDriverToTrip = () => (
    <>
      <AssignTruckDriverScreen
        setIsFuelling={setIsFuelling}
        onAssignDriver={handleAssignDriver}
      />
    </>
  );

  const renderAssignVendorToTrip = () => (
    <>
      <AssignVendorScreen onAssignVendor={handleAssignVendor} />
    </>
  );

  return (
    <ScrollView className="flex-1">
      <View style={styles.container}>
        {/* Tab Navigation */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            className="items-center"
            onPress={() => setActiveTab("tripInfo")}
          >
            <View
              className={`w-6 h-6 ${
                activeTab === "tripInfo" ? "bg-[#394F91]" : "bg-gray-200"
              } rounded-full justify-center items-center`}
            >
              {activeTab === "tripInfo" && <Tick />}
            </View>
            <Text
              className={`text-sm font-semibold mt-1 ${
                activeTab === "tripInfo" ? "text-[#394F91]" : "text-gray-400"
              }`}
            >
              Trip Information
            </Text>
            <Text className="text-xs text-gray-400">
              Setup Trip Information
            </Text>
          </TouchableOpacity>
          <View className="h-1 bg-gray-200 flex-1 mx-2" />
          <TouchableOpacity
            className="items-center"
            onPress={() => setActiveTab("assignTruckDriver")}
          >
            <View
              className={`w-6 h-6 ${
                activeTab === "assignTruckDriver"
                  ? "bg-[#394F91]"
                  : "bg-gray-200"
              } rounded-full justify-center items-center`}
            >
              {activeTab === "assignTruckDriver" && <Tick />}
            </View>
            <Text
              className={`text-sm font-semibold mt-1 ${
                activeTab === "assignTruckDriver"
                  ? "text-[#394F91]"
                  : "text-gray-400"
              }`}
            >
              Assign Truck/Drivers
            </Text>
            <Text className="text-xs text-gray-400">
              Setup Fuel Information
            </Text>
          </TouchableOpacity>
         

          {isFuelling === "1" && (
            <>
             <View className="h-1 bg-gray-200 flex-1 mx-2" />
              <View className="h-1 bg-gray-200 flex-1 mx-2" />
              <TouchableOpacity
                className="items-center"
                onPress={() => setActiveTab("assignVendor")}
              >
                <View
                  className={`w-6 h-6 ${
                    activeTab === "assignVendor"
                      ? "bg-[#394F91]"
                      : "bg-gray-200"
                  } rounded-full justify-center items-center`}
                >
                  {activeTab === "assignVendor" && <Tick />}
                </View>
                <Text
                  className={`text-sm font-semibold mt-1 ${
                    activeTab === "assignVendor"
                      ? "text-[#394F91]"
                      : "text-gray-400"
                  }`}
                >
                  Assign Vendor
                </Text>
                <Text className="text-xs text-gray-400">
                  Setup Vendor Details
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Render content based on active tab */}
        {activeTab === "tripInfo" && renderTripInformation()}
        {activeTab === "assignTruckDriver" && renderAssignDriverToTrip()}
        {activeTab === "assignVendor" &&
          isFuelling === "1" &&
          renderAssignVendorToTrip()}
        {/* Success Screen */}
        {activeTab === "success" && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView} className="flex gap-4  ">
              <View style={styles.modalView}>
                <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
                  <Image source={SuccessIcon} />
                </View>
                <Text className="font-semibold text-center text-xl  text-[#394F91]">
                  Assignment Successful 🚀
                </Text>
                <Text className="text-primary">
                  Trip and assignments were successful!
                </Text>
                <TouchableOpacity
                  className="bg-[#394F91] p-4  rounded-lg mb-4"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white text-center font-semibold">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        {...modalContent}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateTripForm;
