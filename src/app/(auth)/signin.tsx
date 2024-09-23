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
//   password: z.string().min(6, "Password must be at least 6 characters long"),
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
  
//   const handleLogin: SubmitHandler<LoginFormData> = async (
//     data: LoginFormData
//   ) => {
//     console.log(data);
//     const transformedBody = {
//       username: data.username,
//       password: data.password,
//       dataname: "loginUser",
//     };
//     // const user = authenticateUser(data.username, data.password);
  
//     // if (user) {
//     //   Alert.alert("Login Successful", `Welcome, ${user.username}!`);
//     //   const route = getRoleBasedRoute(user.role);
//     //   router.navigate(route);
//     // } else {
//     //   Alert.alert("Login Failed", "Invalid username or password.");
//     // }
  
//     try {
  
//       const response =await  login(transformedBody);
      
      
//       if (response.status === 200) {
//         const { user_role } = response.data;
//         console.log("role:",user_role);
//         const route = getRoleBasedRoute(user_role);
//         console.log("route",route);
        
//         router.navigate(route);
//             Alert.alert("Login Successful", "You have logged in successfully!");
            
//             // router.navigate("/(admin)/Home");
//           } else {
//             Alert.alert("Login Failed", "Please check your credentials.");
//           }
//     } catch (error) {
//       // setErrorMessage('Login failed. Please check your credentials.');
//       Alert.alert("Error", "An error occurred while logging in.");
//       console.log(error)
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
//       <View className="flex-1   p-6">
//         <View className="mb-8 mx-auto">
//           <Image source={Logo} className="w-10 h-10" />
//         </View>

//         <Text className=" text-2xl w-1/2 font-extrabold">Welcome back </Text>
//         <Text className="text-2xl text-[#394F91] font-extrabold mb-2 w-1/2">
//           Peter! 👋
//         </Text>
//         <Text className="text-[#A5A6AB] mb-8">
//           Enter your email and password to log in
//         </Text>

//         {/* Login Form */}
//         <View className="mb-4">
//           {/* <Text className="text-[#30333A] font-medium mb-2">Username</Text>
//           <TextInput
//             className="border border-gray-300 bg-white  h-[60px] rounded-lg p-3"
//             placeholder="Truckdriver@gmail.com"
//           /> */}
//            <Controller
//           control={control}
//           name="username"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <Input
//               label="Username"
//               placeholder="Enter your Username"
//             //  className="border border-gray-300 bg-white  h-[60px] rounded-lg p-3"
//               onBlur={onBlur}
//               onChangeText={onChange}
//               value={value}
//               errorMessage={errors.username?.message as string}
//             />
//           )}
//         />
//         </View>

//         <View className="mb-8">
//           {/* <Text className="text-[#30333A] font-medium mb-2">Password</Text>
//           <TextInput
//             className="border bg-white border-gray-300 rounded-lg p-3 h-[60px]"
//             secureTextEntry
//             placeholder="••••••••••"
//           /> */}
//           <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <Input
//               label="Password"
//               placeholder="********"
//               className="py-2"
//               secureTextEntry
//               onBlur={onBlur}
//               onChangeText={onChange}
//               value={value}
//               errorMessage={errors.password?.message as string}
//             />
//           )}
//         />
//         </View>

//         <View className="flex-row justify-between items-center mb-8">
//           <View className="flex-row items-center"></View>
//           <TouchableOpacity
//             onPress={() => {
//               router.navigate("/(auth)/forgot-password");
//             }}
//           >
//             <Text className="text-[#394F91] font-semibold">
//               Forgot Password?
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Login Button */}
//         <TouchableOpacity
//           className="bg-[#394F91] p-4  rounded-lg mb-4"
//           onPress={handleSubmit(handleLogin)}
//         >
//           <Text className="text-white text-center font-semibold">Login</Text>
//         </TouchableOpacity>

//         {/* Sign Up Link */}
//         {/* <Text className="text-center text-gray-600 mt-8">
//         Don't have an account? <Text className="text-blue-600">Signup</Text>
//       </Text> */}



//       </View>
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
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView, // Added ScrollView to handle long forms
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Badge } from "@/components/Badge";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Link } from "expo-router";
import api from "@/src/services/api";
import { login } from "@/src/services/api.js";
import {
  authenticateUser,
  getRoleBasedRoute,
} from "@/src/services/authService";
import Logo from "@/assets/images/Logo.png";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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

  const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    console.log(data);
    const transformedBody = {
      username: data.username,
      password: data.password,
      dataname: "loginUser",
    };

    try {
      const response = await login(transformedBody);

      if (response.status === 200) {
        const { user_role } = response.data;
        console.log("role:", user_role);
        const route = getRoleBasedRoute(user_role);
        console.log("route", route);

        router.navigate(route);
        Alert.alert("Login Successful", "You have logged in successfully!");
      } else {
        Alert.alert("Login Failed", "Please check your credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while logging in.");
      console.log(error);
    }
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
        behavior={Platform.OS === "ios" ? "padding" : undefined} // Only set behavior to 'padding' on iOS
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6">
            <View className="mb-8 mx-auto">
              <Image source={Logo} className="w-10 h-10" />
            </View>

            <Text className=" text-2xl w-1/2 font-extrabold">Welcome back </Text>
            <Text className="text-2xl text-[#394F91] font-extrabold mb-2 w-1/2">
              Peter! 👋
            </Text>
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
                  <Input
                    label="Password"
                    placeholder="********"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.password?.message as string}
                  />
                )}
              />
            </View>

            <View className="flex-row justify-between items-center mb-8">
              <View className="flex-row items-center"></View>
              <TouchableOpacity
                onPress={() => {
                  router.navigate("/(auth)/forgot-password");
                }}
              >
                <Text className="text-[#394F91] font-semibold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-[#394F91] p-4  rounded-lg mb-4"
              onPress={handleSubmit(handleLogin)}
            >
              <Text className="text-white text-center font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;