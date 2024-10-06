// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useMutation } from '@tanstack/react-query';
// import * as ImagePicker from 'expo-image-picker';
// import Camera from "@/assets/svgs/Camera.svg";
// import API from '@/src/services/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { z } from 'zod';



// // Define the validation schema using Zod
// const offloadingSchema = z.object({
//   offloading_qty: z.string().nonempty("Tonnage Offloaded is required").regex(/^[0-9]*$/, "Must be a valid number"),
//   waybill_no: z.string().nonempty("Waybill Number is required"),
//   odometer_reading: z.string().nonempty("Odometer Reading is required").regex(/^[0-9]*$/, "Must be a valid number"),
//   remarks: z.string().optional(),
//   product_picture: z.string().nonempty("Product picture is required"),
//   delivery_location:z.string().nonempty("Delivery location required")
// });

// const OffloadingPointScreen = () => {
//   const { tripId } = useLocalSearchParams();
//   const router = useRouter();

//   const [focusedField, setFocusedField] = useState(null);
//   const [formData, setFormData] = useState({
//     trip_id: tripId,
//     offloading_qty: '',
//     waybill_no: '',
//     odometer_reading: '',
//     product_picture: '',
//     delivery_location:"",
//     delivery_time:new Date(),
//     remarks: '',
//     dataname: 'driverOffloadingPoint',
//   });
//   const [image, setImage] = useState(null);
//   const [formErrors, setFormErrors] = useState({}); // State to hold form errors

//   const submitOffloadingData = async (data) => {
//     const userId = await AsyncStorage.getItem("user_id")
//     const response = await API.post("trip/trip.php", 
//     {
//       dataname: "driverOffloadingPoint",
//       driver_id: userId,
//       ...data
//     });
//     return response.data;
//   };

//   const mutation = useMutation({
//     mutationFn: submitOffloadingData,
//     onSuccess: () => {
//       Alert.alert("Success", "Offloading point data submitted");
//       // You might want to navigate to a confirmation screen or back to the main screen
//       // router.push("/screens/truckDriver/confirmationScreen");
//     },
//     onError: (error) => {
//       const errorMessage = error.response?.data?.message || "An unknown error occurred";
//       console.error('Error submitting data:', error);
//       Alert.alert("Error", `${errorMessage}`);
//     },
//   });

//   const handleInputChange = (name, value) => {
//     setFormData(prevData => ({ ...prevData, [name]: value }));
//   };

//   const handleImagePick = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//       base64: true,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setFormData(prevData => ({ ...prevData, product_picture: result.assets[0].base64 }));
//     }
//   };

//   const handleSubmit = async () => {
//     // Validate the form data using Zod
//     try {
//       // Clear previous errors
//       setFormErrors({});
      
//       // Validate and parse the data
//       offloadingSchema.parse(formData);
      
//       // If validation passes, submit the data
//       mutation.mutate(formData);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         // Set form errors based on Zod validation
//         const errors = {};
//         error.errors.forEach(err => {
//           errors[err.path[0]] = err.message;
//         });
//         setFormErrors(errors);
//       }
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
//       {[
//         { label: 'Delivery Location', name: 'delivery_location', placeholder: 'Enter Delivery Location', error: formErrors.delivery_location },
//         { label: 'Tonnage Offloaded', name: 'offloading_qty', placeholder: 'Enter tonnage offloaded', error: formErrors.offloading_qty },
//         { label: 'Waybill Number', name: 'waybill_no', placeholder: 'Enter waybill number', error: formErrors.waybill_no },
//         { label: 'Odometer Reading', name: 'odometer_reading', placeholder: 'Enter odometer reading', error: formErrors.odometer_reading },
//         { label: 'Remarks', name: 'remarks', placeholder: 'Enter remarks', error: formErrors.remarks },
//       ].map((item, index) => (
//         <View key={index} className="mb-4">
//           <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
//           <TextInput
//            onFocus={() => setFocusedField(item.name)}
//            onBlur={() => setFocusedField(null)}
//            className={`border bg-white rounded-md p-2 h-[60px] ${
//              focusedField === item.name
//                ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
//                : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
//            }`}
//             // className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border border-[#C4CCF0] rounded-md p-2 h-[60px]"
//             placeholder={item.placeholder}
//             value={formData[item.name]}
//             onChangeText={(text) => handleInputChange(item.name, text)}
//           />
//           {item.error && <Text className="text-red-500 text-sm">{item.error}</Text>}
//         </View>
//       ))}

//       <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 ">
//         Note: Capture the following information: Current Odometer reading, Material and Waybill.
//       </Text>

//       <TouchableOpacity className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4" onPress={handleImagePick}>
//         <View className='flex flex-col items-center'>
//           {image ? (
//             <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
//           ) : (
//             <>
//               <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>
//                 <Camera className="w-6 h-6 text-blue-600 mr-2" />
//               </View>
//               <Text className="font-semibold">Take a Snap</Text>
//               <Text className="text-center text-gray-500 text-sm mt-2">
//                 Note: You can take a snap or record a video.
//               </Text>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         className="bg-[#394F91] rounded-2xl p-4 mt-6" 
//         onPress={handleSubmit}
//         disabled={mutation.isPending}
//       >
//         <Text className="text-white text-center font-semibold">
//           {mutation.isPending ? 'Submitting...' : 'Request to Close Trip'}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default OffloadingPointScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import Camera from "@/assets/svgs/Camera.svg";
import API from '@/src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

