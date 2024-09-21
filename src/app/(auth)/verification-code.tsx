import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Logo from "@/assets/images/Logo.png";
import { router } from "expo-router";

const VerificationCodePage = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-8 mx-auto">
        <Image source={Logo} className="w-10 h-10" />
      </View>

      <Text className="text-2xl font-bold mb-2">Verification </Text>
      <Text className="text-2xl font-bold mb-2 text-[#394F91]">Code 🔑</Text>
      <Text className="text-[#A5A6AB] mb-8">
        Enter the 4 digit code sent to your email to verify your Charissatics
        account.
      </Text>

      {/* Code Input */}
      <View className="flex-row gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <TextInput
            key={i}
            className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl"
            maxLength={1}
            keyboardType="number-pad"
          />
        ))}
      </View>


      <View className="flex-1">
        </View>
      {/* Resend Code */}
      <View className="flex-row items-center gap-2 mb-8 mx-auto">
        <Text className="text-center text-[#7F8188] ">
          Didn't get the code?
        </Text>
        <View className="p-2 bg-[#EEF0FB] rounded-lg">
          <Text className="text-[#394F91] ">Resend in 50s</Text>
        </View>
      </View>

    

     

      {/* Verify Button */}
      <TouchableOpacity className="bg-[#394F91] p-4 rounded-lg" onPress={() => {
          router.navigate("/(auth)/reset-password");
        }}>
        <Text className="text-white text-center font-semibold">
          Verify Code
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationCodePage;
