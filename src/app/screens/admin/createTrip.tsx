import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image
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
import SuccessIcon from "@/assets/images/success.png"

const CreateTripForm = () => {
  const [activeTab, setActiveTab] = useState("tripInfo");

  const [formData, setFormData] = useState({
    producttype_id: "",
    loading_point: "",
    offloading_point: "",
    customer_id: "",
    is_customer_confirmation_required: "0",
    loading_qty: "",
    start_date: new Date(),
    end_date: new Date(),
    user_id: "fma1000",
  });

  const [loadingPoints, setLoadingPoints] = useState([]);
  const [offloadingPoints, setOffloadingPoints] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const loadingPointsData = await getLoadingPoint();
      const offloadingPointsData = await getLoadingPoint();
      const productTypesData = await getProductType();
      const customersData = await getCustomers();
      AsyncStorage.getItem("user_id");
      setLoadingPoints(loadingPointsData);
      setOffloadingPoints(offloadingPointsData);
      setProductTypes(productTypesData);
      setCustomers(customersData);
    };

    fetchData();
  }, []);
  const createTripMutation = useMutation({
    mutationFn: (newTrip) =>
      API.post("trip/trip.php", { ...newTrip, dataname: "createTrip" }),
    onSuccess: (data) => {
      console.log("Trip created successfully", data);
      setModalVisible(true);
      // Handle success (e.g., show a success message, navigate to another screen)
      // QueryClient.invalidateQueries('trips'); // Assuming you have a 'trips' query to refetch
      router.navigate("/screens/admin/AssignTruckDriver");
    },
    onError: (error) => {
      console.error("Error creating trip", error);
      // Handle error (e.g., show an error message)
      
      // router.navigate("/screens/admin/AssignTruckDriver");
    },
  });

  const handleSubmit = () => {
    const tripData = {
      ...formData,
      // start_date: formData.start_date.toISOString().slice(0, 19).replace('T', ' '),
      // end_date: formData.end_date.toISOString().slice(0, 19).replace('T', ' '),
      start_date: dayjs(formData.start_date).format("YYYY-MM-DD HH:mm:ss"),
      end_date: dayjs(formData.end_date).format("YYYY-MM-DD HH:mm:ss"),
      loading_qty: parseInt(formData.loading_qty, 10),
    };
    createTripMutation.mutate(tripData);
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
        <Text className="text-gray-600 mb-[10px]">Product Type</Text>
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
            selectedValue={formData.producttype_id}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, producttype_id: itemValue })
            }
          >
            <Picker.Item label="Select Product Type" value="" />
            {productTypes?.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Loading Point</Text>
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
            selectedValue={formData.loading_point}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, loading_point: itemValue })
            }
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
        <Text className="text-gray-600 mb-[10px]">Offloading Point</Text>
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
        <Text className="text-gray-600 mb-[10px]">Customer</Text>
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
            <Picker.Item label="Customer Confirmation Not Required" value="0" />
          </Picker>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-[10px]">Loading Quantity</Text>
        <TextInput
          placeholder="Loading Quantity"
          keyboardType="numeric"
          value={formData.loading_qty}
          onChangeText={(text) =>
            setFormData({ ...formData, loading_qty: text })
          }
          className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white  border-[#C4CCF0] rounded-md p-2 h-[60px]"
        />
      </View>

      <Text className="text-gray-600 mb-[10px]">Start Date </Text>
      <View style={{ marginBottom: 16 }}>
        <Button
          label={
            <Text style={{ color: "#000" }}>
              {dayjs(formData.start_date).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          }
          onPress={() => setShowStartDate(true)}
          className="border"
          style={{
            backgroundColor: "#fff",
            borderColor: "#D1D5DB",
            paddingVertical: 10,
            paddingHorizontal: 16,
          }}
        />
      </View>
      {showStartDate && (
        <DateTimePicker
          value={formData.start_date}
          mode="datetime"
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
              {dayjs(formData.end_date).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          }
          onPress={() => setShowEndDate(true)}
          className="border text-left"
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
          mode="datetime"
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
        <Text className="text-white text-center font-semibold">
          Create Trip
        </Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView} className="flex gap-4  ">
            <View style={styles.modalView} >          
            <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
              <Image source={SuccessIcon}/>
            </View>
            <Text className="font-semibold text-center text-xl  text-[#394F91]">Assignment Successful 🚀</Text>
            <Text className="text-primary">
              You have successfully assigned a truck driver to the trip
            </Text>
            <TouchableOpacity
              className="bg-[#394F91] p-4  rounded-lg mb-4"
              onPress={() =>  setModalVisible(!modalVisible)}
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
            </View>
          </View>
          
        </Modal>
    </>
       )
  };

  const renderAssignDriverToTrip = () => (
    <>
      <AssignTruckDriverScreen />
    </>
  )

  const renderAssignVendorToTrip = () => (
    <>
      <AssignVendorScreen />
    </>
  )

  return (
    <ScrollView className="flex-1">
      <View style={styles.container}>
        {/* Step Indicator */}
        {/* <View className="flex-row justify-between items-center mb-4">
        <View className="items-center">
          <View className="w-6 h-6 bg-[#394F91] rounded-full justify-center items-center">
            <Tick />
          </View>
          <Text className="text-sm font-semibold mt-1 text-[#394F91]">
            Trip Information
          </Text>
          <Text className="text-xs text-gray-400">Setup Trip Information</Text>
        </View>
        <View className="h-1 bg-gray-200 flex-1 mx-2" />
        <View className="items-center">
          <View className="w-6 h-6 bg-gray-200 rounded-full" />
          <Text className="text-sm font-semibold mt-1 text-gray-400">
            Assign Truck/Drivers
          </Text>
          <Text className="text-xs text-gray-400">Setup Fuel Information</Text>
        </View>
      </View> */}

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
        </View>

        {/* Render content based on active tab */}
        {activeTab === "tripInfo" && renderTripInformation()}
        {activeTab === "assignTruckDriver" && renderAssignDriverToTrip()}
        {activeTab === "assignVendor" &&  renderAssignVendorToTrip()}
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateTripForm;

// import React from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import Camera from "@/assets/svgs/Camera.svg";
// import { useRouter } from "expo-router";
// import Tick from "@/assets/svgs/tick.svg";
// import RNPickerSelect from "react-native-picker-select";
// import { useQuery } from "@tanstack/react-query";
// import { getCustomers, getLoadingPoint, getProductType } from "@/src/services/other";

// const CreateTripScreen = () => {
//   const router = useRouter();

//   const handlePress = (path) => {
//     router.push(path);
//   };

//   const { data: customers } = useQuery({
//     queryKey: ["customers"],
//     queryFn: getCustomers,
//   });

//   const { data: terminalPoint } = useQuery({
//     queryKey: ["loading_offloading_point"],
//     queryFn: getProductType,
//   });

//   const { data: products } = useQuery({
//     queryKey: ["products"],
//     queryFn: getLoadingPoint,
//   });

//   return (
//     <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
//       {/* Step Indicator */}
//       <View className="flex-row justify-between items-center mb-4">
//         <View className="items-center">
//           <View className="w-6 h-6 bg-[#394F91] rounded-full justify-center items-center">
//             <Tick />
//           </View>
//           <Text className="text-sm font-semibold mt-1 text-[#394F91]">
//             Trip Information
//           </Text>
//           <Text className="text-xs text-gray-400">Setup Trip Information</Text>
//         </View>
//         <View className="h-1 bg-gray-200 flex-1 mx-2" />
//         <View className="items-center">
//           <View className="w-6 h-6 bg-gray-200 rounded-full" />
//           <Text className="text-sm font-semibold mt-1 text-gray-400">
//             Assign Truck/Drivers
//           </Text>
//           <Text className="text-xs text-gray-400">Setup Fuel Information</Text>
//         </View>
//       </View>

//       <View>
//         <Text className="text-gray-600 mb-[10px]">Customer</Text>
//         <View
//           className="mb-4"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//           <RNPickerSelect
//             placeholder={{ label: "Select Customer", value: null }}
//             style={{
//               inputAndroid: {
//                 fontSize: 9,
//                 color: "black",
//                 backgroundColor: "white",
//                 paddingRight: 30, // To ensure the text is never behind the icon
//               },
//               inputIOS: {
//                 fontSize: 9,
//                 color: "black",
//                 paddingRight: 30, // To ensure the text is never behind the icon
//               },
//             }}
//             onValueChange={(value) => console.log(value)}
//             items={[
//               { label: "Football", value: "football" },
//               { label: "Baseball", value: "baseball" },
//               { label: "Hockey", value: "hockey" },
//             ]}
//           />
//         </View>
//       </View>

//       <View>
//       <Text className="text-gray-600 mb-[10px]">Product Type</Text>
//         <View
//           className="mb-4"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//         <RNPickerSelect
//           placeholder={{ label: "Select Product", value: null }}
//           style={{
//             inputAndroid: {
//               fontSize: 9,
//               color: "black",
//               backgroundColor: "white",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//             inputIOS: {
//               fontSize: 9,
//               color: "black",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//           }}
//           onValueChange={(value) => console.log(value)}
//           items={[
//             { label: "Football", value: "football" },
//             { label: "Baseball", value: "baseball" },
//             { label: "Hockey", value: "hockey" },
//           ]}
//         />
//         </View>
//       </View>

//       <View>
//       <Text className="text-gray-600 mb-[10px]">Loading Point</Text>
//         <View
//           className="mb-4"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//         <RNPickerSelect
//           placeholder={{ label: "Select Loading Point", value: null }}
//           style={{
//             inputAndroid: {
//               fontSize: 9,
//               color: "black",
//               backgroundColor: "white",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//             inputIOS: {
//               fontSize: 9,
//               color: "black",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//           }}
//           onValueChange={(value) => console.log(value)}
//           items={[
//             { label: "Football", value: "football" },
//             { label: "Baseball", value: "baseball" },
//             { label: "Hockey", value: "hockey" },
//           ]}
//         />
//         </View>
//       </View>

//       <View>
//       <Text className="text-gray-600 mb-[10px]">OffLoading Point</Text>
//         <View
//           className="mb-4"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//         <RNPickerSelect
//           placeholder={{ label: "Select OffLoading Point", value: null }}
//           style={{
//             inputAndroid: {
//               fontSize: 9,
//               color: "black",
//               backgroundColor: "white",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//             inputIOS: {
//               fontSize: 9,
//               color: "black",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//           }}
//           onValueChange={(value) => console.log(value)}
//           items={[
//             { label: "Football", value: "football" },
//             { label: "Baseball", value: "baseball" },
//             { label: "Hockey", value: "hockey" },
//           ]}
//         />
//         </View>
//       </View>

//       <View>
//       <Text className="text-gray-600 mb-[10px]">Who should confirm loading?</Text>
//         <View
//           className="mb-4"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//         <RNPickerSelect
//           placeholder={{ label: "Who should confirm loading?", value: null }}
//           style={{
//             inputAndroid: {
//               fontSize: 9,
//               color: "black",
//               backgroundColor: "white",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//             inputIOS: {
//               fontSize: 9,
//               color: "black",
//               paddingRight: 30, // To ensure the text is never behind the icon
//             },
//           }}
//           onValueChange={(value) => console.log(value)}
//           items={[
//             { label: "Both", value: "1" },
//           ]}
//         />
//         </View>
//       </View>
//       {[
//         { label: "Loading Quantity", placeholder: "Enter Loading quantity" },

//         { label: "Who should confirm loading", placeholder: "Both" },
//         { label: "Start Date", placeholder: "dd/mm/yyyy" },
//         { label: "End Date", placeholder: "dd/mm/yyyy" },
//       ].map((item, index) => (
//         <View key={index} className="mb-4">
//           <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
//           <TextInput
//             className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white  border-[#C4CCF0] rounded-md p-2 h-[60px]"
//             placeholder={item.placeholder}
//             value={item.value}
//           />
//         </View>
//       ))}

//       <TouchableOpacity
//         className="bg-[#394F91] rounded-2xl p-4 mt-6"
//         onPress={() => handlePress("/screens/admin/AssignTruckDriver")}
//       >
//         <Text className="text-white text-center font-semibold">Submit</Text>
//       </TouchableOpacity>

//     </ScrollView>
//   );
// };

// export default CreateTripScreen;
