// import React from "react";
// import { SafeAreaView, View, ScrollView, Alert } from "react-native";
// import { Controller, useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/Input";
// import { Button } from "@/components/Button";
// import { ImageUploader } from "@/components/ImageUploader";
// import API from "@/src/services/api";

// const formSchema = z.object({
//   trip_id: z.string().min(1, "Trip ID is required"),
//   current_location: z.string().min(1, "Current Location is required"),
//   mileage_before: z.number().min(0, "Mileage before must be positive"),
//   mileage_after: z.number().min(0, "Mileage after must be positive"),
//   liter_before: z.number().min(0, "Litres before must be positive"),
//   liter_after: z.number().min(0, "Litres after must be positive"),
//   amount_per_liter: z.number().min(0, "Amount per litre must be positive"),
//   total_amount: z.number().min(0, "Total amount must be positive"),
//   odometer_before: z.number().min(0, "Odometer before must be positive"),
//   odometer_after: z.number().min(0, "Odometer after must be positive"),
//   pump_reading_before: z.number().min(0, "Pump reading before must be positive"),
//   pump_reading_after: z.number().min(0, "Pump reading after must be positive"),
//   attendant_name: z.string().min(1, "Attendant name is required"),
//   attendant_picture: z.string().optional(),
//   truck_tank_picture: z.string().optional(),
//   gauge_pump_picture: z.string().optional(),
//   driver_picture: z.string().optional(),
// });

// type FormData = z.infer<typeof formSchema>;

// const FuelManagementForm = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       trip_id: "",
//       current_location: "",
//       mileage_before: 0,
//       mileage_after: 0,
//       liter_before: 0,
//       liter_after: 0,
//       amount_per_liter: 0,
//       total_amount: 0,
//       odometer_before: 0,
//       odometer_after: 0,
//       pump_reading_before: 0,
//       pump_reading_after: 0,
//       attendant_name: "",
//     },
//   });

//   const onSubmit = async (data: FormData) => {
//     // console.log("Form data:", data);
//     try {
//       // Create an object to hold all the form data
//       const requestBody: any = {
//         dataname: "makeFuelEntry", // Include the required dataname field
//         formData: {} // This will hold all the form fields
//       };

//       // Populate the formData object
//       Object.entries(data).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           if (typeof value === 'number') {
//             requestBody.formData[key] = value;
//           } else if (typeof value === 'string') {
//             if (key.includes('picture') && value) {
//               // For image fields, we'll need to handle them differently
//               // You might need to upload images separately or encode them
//               requestBody.formData[key] = value; // This might need to be adjusted based on your API requirements
//             } else {
//               requestBody.formData[key] = value;
//             }
//           }
//         }
//       });

//       // console.log("Request body:", requestBody);

//       const response = await API.post("trip/trip.php", requestBody, {
//         headers: {
//           "Content-Type": "application/json", // Changed to JSON since we're sending a JSON object
//         },
//       });
//       console.log(response);
      

//       // if (response.status === 200) {
//       //   console.log("Success:", response.data);
//       //   Alert.alert("Success", "Form submitted successfully");
//       // } else {
//       //   console.error("Error:", response.data);
//       //   Alert.alert("Error", "Failed to submit the form");
//       // }
//     } catch (error) {
//       // console.error("Submission error:", error);
//       Alert.alert("Error", "An error occurred during submission");
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 items-center justify-center">
//       <ScrollView
//         className="w-full"
//         contentContainerStyle={{
//           alignItems: "center",
//           paddingVertical: 20,
//           paddingHorizontal: 0,
//         }}
//       >
//         <View className="w-[90%] bg-white p-4 rounded-xl">
//           {/* Input fields */}
//           {Object.keys(formSchema.shape).map((fieldName) => (
//             <Controller
//               key={fieldName}
//               control={control}
//               name={fieldName as keyof FormData}
//               render={({ field: { onChange, onBlur, value } }) => (
//                 fieldName.includes('picture') ? (
//                   <ImageUploader
//                     label={`Upload ${fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
//                     onImageSelected={(uri) => onChange(uri)}
//                     errorMessage={errors[fieldName as keyof FormData]?.message}
//                   />
//                 ) : (
//                   <Input
//                     label={fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                     placeholder={`Enter ${fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
//                     onBlur={onBlur}
//                     onChangeText={(text) => onChange(fieldName.includes('_before') || fieldName.includes('_after') || fieldName === 'amount_per_liter' || fieldName === 'total_amount' ? parseFloat(text) : text)}
//                     value={value?.toString()}
//                     errorMessage={errors[fieldName as keyof FormData]?.message}
//                     keyboardType={fieldName.includes('_before') || fieldName.includes('_after') || fieldName === 'amount_per_liter' || fieldName === 'total_amount' ? 'numeric' : 'default'}
//                   />
//                 )
//               )}
//             />
//           ))}
//         </View>

