import React from 'react';
import { View } from 'react-native';

const SkeletonLoader = () => {
  return (
    <View className="flex h-[90px] mx-3 gap-2 rounded-lg mb-2 py-[13px] px-[18px] bg-white">
      <View className="flex-row items-center justify-between">
        <View className="bg-gray-300 rounded-md h-4 w-32 animate-pulse"></View>
        <View className="bg-gray-300 rounded-md h-4 w-16 animate-pulse"></View>
      </View>
      <View className="flex flex-row items-end justify-between">
        <View>
          <View className="flex-row items-center gap-1">
            <View className="bg-gray-300 rounded-md mb-1 h-4 w-48 animate-pulse"></View>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="bg-gray-300 rounded-md h-4 w-36 animate-pulse"></View>
          </View>
        </View>
      
      </View>
    </View>
  );
};

export default SkeletonLoader;