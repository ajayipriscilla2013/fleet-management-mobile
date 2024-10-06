import { getNotifications, markNotificationsRead } from "@/src/services/notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EmptyScreen from "@/assets/svgs/empty.svg";
import Tick from "@/assets/svgs/tick.svg"

const Notifications = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  const {
    data: notificationsData=[],
    isLoading: isNotificationsProgressLoading,
    error: notificationsError,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const mutation = useMutation({
    mutationFn:markNotificationsRead,
    onSuccess:(data)=>{
      if (data.success) {
        console.log("Notification Read");
        Alert.alert("Success", "Notification Read");
      } else {
        console.error('Error:', data.message);
        Alert.alert("Error", data.message || "An unknown error occurred");
      }
    },
    onError: (error) => {
      // Check if the error response contains a message
      const errorMessage = error.response?.data?.message || "An unknown error occurred";
     
      console.error('Error submitting data:', errorMessage);
      Alert.alert("Error", `${errorMessage}`);
  }})

  const handleSubmit = (notificationId) => {
    mutation.mutate(notificationId);
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubmit(item.id)}>
      <View className="bg-white w-full h-[72px] p-4 rounded-lg mb-2">
        <View className="flex-row items-center justify-between">
          <Text className=""> {item.title}</Text>
          <Text className="text-[#A5A6AB] font-normal text-xs">
            2 hours ago
          </Text>
        </View>
        <View className="flex-row justify-between">

        <Text className="text-[#A5A6AB] mt-2 font-normal text-xs">
         {item.message}
        </Text>
      <Text onPress={()=>{
        handleSubmit
      }}>✅</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNotificationsContent = () => {
    if (isNotificationsProgressLoading) {
      return (
        <View className="flex items-center justify-center mt-10">
          <ActivityIndicator />
        </View>
      );
    }

    if (notificationsError) {
      return (
        <View className="flex items-center justify-center mt-10">
          <Text className="text-lg text-red-500">
            Error: {notificationsError.message}
          </Text>
        </View>
      );
    }
    if (notificationsData.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          <Text className="text-lg text-gray-500">No Notifications found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={notificationsData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        className="mt-4"
      />
    );
  };

  return (
    <SafeAreaView
      className="flex-1  bg-[#F9F9F9]"
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="bg-[#F9F9F9] flex-1 mx-6 mt-5">
        <Text className="text-[#1D1E20] font-extrabold text-2xl  mb-3">
          Notification
        </Text>

    
          <View>
            <Text className="text-[#A5A6AB] font-normal text-xs mb-4">
              TODAY
            </Text>

           {renderNotificationsContent()}
          </View>
    
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
