import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import { Platform } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children, }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored user data when the app loads
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user', error);
      }
    };
    loadStoredUser();
  }, []);

  const loginUser = async (body) => {
    try {
      const response = await API.post("auth/auth.php", body);
      const { token, user_id } = response.data;

      if (Platform.OS === "web") {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user_id", user_id);
      } else {
        await AsyncStorage.setItem("jwtToken", token);
        await AsyncStorage.setItem("user_id", user_id);
      }
      getUser(user_id);
      return response;
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
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("API request error", error);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('jwtToken');
    // queryClient.invalidateQueries();  // Use passed in queryClient
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);