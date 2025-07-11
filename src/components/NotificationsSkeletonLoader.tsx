import { View } from "react-native";

const SkeletonLoader = () => {
    return (
      <View className="bg-white w-full h-[72px] p-4 rounded-lg mb-2">
        <View className="flex-row items-center justify-between animate-pulse">
          <View className="bg-gray-200 h-4 w-32 rounded-md animate-pulse" />
          <View className="bg-gray-200 h-4 w-16 rounded-md animate-pulse" />
        </View>
        <View className="flex-row justify-between mt-2">
          <View className="bg-gray-200 h-4 w-48 rounded-md animate-pulse" />
          <View className="bg-gray-200 h-4 w-6 rounded-md animate-pulse" />
        </View>
      </View>
    );
  };

  export default SkeletonLoader