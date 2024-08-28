import {
  View,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Badge } from "@/components/Badge";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/assets/images/icon.png";
import { router } from "expo-router";
import { Link } from "expo-router";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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
      <View className=" w-[80%]">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Username"
              placeholder="Enter your Username"
              className="py-2"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.username?.message as string}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="********"
              className="py-2"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message as string}
            />
          )}
        />
      </View>

      <Button
        label="Sign In"
        className="w-[80%] my-4 bg-[#3A5092]"
        // onPress={handleSubmit(handleLogin)}
        onPress={() => {
          router.navigate("/home/Home");
        }}
      />
      <Button
        label="Forgot Password ?"
        variant={"normal"}
        onPress={() => {
          router.navigate("/(auth)/forgot-password");
        }}
      />
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default HomePage;
