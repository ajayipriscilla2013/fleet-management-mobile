import {
  getNotifications,
  markNotificationsRead,
} from "@/src/services/notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EmptyScreen from "@/assets/svgs/empty.svg";
import Tick from "@/assets/svgs/tick.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import SkeletonLoader from "@/components/NotificationsSkeletonLoader";

// Add the relativeTime plugin to Day.js
dayjs.extend(relativeTime);

const Notifications = () => {
  const router = useRouter();

  const handlePress = (path) => {
    router.push(path);
  };

  const [refreshing, setRefreshing] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch()
    setRefreshing(false);
  };

  const {
    data: notificationsData = [],
    isLoading: isNotificationsProgressLoading,
    error: notificationsError,
    refetch
  } = useQuery({
    queryKey: ["notificationsForAdmin"],
    queryFn: getNotifications,

  });

  const mutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      console.log("Notification Read");
      Alert.alert("Success", "Notification Read");
      handleRefresh()
    },
    onError: (error) => {
      // Check if the error response contains a message
      const errorMessage =
        error.response?.data?.message || "Request Failed, Try Again";
        // error.data?.message || "Request Failed, Try Again";

      console.error("Error submitting data:", error.data?.message);
      Alert.alert("Error", `${errorMessage}`);
     
    },
  });

  const handleSubmit = (notificationId) => {
    mutation.mutate({ id: notificationId });
    setShowUnreadOnly(true)
  };

    // Filter notifications based on showUnreadOnly state
    const filteredNotifications = showUnreadOnly
    ? notificationsData.filter((notification) => notification.is_read === 1)
    : notificationsData;

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubmit(item.id)}>
      <View className="bg-white w-full h-[72px] p-4 rounded-lg mb-2">
        <View className="flex-row items-center justify-between">
          <Text className=""> {item.title}</Text>
          <Text className="text-[#A5A6AB] font-normal text-xs">
            {dayjs(item.created_at).fromNow()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[#A5A6AB] mt-2 font-normal text-xs">
            {item.message}
          </Text>
          <Text
            onPress={() => {
              handleSubmit;
            }}
          >
            ✅
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNotificationsContent = () => {
    if(refreshing){
      return(
        <View className="mt-4">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </View>
      )
    }
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
          {/* <Text className="text-lg text-red-500">
            Error: {notificationsError.message}
          </Text> */}
          <Text className="text-lg text-red-500">
          Request Failed, Try Again
          </Text>
          <TouchableOpacity
            className="bg-[#394F91] rounded-2xl p-4"
            onPress={() => {
             refetch()
            }}
          >
            <Text className="text-white text-center font-semibold">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (filteredNotifications.length === 0) {
      return (
        <View className="flex items-center justify-center mt-10">
          <EmptyScreen />
          {/* <Text className="text-lg text-gray-500">No Notifications found.</Text> */}
          {showUnreadOnly ? "No unread notifications found." : "No notifications found."}
        </View>
      );
    }

    return (
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        className="mt-4"
        refreshControl={ 
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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

        <TouchableOpacity
            onPress={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-3 py-1 rounded-lg ${
              showUnreadOnly ? "bg-[#394F91]" : "bg-gray-300"
            }`}
          >
            <Text className={`${showUnreadOnly ? "text-black" : "text-gray-700"}`}>
              {showUnreadOnly ? "Unread Only" : "Show All"}
            </Text>
          </TouchableOpacity>

        <View>
          {/* <Text className="text-[#A5A6AB] font-normal text-xs mb-4">
              TODAY
            </Text> */}

          {renderNotificationsContent()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
