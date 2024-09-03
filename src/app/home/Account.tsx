import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import axios from "axios";
import { getUser } from "@/src/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";

const Account = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");

        const response = await API.post("auth/auth.php", {
          user_id,
          dataname: "getUser",
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("API request error", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex items-center justify-center mt-8">
          {
            <View className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
                }}
              />
            </View>
          }
        </View>
        <View className="mt-4 px-6">
          <Text className="text-2xl font-semibold text-center">
            {user.first_name} {user.last_name}
          </Text>
          <Text className="text-sm text-center text-gray-500">
            {user.username}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text className="text-lg font-semibold">Contact Information</Text>
          <Text className="text-sm text-gray-500 mt-2">
            Email: {user.email}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Phone: {user.phone}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Address: {user.address}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            State: {user.state}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Country: {user.country}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text className="text-lg font-semibold">Account Information</Text>
          <Text className="text-sm text-gray-500 mt-2">
            User ID: {user.user_id}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Last Login: {user.last_login}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Account Status: {user.is_active ? "Active" : "Inactive"}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text className="text-sm text-gray-400">
            Account created on: {user.created_at}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
