
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import { Platform } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

  useEffect(()=>{
    getUser()
  },[])

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const loginUser = async (body) => {
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
  getUser(user_id)
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


const getUser= async () => {
  try {
    const user_id = await AsyncStorage.getItem("user_id");

    const response = await API.post("auth/auth.php", {
      user_id,
      dataname: "getUser",
    });
    console.log("userdata",response.data.user);
    setUser(response.data.user)
    return response.data.user
  } catch (error) {
    console.error("API request error", error);
  }
};





  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('jwtToken');
    console.log("lOgged");
    
  };

  const data="string name"

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);