
import React from "react";
import { View, Text, TouchableOpacity, } from "react-native";
import { router } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

const UnauthorizedPage = () => {
  return (
    <View className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <View className="mx-auto max-w-md space-y-6">
        {/* Icon */}
        <View className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          {/* <LockIcon className="h-12 w-12 text-gray-500" /> */}
          <Feather name="lock" size={24} color="#394F91" />
        </View>

        {/* Content */}
        <View className="space-y-3">
          <Text className="text-3xl text-[#394F91] font-bold tracking-tighter sm:text-4xl text-center">Access Denied</Text>
          <Text className="text-gray-500 md:text-lg text-center   ">
            Sorry, you don&apos;t have permission to access this page. Please contact your administrator if you believe
            this is an error.
          </Text>
        </View>

        {/* Actions */}
        <View className="pt-4">
          <TouchableOpacity onPress={() => router.replace("/")} className="bg-[#394F91] text-white rounded-2xl p-4 mt-6">
            Return to Home
          </TouchableOpacity>
        </View>
      </View>

      {/* Background decoration */}
      <View className="absolute inset-0 -z-10 overflow-hidden">
        <View className="absolute left-[-10%] top-[-50%] h-[500px] w-[500px] rounded-full bg-gray-100 opacity-20"></View>
        <View className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-gray-100 opacity-20"></View>
      </View>
    </View>
  );
};

export default UnauthorizedPage;

