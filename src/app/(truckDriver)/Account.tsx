import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ImageBackground
} from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import axios from "axios";
import { getUser } from "@/src/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/services/api";
import StarIcon from "@/assets/svgs/Star-filled.svg"
import KeyIcon from "@/assets/svgs/key.svg"
import MenuIcon from "@/assets/svgs/Menu.svg"
import SecurityIcon from "@/assets/svgs/Security.svg"
import SupportIcon from "@/assets/svgs/support.svg"
import EditIcon from "@/assets/svgs/edit-2.svg"
import LogoutIcon from "@/assets/svgs/logout.svg"
import AtIcon from "@/assets/svgs/@.svg"
import ArrowIcon from "@/assets/svgs/arrow-right2.svg"
import ArrowLogoutIcon from "@/assets/svgs/arrow-red.svg"
import Avatar2 from "@/assets/images/avatar2.png"
import Bg from "@/assets/images/image3.png"






const Account = () => {
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };
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
    // <SafeAreaView className="flex-1 bg-white">
    //   <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
    //     <View className="flex items-center justify-center mt-8">
    //       {
    //         <View className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
    //           <Image
    //             source={{
    //               uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
    //             }}
    //           />
    //         </View>
    //       }
    //     </View>
    //     <View className="mt-4 px-6">
    //       <Text className="text-2xl font-semibold text-center">
    //         {user.first_name} {user.last_name}
    //       </Text>
    //       <Text className="text-sm text-center text-gray-500">
    //         {user.username}
    //       </Text>
    //     </View>
    //     <View className="mt-6 px-6">
    //       <Text className="text-lg font-semibold">Contact Information</Text>
    //       <Text className="text-sm text-gray-500 mt-2">
    //         Email: {user.email}
    //       </Text>
    //       <Text className="text-sm text-gray-500 mt-1">
    //         Phone: {user.phone}
    //       </Text>
    //       <Text className="text-sm text-gray-500 mt-1">
    //         Address: {user.address}
    //       </Text>
    //       <Text className="text-sm text-gray-500 mt-1">
    //         State: {user.state}
    //       </Text>
    //       <Text className="text-sm text-gray-500 mt-1">
    //         Country: {user.country}
    //       </Text>
    //     </View>
    //     <View className="mt-6 px-6">
    //       <Text className="text-lg font-semibold">Account Information</Text>
    //       <Text className="text-sm text-gray-500 mt-2">
    //         User ID: {user.user_id}
    //       </Text>
    //       <Text className="text-sm text-gray-500 mt-1">
    //         Last Login: {user.last_login}
    //       </Text>
    //       <Text className="text-sm text-gray-500 mt-1">
    //         Account Status: {user.is_active ? "Active" : "Inactive"}
    //       </Text>
    //     </View>
    //     <View className="mt-6 px-6">
    //       <Text className="text-sm text-gray-400">
    //         Account created on: {user.created_at}
    //       </Text>
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>

    <View className="flex-1 bg-[#394F91] ">
      <ImageBackground source={Bg} resizeMode="cover">
    <View className="pt-12 pb-6 px-4 ">
      <Text className="text-3xl font-bold text-white">My Account</Text>
      <View className="mt-4 items-center">
        <Image
          source={Avatar2}
          className="w-24 h-24 rounded-full"
        />
        <Text className="mt-2 text-xl font-semibold text-white">Uwurume Peter</Text>
        <Text className="text-white">shipperpeter@gmail.com</Text>
        <TouchableOpacity className="flex-row  items-center gap-1 mt-2 px-4 py-2 bg-white rounded-full">
          <Text className="text-[#394F91]">Edit Profile</Text>
          <EditIcon/>
        </TouchableOpacity>
      </View>
    </View>
      </ImageBackground>
    <ScrollView className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
      {[
        { icon: KeyIcon, text: 'Change Password' },
        { icon: MenuIcon, text: 'Manage Trips' },
        { icon: SecurityIcon, text: 'Enable Biometrics' },
        { icon: AtIcon, text: 'About Charissatics' },
        { icon: SupportIcon, text: 'Support' },
        { icon: StarIcon, text: 'Rate our app' },
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          className="flex-row items-center py-4 border rounded-lg mb-2 px-4  border-[#F6F6F6]"
        >
          <View className="rounded-full bg-[#EDEDFF] p-2 ">

          <item.icon className="w-6 h-6 text-blue-600 " />
          </View>
          <Text className="flex-1 ml-4 text-lg">{item.text}</Text>
         
          <ArrowIcon/>
        </TouchableOpacity>
      ))}
      <TouchableOpacity className="flex-row items-center py-4 border border-[#F6F6F6] rounded-lg mb-2 px-4" 
     
       onPress={() =>
         handlePress("/(auth)/signin")}
      >
      <View className="rounded-full bg-[#FFEBE5] p-2 ">
        <LogoutIcon className="w-6 h-6 text-red-600" />
        </View>
        <Text className="flex-1 ml-4 text-lg text-red-600">Log out</Text>
        <ArrowLogoutIcon/>
      </TouchableOpacity>
    </ScrollView>
  </View>
  );
};

export default Account;
