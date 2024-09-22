import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://fmabackend.charissatics.com/api/",
});

export const login = async (body) => {
  try {
    // Attempt to login
    const response = await API.post("auth/auth.php", body);
    console.log(response.data);
    
    const { token, user_id} = response.data;
    console.log("token:", token);
    console.log("user_Id:", user_id);

    // Store the JWT token based on the platform
    if (Platform.OS === "web") {
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user_id", user_id);
    } else {
      await AsyncStorage.setItem("jwtToken", token);
      await AsyncStorage.setItem("user_id", user_id);
    }

    return response
  } catch (error) {
    // Determine error type and provide feedback
    if (error.response) {
      // Server responded with a status other than 2xx
      switch (error.response.status) {
        case 400:
          console.error("Invalid request. Please check your input.");
          break;
        case 401:
          console.error("Unauthorized. Please check your credentials.");
          break;
        case 500:
          console.error("Server error. Please try again later.");
          break;
        default:
          console.error("An unexpected error occurred.");
      }
    } else if (error.request) {
      // No response received from server
      console.error("Network error. Please check your connection.");
    } else {
      // Something else went wrong
      console.error("An error occurred:", error.message);
    }

    // Optionally: Provide a user-facing error message or trigger UI updates
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

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Response error", error);
    return Promise.reject(error);
  }
);

export default API;