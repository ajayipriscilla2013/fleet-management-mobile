import {
  View,
  SafeAreaView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Button, // For loading spinner
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from '@tanstack/react-query'; // Import useMutation from react-query
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import api from "@/src/services/api";
import { login } from "@/src/services/api";
import {
  authenticateUser,
  getRoleBasedRoute,
} from "@/src/services/authService";
import Logo from "@/assets/images/Logo.png";
import { Input } from "@/components/Input"; 
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from "@/src/context/AuthContext";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { user,loginUser  } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Using React Query's useMutation for the login API call
  const mutation = useMutation({
    mutationFn: loginUser, // `login` is the function making the API call
    onSuccess: (response) => {
      if (response.status === 200) {
        const { user_role } = response.data;
       
        const route = getRoleBasedRoute(user_role);
        router.navigate(route);
        // Alert.alert("Login Successful", "You have logged in successfully!");
      }
    },
    onError: (error: any) => {
      const serverError = error?.response?.data?.message || 'An error occurred while logging in.';
      setErrorMessage(serverError); // Set the server error message
    },
  });

  const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    const transformedBody = {
      username: data.username,
      password: data.password,
      dataname: "loginUser",
    };

    setErrorMessage(null); // Clear previous errors before new attempt
    mutation.mutate(transformedBody); // Trigger the mutation for login
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6">
            <View className="mb-8 mx-auto">
              <Image source={Logo} className="w-10 h-10" />
            </View>

            <Text className=" text-2xl w-1/2 font-extrabold">Welcome back 👋</Text>
            <Text className="text-[#A5A6AB] mb-8">
              Enter your email and password to log in
            </Text>

            {/* Login Form */}
            <View className="mb-4">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Username"
                    placeholder="Enter your Username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.username?.message as string}
                  />
                )}
              />
            </View>

            <View className="mb-8">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="">
               
                  <Input
                    label="Password"
                    placeholder="********"
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.password?.message as string}
                    style={{ flex: 1 }}
                  />
                 
                    </View>
                )}
              />
               <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)} 
                      
                      className="flex-row justify-end"
                    >
                      <Text>{showPassword ? <Feather name="eye-off" size={18} color="black" /> : <Feather name="eye" size={18} color="black" />}</Text>
                    </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <View className="flex-row justify-between items-center mb-8">
              <TouchableOpacity
                onPress={() => {
                  router.navigate("/(auth)/forgot-password");
                }}
              >
                <Text className="text-[#394F91] font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message Display */}
            {errorMessage && (
              <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
            )}

            {/* Login Button with Loading Indicator */}
            <TouchableOpacity
              className="bg-[#394F91] p-4 rounded-lg mb-4"
              onPress={handleSubmit(handleLogin)}
              disabled={mutation.isPending} // Disable button while loading
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#FFF" /> // Show loading spinner
              ) : (
                <Text className="text-white text-center font-semibold">Login</Text>
              )}
         
            </TouchableOpacity>
          </View>
        </ScrollView>

       
      
   
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;