// Define the validation schema using Zod
const offloadingSchema = z.object({
  offloading_qty: z.string().nonempty("Tonnage Offloaded is required").regex(/^[0-9]*$/, "Must be a valid number"),
  waybill_no: z.string().nonempty("Waybill Number is required"),
  odometer_reading: z.string().nonempty("Odometer Reading is required").regex(/^[0-9]*$/, "Must be a valid number"),
  remarks: z.string().optional(),
  product_picture: z.string().nonempty("Product picture is required"),
  delivery_location: z.string().nonempty("Delivery location required"),
  // delivery_time: z.date().refine((date) => date > new Date(), "Delivery time must be in the future")
});

const OffloadingPointScreen = () => {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();

  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    trip_id: tripId,
    offloading_qty: '',
    waybill_no: '',
    odometer_reading: '',
    product_picture: '',
    delivery_location: "",
    delivery_time: new Date(),
    remarks: '',
    dataname: 'driverOffloadingPoint',
  });
  const [image, setImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false);

  const submitOffloadingData = async (data) => {
    const userId = await AsyncStorage.getItem("user_id");
    const response = await API.post("trip/trip.php", 
    {
      dataname: "driverOffloadingPoint",
      driver_id: userId,
      ...data,
      delivery_time: dayjs(data.delivery_time).format("YYYY-MM-DD HH:mm:ss")
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitOffloadingData,
    onSuccess: () => {
      Alert.alert("Success", "Offloading point data submitted");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "An unknown error occurred";
      console.error('Error submitting data:', error);
      Alert.alert("Error", `${errorMessage}`);
    },
  });

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFormData(prevData => ({ ...prevData, product_picture: result.assets[0].base64 }));
    }
  };

  const handleDeliveryTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.delivery_time;
    setShowDeliveryTimePicker(false);
    setFormData(prevData => ({ ...prevData, delivery_time: currentDate }));
  };

  const handleSubmit = async () => {
    try {
      setFormErrors({});
      offloadingSchema.parse(formData);
      mutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach(err => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
      {[
        { label: 'Delivery Location', name: 'delivery_location', placeholder: 'Enter Delivery Location', error: formErrors.delivery_location },
        { label: 'Tonnage Offloaded', name: 'offloading_qty', placeholder: 'Enter tonnage offloaded', error: formErrors.offloading_qty },
        { label: 'Waybill Number', name: 'waybill_no', placeholder: 'Enter waybill number', error: formErrors.waybill_no },
        { label: 'Odometer Reading', name: 'odometer_reading', placeholder: 'Enter odometer reading', error: formErrors.odometer_reading },
        { label: 'Remarks', name: 'remarks', placeholder: 'Enter remarks', error: formErrors.remarks },
      ].map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
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
          />
          {item.error && <Text className="text-red-500 text-sm">{item.error}</Text>}
        </View>
      ))}

      <View className="mb-4">
        <Text className="text-gray-600 mb-[10px]">Delivery Time</Text>
        <TouchableOpacity
          onPress={() => setShowDeliveryTimePicker(true)}
          className={`border bg-white rounded-md p-2 h-[60px] justify-center ${
            focusedField === 'delivery_time'
              ? "border-[#394F91] shadow-[0px 0px 0px 4px rgba(57,79,145,0.1)]"
              : "border-[#C4CCF0] shadow-[0px 1px 2px rgba(16,24,40,0.05)]"
          }`}
        >
          <Text>{dayjs(formData.delivery_time).format("LL")}</Text>
        </TouchableOpacity>
        {formErrors.delivery_time && <Text className="text-red-500 text-sm">{formErrors.delivery_time}</Text>}
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

      <Text className="text-red-500 text-sm mt-4 bg-[#FFE8E8] py-3 px-2 ">
        Note: Capture the following information: Current Odometer reading, Material and Waybill.
      </Text>

      <TouchableOpacity className="flex-row items-center justify-center bg-white border h-[126px] border-gray-300 rounded-md p-4 mt-4" onPress={handleImagePick}>
        <View className='flex flex-col items-center'>
          {image ? (
            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
          ) : (
            <>
              <View className='h-[35px] w-[35px] items-center justify-center p-2 bg-[#394F91] rounded-full'>
                <Camera className="w-6 h-6 text-blue-600 mr-2" />
              </View>
              <Text className="font-semibold">Take a Snap</Text>
              <Text className="text-center text-gray-500 text-sm mt-2">
                Note: You can take a snap or record a video.
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-[#394F91] rounded-2xl p-4 mt-6" 
        onPress={handleSubmit}
        disabled={mutation.isPending}
      >
        <Text className="text-white text-center font-semibold">
          {mutation.isPending ? 'Submitting...' : 'Request to Close Trip'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OffloadingPointScreen;