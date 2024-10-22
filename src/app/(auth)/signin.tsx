// import {
//   View,
//   SafeAreaView,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   TextInput,
//   Text,
//   TouchableOpacity,
//   ScrollView, // Added ScrollView to handle long forms
// } from "react-native";
// import React, { useState } from "react";
// import axios from "axios";
// import { Badge } from "@/components/Badge";
// import { Input } from "@/components/Input";
// import { Button } from "@/components/Button";
// import { z } from "zod";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { router } from "expo-router";
// import { Link } from "expo-router";
// import api from "@/src/services/api";
// import { login } from "@/src/services/api.js";
// import {
//   authenticateUser,
//   getRoleBasedRoute,
// } from "@/src/services/authService";
// import Logo from "@/assets/images/Logo.png";

// const loginSchema = z.object({
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(3, "Password must be at least 3 characters long"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// const LoginPage = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
//     console.log(data);
//     const transformedBody = {
//       username: data.username,
//       password: data.password,
//       dataname: "loginUser",
//     };

//     try {
//       const response = await login(transformedBody);

//       if (response.status === 200) {
//         const { user_role } = response.data;
//         console.log("role:", user_role);
//         const route = getRoleBasedRoute(user_role);
//         console.log("route", route);

//         router.navigate(route);
//         Alert.alert("Login Successful", "You have logged in successfully!");
//       } else {
//         Alert.alert("Login Failed", "Please check your credentials.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "An error occurred while logging in.");
//       console.log(error);
//     }
//   };

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "#F9F9F9",
//         paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//       }}
//     >
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined} // Only set behavior to 'padding' on iOS
//       >
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           <View className="flex-1 p-6">
//             <View className="mb-8 mx-auto">
//               <Image source={Logo} className="w-10 h-10" />
//             </View>

//             <Text className=" text-2xl w-1/2 font-extrabold">Welcome back 👋 </Text>
//             <Text className="text-[#A5A6AB] mb-8">
//               Enter your email and password to log in
//             </Text>

//             {/* Login Form */}
//             <View className="mb-4">
//               <Controller
//                 control={control}
//                 name="username"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <Input
//                     label="Username"
//                     placeholder="Enter your Username"
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     value={value}
//                     errorMessage={errors.username?.message as string}
//                   />
//                 )}
//               />
//             </View>

//             <View className="mb-8">
//               <Controller
//                 control={control}
//                 name="password"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <Input
//                     label="Password"
//                     placeholder="********"
//                     secureTextEntry
//                     onBlur={onBlur}
//                     onChangeText={onChange}
//                     value={value}
//                     errorMessage={errors.password?.message as string}
//                   />
//                 )}
//               />
//             </View>

//             <View className="flex-row justify-between items-center mb-8">
//               <View className="flex-row items-center"></View>
//               <TouchableOpacity
//                 onPress={() => {
//                   router.navigate("/(auth)/forgot-password");
//                 }}
//               >
//                 <Text className="text-[#394F91] font-semibold">
//                   Forgot Password?
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Login Button */}
//             <TouchableOpacity
//               className="bg-[#394F91] p-4  rounded-lg mb-4"
//               onPress={handleSubmit(handleLogin)}
//             >
//               <Text className="text-white text-center font-semibold">Login</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginPage;

import {
  View,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, // For loading spinner
} from "react-native";
import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query'; // Import useMutation from react-query
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import api from "@/src/services/api";
import { login } from "@/src/services/api";
import {
  authenticateUser,
  getRoleBasedRoute,
} from "@/src/services/authService";
import Logo from "@/assets/images/Logo.png";
import { Input } from "@/components/Input"; 
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from "@/src/context/AuthContext";
import PushNotifi from "./pushtoken";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { user,loginUser  } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Using React Query's useMutation for the login API call
  const mutation = useMutation({
    mutationFn: loginUser, // `login` is the function making the API call
    onSuccess: (response) => {
      if (response.status === 200) {
        const { user_role } = response.data;
       
        const route = getRoleBasedRoute(user_role);
        router.navigate(route);
        // Alert.alert("Login Successful", "You have logged in successfully!");
      }
    },
    onError: (error: any) => {
      const serverError = error?.response?.data?.message || 'An error occurred while logging in.';
      setErrorMessage(serverError); // Set the server error message
    },
  });

  const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    const transformedBody = {
      username: data.username,
      password: data.password,
      dataname: "loginUser",
    };

    setErrorMessage(null); // Clear previous errors before new attempt
    mutation.mutate(transformedBody); // Trigger the mutation for login
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6">
            <View className="mb-8 mx-auto">
              <Image source={Logo} className="w-10 h-10" />
            </View>

            <Text className=" text-2xl w-1/2 font-extrabold">Welcome back 👋</Text>
            <Text className="text-[#A5A6AB] mb-8">
              Enter your email and password to log in
            </Text>

            {/* Login Form */}
            <View className="mb-4">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Username"
                    placeholder="Enter your Username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.username?.message as string}
                  />
                )}
              />
            </View>

            <View className="mb-8">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="">
               
                  <Input
                    label="Password"
                    placeholder="********"
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.password?.message as string}
                    style={{ flex: 1 }}
                  />
                 
                    </View>
                )}
              />
               <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)} 
                      
                      className="flex-row justify-end"
                    >
                      <Text>{showPassword ? <Feather name="eye-off" size={18} color="black" /> : <Feather name="eye" size={18} color="black" />}</Text>
                    </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <View className="flex-row justify-between items-center mb-8">
              <TouchableOpacity
                onPress={() => {
                  router.navigate("/(auth)/forgot-password");
                }}
              >
                <Text className="text-[#394F91] font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message Display */}
            {errorMessage && (
              <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
            )}

            {/* Login Button with Loading Indicator */}
            <TouchableOpacity
              className="bg-[#394F91] p-4 rounded-lg mb-4"
              onPress={handleSubmit(handleLogin)}
              disabled={mutation.isPending} // Disable button while loading
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#FFF" /> // Show loading spinner
              ) : (
                <Text className="text-white text-center font-semibold">Login</Text>
              )}
         
            </TouchableOpacity>
          </View>
        </ScrollView>
   
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;