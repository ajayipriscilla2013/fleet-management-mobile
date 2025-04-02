import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Drivers",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back/>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[driver]"
        options={{
          headerShown: true,
          title: "Truck Driver Information",
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