//         <Button
//           label="Submit"
//           className="my-4 bg-[#3A5092] w-[90%]"
//           onPress={handleSubmit(onSubmit)}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default FuelManagementForm;

import React from "react";
import { SafeAreaView, View, ScrollView, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ImageUploader } from "@/components/ImageUploader";
import API from "@/src/services/api";

const formSchema = z.object({
  trip_id: z.string().min(1, "Trip ID is required"),
  current_location: z.string().min(1, "Current Location is required"),
  mileage_before: z.number().min(0, "Mileage before must be positive"),
  mileage_after: z.number().min(0, "Mileage after must be positive"),
  liter_before: z.number().min(0, "Litres before must be positive"),
  liter_after: z.number().min(0, "Litres after must be positive"),
  amount_per_liter: z.number().min(0, "Amount per litre must be positive"),
  total_amount: z.number().min(0, "Total amount must be positive"),
  odometer_before: z.number().min(0, "Odometer before must be positive"),
  odometer_after: z.number().min(0, "Odometer after must be positive"),
  pump_reading_before: z.number().min(0, "Pump reading before must be positive"),
  pump_reading_after: z.number().min(0, "Pump reading after must be positive"),
  attendant_name: z.string().min(1, "Attendant name is required"),
  attendant_picture: z.any().optional(),
  truck_tank_picture: z.any().optional(),
  gauge_pump_picture: z.any().optional(),
  driver_picture: z.any().optional(),
  driver_id: z.string().min(1, "Driver ID is required"),
});

type FormData = z.infer<typeof formSchema>;

const FuelManagementForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trip_id: "",
      current_location: "",
      mileage_before: 0,
      mileage_after: 0,
      liter_before: 0,
      liter_after: 0,
      amount_per_liter: 0,
      total_amount: 0,
      odometer_before: 0,
      odometer_after: 0,
      pump_reading_before: 0,
      pump_reading_after: 0,
      attendant_name: "",
      driver_id: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    try {
      const formData = new FormData();

      // Append all non-image fields
      Object.entries(data).forEach(([key, value]) => {
        if (!key.includes('picture')) {
          if (typeof value === 'number') {
            formData.append(key, value.toFixed(2));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Append image fields
      ['attendant_picture', 'truck_tank_picture', 'gauge_pump_picture', 'driver_picture'].forEach((key) => {
        const image = data[key as keyof FormData];
        if (image) {
          formData.append(key, {
            uri: image.uri,
            type: 'image/jpeg',
            name: `${key}.jpg`,
          });
        }
      });

      // Append dataname
      formData.append('dataname', 'makeFuelEntry');

      console.log("FormData:", formData);

      const response = await API.post("trip/trip.php", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      

      if (response.status === 200) {
        console.log("Success:", response.data);
        Alert.alert("Success", "Form submitted successfully");
      } else {
        console.error("Error:", response.data);
        Alert.alert("Error", "Failed to submit the form");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "An error occurred during submission");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ScrollView
        className="w-full"
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
        }}
      >
        <View className="w-[90%] bg-white p-4 rounded-xl">
          {Object.keys(formSchema.shape).map((fieldName) => (
            <Controller
              key={fieldName}
              control={control}
              name={fieldName as keyof FormData}
              render={({ field: { onChange, onBlur, value } }) => (
                fieldName.includes('picture') ? (
                  <ImageUploader
                    label={`Upload ${fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                    onImageSelected={(imageData) => onChange(imageData)}
                    errorMessage={errors[fieldName as keyof FormData]?.message}
                  />
                ) : (
                  <Input
                    label={fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    placeholder={`Enter ${fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(fieldName.includes('_before') || fieldName.includes('_after') || fieldName === 'amount_per_liter' || fieldName === 'total_amount' ? parseFloat(text) : text)}
                    value={value?.toString()}
                    errorMessage={errors[fieldName as keyof FormData]?.message}
                    keyboardType={fieldName.includes('_before') || fieldName.includes('_after') || fieldName === 'amount_per_liter' || fieldName === 'total_amount' ? 'numeric' : 'default'}
                  />
                )
              )}
            />
          ))}
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

export default FuelManagementForm;