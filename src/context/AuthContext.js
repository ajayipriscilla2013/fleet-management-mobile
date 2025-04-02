import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import { Platform } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children, }) => {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored user data when the app loads
    const loadStoredUser = async () => {
      try {
        setLoading(true)
        const storedUser = await AsyncStorage.getItem('user');
        console.log("storred user");
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user', error);
      }finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  useEffect(() => {
    // Check for stored user data when the app loads
    const loadLogeedInUser = async () => {
      try {
        setLoading(true)
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        console.log("storred user");
        
        if (loggedInUser) {
          setLoggedInUser(JSON.parse(loggedInUser));
        }
      } catch (error) {
        console.error('Error loading stored user', error);
      }finally {
        setLoading(false);
      }
    };
    loadLogeedInUser();
  }, []);

  const loginUser = async (body) => {
    try {
      setLoading(true)
      const response = await API.post("auth/auth.php", body);
      const { token, user_id,user_role } = response.data;
      console.log(response.data);
      
      if (Platform.OS === "web") {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user_id", user_id);
      } else {
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
        await AsyncStorage.setItem("jwtToken", token);
        await AsyncStorage.setItem("user_id", user_id);
        await AsyncStorage.setItem("user_role", user_role);
      }
      setUser(response.data);
      getUser(user_id);
      return response;
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("auth/auth.php", {
        user_id,
        dataname: "getUser",
      });
      setLoggedInUser(response.data.user);
      localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      // console.log("user from get user",response);
      
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
    <AuthContext.Provider value={{ user, loginUser, logout,loading, loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);