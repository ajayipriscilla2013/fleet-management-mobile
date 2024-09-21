import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          headerTitle:"",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="verification-code"
        options={{
          headerShown: true,
          headerTitle:"",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: true,
          headerTitle:"",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
