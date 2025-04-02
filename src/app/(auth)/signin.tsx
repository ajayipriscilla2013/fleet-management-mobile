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
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from '@tanstack/react-query';
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
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from "@/src/context/AuthContext";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';



const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const StyledInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  errorMessage,
  onBlur,
  onFocus 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View className="mb-4">
      <View className='flex-row justify-between'>
        <Text className="text-gray-600 mb-[10px]">{label}</Text>
        {errorMessage && (
          <Text className="mb-2 text-red-500">{errorMessage}</Text>
        )}
      </View>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={() => {
          setIsFocused(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur();
        }}
        className={`border bg-white rounded-md p-2 h-[60px] ${
          isFocused
            ? "border-[#394F91] bg-[#F0F2FF]"
            : "border-[#C4CCF0]"
        }`}
      />
    </View>
  );
};

const PasswordInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  errorMessage,
  onBlur,
  onFocus 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <View className="mb-4">
      <View className='flex-row justify-between'>
        <Text className="text-gray-600 mb-[10px]">{label}</Text>
        {errorMessage && (
          <Text className="mb-2 text-red-500">{errorMessage}</Text>
        )}
      </View>
      <View 
        className={`border bg-white rounded-md h-[60px] flex-row items-center justify-between ${
          isFocused
            ? "border-[#394F91] bg-[#F0F2FF]"
            : "border-[#C4CCF0]"
        }`}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          onFocus={() => {
            setIsFocused(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          className="flex-1 h-full p-2"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="pr-3"
        >
          {showPassword ? 
            <Feather name="eye-off" size={18} color="black" /> : 
            <Feather name="eye" size={18} color="black" />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LoginPage = () => {
  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { user, loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.status === 200) {
        const { user_role } = response.data;
        const route = getRoleBasedRoute(user_role);
        router.navigate(route);
      }
    },
    onError: (error: any) => {
      const serverError = error?.response?.data?.message || 'An error occurred while logging in.';
      setErrorMessage(serverError);
    },
  });

  const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    const transformedBody = {
      username: data.username,
      password: data.password,
      dataname: "loginUser",
    };

    setErrorMessage(null);
    mutation.mutate(transformedBody);
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

            {/* Login Form with Updated Styling */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledInput
                  label="Username"
                  placeholder="Enter your Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.username?.message as string}
                />
              )}
            />

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                
                    <PasswordInput
                      label="Password"
                      placeholder="********"
                      // secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.password?.message as string}
                    />
                  
                )}
              />
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#FFF" />
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