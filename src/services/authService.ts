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

type UserRole = 'Customer' | 'driver' | 'admin' | 'fuelAttendant';

interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

// Dummy user data
const users: User[] = [
  { id: '1', username: 'Customer', password: 'Customer', role: 'customer' },
  { id: '2', username: 'Driver', password: 'Driver', role: 'truckDriver' },
  { id: '3', username: 'Admin', password: 'Admin1', role: 'admin' },
  { id: '4', username: 'FuelAttendant', password: 'FuelAttendant', role: 'fuelAttendant' },
];

export const authenticateUser = (username: string, password: string): User | null => {
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

export const getUserRole = (userId: string): UserRole | null => {
  const user = users.find(u => u.id === userId);
  return user ? user.role : null;
};

export const getRoleBasedRoute = (role: UserRole): string => {
  switch (role) {
    case 'Customer':
      return '/(customer)/Home';
    case 'driver':
      return '/(truckDriver)/Home';
    case 'admin':
      return '/(admin)/Home';
    case 'fuelAttendant':
      return '/(fuelAttendant)/Home';
    default:
      return '/';
  }
};