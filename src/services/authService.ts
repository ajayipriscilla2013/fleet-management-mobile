// authService.js
import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

export const login = async (body) => {
  const { login } = useAuth();
  try {
    const response = await API.post("auth/auth.php", body);
    const { token, user_id, user_role } = response.data;

    // Store the JWT token
    await AsyncStorage.setItem("jwtToken", token);

    // Store user data in context
    await login({ user_id, user_role });

    return response.data;
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

const getUser = async () => {
  try {
    const user_id = await AsyncStorage.getItem("user_id");

    const response = await API.post("auth/auth.php", {
      user_id,
      dataname: "getUser",
    });
    console.log(response.data.user);
    return response.data.user;
  } catch (error) {
    console.error("API request error", error);
  }
};

export const logout = async () => {
  const { logout } = useAuth();
  // Remove the JWT token
  await AsyncStorage.removeItem("jwtToken");
  await logout();
};

type UserRole = "Customer" | "driver" | "admin" | "fuelAttendant";

interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

// // Dummy user data
// const users: User[] = [
//   { id: '1', username: 'Customer', password: 'Customer', role: 'customer' },
//   { id: '2', username: 'Driver', password: 'Driver', role: 'truckDriver' },
//   { id: '3', username: 'Admin', password: 'Admin1', role: 'admin' },
//   { id: '4', username: 'FuelAttendant', password: 'FuelAttendant', role: 'fuelAttendant' },
// ];

export const authenticateUser = (
  username: string,
  password: string
): User | null => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};

export const getUserRole = (userId: string): UserRole | null => {
  const user = users.find((u) => u.id === userId);
  return user ? user.role : null;
};

// export const getRoleBasedRoute = (role: UserRole): string => {
//   switch (role) {
//     case "Customer":
//       return "/(customer)/Home";
//     case "driver":
//       return "/(truckDriver)/Home";
//     case "admin":
//       return "/(admin)/Home";
//     case "fuelAttendant":
//       return "/(fuelAttendant)/Home";
//     case "Fuel Attendant":
//       return "/(fuelAttendant)/Home";
//     default:
//       return "/";
//   }
// };

export const getRoleBasedRoute = (role: string): string => {
  // Normalize role by trimming, converting to lowercase, and removing extra spaces
  const normalizedRole = role.trim().toLowerCase().replace(/\s+/g, "");

  switch (normalizedRole) {
    case "customer":
      return "/customer/";
    case "driver":
      return "/driver/";
    case "admin":
      return "/admin/";
    case "fuelattendant":
      return "/fuel-attendant/";
    default:
      return "/";
  }
};
