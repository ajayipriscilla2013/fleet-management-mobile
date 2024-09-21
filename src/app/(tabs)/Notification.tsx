import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Notifications = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };
  return (
    <SafeAreaView className="flex-1  bg-[#F9F9F9]">
      <View className="bg-[#F9F9F9] flex-1 mx-6 mt-5">
        <Text className="text-[#1D1E20] font-extrabold text-2xl  mb-3">
          Notification
        </Text>

        <ScrollView>
          <View>
            <Text className="text-[#A5A6AB] font-normal text-xs mb-4">
              TODAY
            </Text>

            <TouchableOpacity onPress={() => handlePress(`/notification/${1}`)}>         
            <View className="bg-white w-full h-[72px] p-4 rounded-lg mb-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="h-[10px] w-[10px] bg-[#394F91] rounded-full"></View>
                  <Text className="">New Trip 🎉</Text>
                </View>
                <Text className="text-[#A5A6AB] font-normal text-xs">
                  2 hours ago
                </Text>
              </View>
              <Text className="text-[#A5A6AB] mt-2 font-normal text-xs">
                You have successfully created a new trip
              </Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePress(`/notification/${1}`)}>         
            <View className="bg-white w-full h-[72px] p-4 rounded-lg mb-2">
              <View className="flex-row items-center justify-between">
                <Text className=""> Trip Ended</Text>
                <Text className="text-[#A5A6AB] font-normal text-xs">
                  2 hours ago
                </Text>
              </View>
              <Text className="text-[#A5A6AB] mt-2 font-normal text-xs">
                Your trip has successfully been completed
              </Text>
            </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
