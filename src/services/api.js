import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API = axios.create({
  baseURL: "http://fmabackend.charissatics.com/api/",
});

export const login = async (body) => {
  try {
    const response = await API.post("auth/auth.php", body);

    const { token, user_id } = response.data;

    // Store the JWT token based on the platform
    if (Platform.OS === "web") {
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user_id", user_id);
    } else {
      await AsyncStorage.setItem("jwtToken", token);
      await AsyncStorage.setItem("user_id", user_id);
    }

    return response.data;
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

// Add a request interceptor to include the JWT token in the Authorization header
API.interceptors.request.use(
  async (config) => {
    try {
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("jwtToken")
          : await AsyncStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error fetching token", err);
    }
    return config;
  },
  (error) => {
    console.error("Request error", error);
    return Promise.reject(error);
  }
);

export default API;
