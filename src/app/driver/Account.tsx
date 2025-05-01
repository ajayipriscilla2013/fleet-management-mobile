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
import { useAuth } from "@/src/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";






const Account = () => {
  const { loggedInUser, logout } = useAuth();
  const router = useRouter();
  const handlePress = (path) => {
    router.push(path);
  };
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  return (

    <View className="flex-1 bg-[#394F91] ">
      <ImageBackground source={Bg} resizeMode="cover">
    <View className="pt-12 pb-6 px-4 ">
      <Text className="text-3xl font-bold text-white">My Account</Text>
      <View className="mt-4 items-center">
        <Image
          source={Avatar2}
          className="w-24 h-24 rounded-full"
        />
        <Text className="mt-2 text-xl font-semibold text-white">{loggedInUser?.first_name +" " + loggedInUser?.last_name}</Text>
        <Text className="text-white">{loggedInUser?.email}</Text>
        <TouchableOpacity onPress={() =>{
        handlePress("/(auth)/EditProfile")}
      }  className="flex-row  items-center gap-1 mt-2 px-4 py-2 bg-white rounded-full">
          <Text className="text-[#394F91]">Edit Profile</Text>
          <EditIcon/>
        </TouchableOpacity>
      </View>
    </View>
      </ImageBackground>
    <ScrollView className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
      {[
        {
          icon: KeyIcon,
          text: "Change Password",
          route: "/(auth)/ChangePassword",
        },
        { icon: MenuIcon, text: "Manage Trips",route: "/driver/trip", },
        // { icon: SecurityIcon, text: "Enable Biometrics" },

        {
          icon: AtIcon,
          text: "About Charissatics",
          route: "https://charissatics.com/about-us/",
        },
        { icon: SupportIcon, text: "Support", route: "https://charissatics.com/contact-us/", },
        // { icon: StarIcon, text: "Rate our app" },
      ].map((item, index) => (
        <TouchableOpacity
        onPress={() => {
          if (item.route) {
            handlePress(item.route);  // Navigate if a route exists
          }
        }}
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
      onPress={() =>{
        queryClient.invalidateQueries();
        logout()
        router.replace("/(auth)/signin")
        // handlePress("/(auth)/signin")
      }
      }
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
