// import {
//   View,
//   SafeAreaView,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Text,
// } from "react-native";
// import React, { useState } from "react";
// import axios from "axios";
// import { Input } from "@/components/Input";
// import { Button } from "@/components/Button";
// import { z } from "zod";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Logo from "@/assets/images/icon.png";
// import { router } from "expo-router";

// const ResetPasswordSchema = z.object({
//   username: z.string().min(1, "Username is required"),
// });

// type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
// const HomePage = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(ResetPasswordSchema),
//   });

//   const handleResetPassword: SubmitHandler<ResetPasswordFormData> = async (
//     data: ResetPasswordFormData
//   ) => {
//     console.log(data);

//     try {
//       const transfromedBody = {
//         username: data.username,
//         dataname: "resetPassword",
//       };
//       const response = await axios.post(
//         "http://fmabackend.charissatics.com/api/auth/auth.php",
//         transfromedBody
//       );
//       console.log(response);

//       if (response.status === 200) {
//         Alert.alert("An Email has been sent to the associated Username!");
//         router.back();
//       } else {
//         Alert.alert("Please check your credentials.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "An error occurred while Reseting Password.");
//       console.error(error);
//     }
//   };
//   return (
//     <SafeAreaView className="flex-1 items-center justify-center ">
//       {/* <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//           > */}
//       <Image source={Logo} className="h-12 w-12 my-12" />
//       <Text>Forgot Password</Text>
//       <View className=" w-[80%]">
//         <Controller
//           control={control}
//           name="username"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <Input
//               label="Username"
//               placeholder="Enter your Username"
//               className="py-2"
//               onBlur={onBlur}
//               onChangeText={onChange}
//               value={value}
//               errorMessage={errors.username?.message as string}
//             />
//           )}
//         />
//       </View>

//       <Button
//         label="Sign In"
//         className="w-[80%] my-4 bg-[#3A5092]"
//         onPress={handleSubmit(handleResetPassword)}
//       />

//       {/* </KeyboardAvoidingView> */}
//     </SafeAreaView>
//   );
// };

// export default HomePage;


import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import Logo from "@/assets/images/Logo.png"
import { router } from 'expo-router';

const LoginPage = () => {
  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: '#F9F9F9',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
    <View className="flex-1 bg-white  px-6">
    

      <View className="mb-8 mx-auto">
        <Image
          source={Logo}
          className="w-10 h-10"
        />
      </View>

      <Text className=" text-2xl w-1/2 font-extrabold">Oops! Forget 
      </Text>
      <Text className="text-2xl text-[#394F91] font-extrabold mb-2 w-1/2">Password 😞 </Text>
      <Text className="text-[#A5A6AB] mb-8">
      Enter the email associated with your account to reset your password.
      </Text>

      {/* Login Form */}
      <View className="mb-4">
        <Text className="text-[#30333A] font-medium mb-2">Email</Text>
        <TextInput
          className="border border-gray-300  h-[60px] rounded-lg p-3"
          placeholder="Truckdriver@gmail.com"
        />
      </View>

      

     

      {/* Login Button */}
      <TouchableOpacity className="bg-[#394F91] p-4  rounded-lg mb-4" onPress={() => {
          router.navigate("/(auth)/verification-code");
        }}>
        <Text className="text-white text-center font-semibold">Reset Password</Text>
      </TouchableOpacity>

      

      {/* Sign Up Link */}
      {/* <Text className="text-center text-gray-600 mt-8">
        Don't have an account? <Text className="text-blue-600">Signup</Text>
      </Text> */}
    </View>
    </SafeAreaView>
  );
};

export default LoginPage;
