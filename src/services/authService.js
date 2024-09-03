// authService.js
import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (body) => {
  try {
    const response = await API.post("auth/auth.php", body);
    const { token } = response.data;

    // Store the JWT token
    await AsyncStorage.setItem("jwtToken", token);

    return response.data;
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

export const getUser = async (body) => {
  try {
    const response = await API.post("auth/auth.php", body);
    console.log("Data:", response.data);
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

export const logout = async () => {
  // Remove the JWT token
  await AsyncStorage.removeItem("jwtToken");
};
