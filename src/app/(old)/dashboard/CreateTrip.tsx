import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Alert,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RNPickerSelect from "react-native-picker-select";
import API from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { router } from "expo-router";

const tripSchema = z.object({
  loadingPoint: z.string().min(1, "Loading point is required"),
  offloadingPoint: z.string().min(1, "Offloading point is required"),
  customerId: z.string().min(1, "Customer is required"),
  departureTime: z.date(),
  loadQuantity: z.string().min(1, "Load Quantity is required"),
  producttype_id: z.number().min(1, "Product Type is required"),
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
    defaultValues: {
      departureTime: new Date(), // Set a default value for departureTime
    },
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");
        const response = await API.post("admin/admin.php", {
          user_id,
          dataname: "getUsers",
        });
        const filteredUsers = response.data.users.filter((user) =>
          user.api_role.includes("Customer")
        );
        console.log(filteredUsers);
        
        setCustomers(filteredUsers);
      } catch (error) {
        console.error("API request error", error);
      }
    };

    fetchCustomerData();
  }, []);

  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await API.post("trip/trip.php", {
          dataname: "getProductTypes",
        });
        console.log(response.data.data);
        
        setProducts(response.data.data);
      } catch (error) {
        console.error("API request error", error);
      }
    };

    fetchProductType();
  }, []);

  const handleTripSubmit: SubmitHandler<TripFormData> = async (data: TripFormData) => {
    console.log("Form data:", data);
    
    try {
      const user_id = await AsyncStorage.getItem("user_id");
  
      const formattedData = {
        loading_point: data.loadingPoint,
        offloading_point: data.offloadingPoint,
        customer_id: data.customerId,
        loading_qty: data.loadQuantity,
        user_id,
        producttype_id: data.producttype_id,
        dataname: "createTrip",
        schedule_time: dayjs(data.departureTime).format("YYYY-MM-DD HH:mm:ss"),
      };
  
      console.log("Formatted Data being sent:", formattedData);
  
      const response = await API.post("trip/trip.php", formattedData);
  
      console.log("API Response:", response.data);
  
      if (response.status === 201) {
        Alert.alert(
          "Trip Created",
          "Your trip details have been successfully submitted!"
        );
        router.push("/dashboard/AssignTruck");
      } else {      
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
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
        }}
        style={{ width: "100%" }}
      >
        <View style={{
          width: "90%",
          backgroundColor: "white",
          padding: 16,
          borderRadius: 8,
        }}>
          <Controller
            control={control}
            name="loadingPoint"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Loading Point"
                placeholder="Loading Point"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.loadingPoint?.message}
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            control={control}
            name="offloadingPoint"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Offloading Point"
                placeholder="Offloading Point"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.offloadingPoint?.message}
                style={{ marginBottom: 16 }}
                 className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white  border-[#C4CCF0] rounded-md p-2 h-[60px]"
              />
            )}
          />

          <Text className="text-base font-semibold mb-2">Customer</Text>
          <Controller
            control={control}
            name="customerId"
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                placeholder={{ label: "Select Customer", value: null }}
                value={value}
                onValueChange={onChange}
                items={customers.map((customer) => ({
                  label: `${customer.username} ${customer.first_name}`,
                  value: customer.user_id,
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
                  inputAndroid:{
                    width: "100%",
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }
                }}
              />
            )}
          />

          <Text className="text-base font-semibold mb-2">Schedule</Text>
          <Controller
            control={control}
            name="departureTime"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 16 }}>
                <Button
                  label={<Text style={{ color: "#000" }}>{dayjs(value).format("YYYY-MM-DD HH:mm:ss")}</Text>}
                  onPress={() => setShowDatePicker(true)}
                  className="border"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#D1D5DB",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                  }}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="datetime"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === "ios");
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
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
                errorMessage={errors.loadQuantity?.message}
                style={{ marginBottom: 16 }}
              />
            )}
          />

          <Text className="text-base font-semibold mb-2">Product Type</Text>
          <Controller
            control={control}
            name="producttype_id"
            render={({ field: { onChange, value } }) => (
              <RNPickerSelect
                placeholder={{ label: "Select Product", value: null }}
                value={value}
                onValueChange={onChange}
                items={products.map((product) => ({
                  label: `${product.name} `,
                  value: product.id,
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
                  inputAndroid:{
                    width: "100%",
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                  }
                }}
              />
            )}
          />
        </View>

        <Button
          label="Create Trip"
          style={{ width: "90%", marginTop: 16, backgroundColor: "#3A5092" }}
          onPress={handleSubmit(handleTripSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTrip;