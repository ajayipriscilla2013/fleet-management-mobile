import {
  View,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/assets/images/icon.png";
import { router } from "expo-router";

const loginSchema = z.object({
  email: z.string().min(1, "email is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
const HomePage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin: SubmitHandler<LoginFormData> = async (
    data: LoginFormData
  ) => {
    console.log(data);

    try {
      const response = await axios.post(
        "http://fma.charissatics.com:8000/api/signin",
        data
      );
      console.log(response);

      if (response.status === 200) {
        Alert.alert("Login Successful", "You have logged in successfully!");
      } else {
        Alert.alert("Login Failed", "Please check your credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while logging in.");
      console.error(error);
    }
  };
  return (
    <SafeAreaView className="flex-1 items-center justify-center ">
      {/* <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          > */}
      <Image source={Logo} className="h-12 w-12 my-12" />
      <Text>Forgot Password</Text>
      <View className=" w-[80%]">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Enter your Email"
              className="py-2"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message as string}
            />
          )}
        />
      </View>

      <Button
        label="Sign In"
        className="w-[80%] my-4 bg-[#3A5092]"
        onPress={() => {
          router.back();
        }}
      />

      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default HomePage;
