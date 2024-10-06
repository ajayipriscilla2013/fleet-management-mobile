import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export const getNotifications = async () => {
    const user_id= await AsyncStorage.getItem("user_id")
  try {
    const response = await API.post("trip/trip.php", {
      user_id,
      dataname: "getUserNotifications",
    });
    console.log(response.data.notifications);
    return response.data.notifications
  } catch (error) {
    console.log("get Notifications Error",error);
    
  }
};

export const markNotificationsRead = async (id) => {
    const user_id= await AsyncStorage.getItem("user_id")
    try {
      const response = await API.post("trip/trip.php", {
        notification_id: id,
        user_id,
        dataname: "markUserNotificationAsRead",
      });
      console.log(response.data.data);
      return response.data.data
    } catch (error) {
      console.log("Mark Notifications Read Error",error);
      
    }
  };