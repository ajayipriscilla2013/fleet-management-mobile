


import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import Logo from "@/assets/images/Logo.png"
import { router } from 'expo-router';

const LoginPage = () => {
  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: '#F9F9F9',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
    <View className="flex-1 bg-white  px-6">
    

      <View className="mb-8 mx-auto">
        <Image
          source={Logo}
          className="w-10 h-10"
        />
      </View>

      <Text className=" text-2xl w-1/2 font-extrabold">Reset 
      </Text>
      <Text className="text-2xl text-[#394F91] font-extrabold mb-2 w-1/2">Password 😞 </Text>
      <Text className="text-[#A5A6AB] mb-8">
      Make sure you use a password that you can easily remember.
      </Text>

      {/* Login Form */}
      <View className="mb-4">
        <Text className="text-[#30333A] font-medium mb-2">Password</Text>
        <TextInput
          className="border border-gray-300  h-[60px] rounded-lg p-3"
          secureTextEntry
          placeholder="••••••••••"
        />
      </View>

      <View className="mb-4">
        <Text className="text-[#30333A] font-medium mb-2">Re-enter Password</Text>
        <TextInput
          className="border border-gray-300  h-[60px] rounded-lg p-3"
           secureTextEntry
          placeholder="••••••••••"
        />
      </View>

      

     <View className='flex-1'>

     </View>

      {/* Login Button */}
      <TouchableOpacity className="bg-[#394F91] p-4  rounded-lg mb-4" onPress={() => {
          router.navigate("/(auth)/verification-code");
        }}>
        <Text className="text-white text-center font-semibold">Reset Password</Text>
      </TouchableOpacity>

      

      
    </View>
    </SafeAreaView>
  );
};

export default LoginPage;
