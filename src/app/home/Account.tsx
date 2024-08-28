import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Account = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center">
        <Text className="text-2xl font-bold text-center mb-8">Account</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity
          className="w-full bg-blue-500 py-4 rounded-lg mb-4"
          // onPress={() => router.push("/account/edit-profile")}
        >
          <Text className="text-center text-white text-lg">Edit Profile</Text>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          className="w-full bg-blue-500 py-4 rounded-lg mb-4"
          // onPress={() => router.push("/account/change-password")}
        >
          <Text className="text-center text-white text-lg">
            Change Password
          </Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          className="w-full bg-red-500 py-4 rounded-lg"
          onPress={() => {
            // Handle sign out logic here, e.g., clear tokens, redirect to login screen
            // router.replace("/auth/login");
          }}
        >
          <Text className="text-center text-white text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Account;
