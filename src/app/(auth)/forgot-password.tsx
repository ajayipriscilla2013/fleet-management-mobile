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

const ResetPasswordSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
const HomePage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const handleResetPassword: SubmitHandler<ResetPasswordFormData> = async (
    data: ResetPasswordFormData
  ) => {
    console.log(data);

    try {
      const transfromedBody = {
        username: data.username,
        dataname: "resetPassword",
      };
      const response = await axios.post(
        "http://fmabackend.charissatics.com/api/auth/auth.php",
        transfromedBody
      );
      console.log(response);

      if (response.status === 200) {
        Alert.alert("An Email has been sent to the associated Username!");
        router.back();
      } else {
        Alert.alert("Please check your credentials.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while Reseting Password.");
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
      </View>

      <Button
        label="Sign In"
        className="w-[80%] my-4 bg-[#3A5092]"
        onPress={handleSubmit(handleResetPassword)}
      />

      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default HomePage;
