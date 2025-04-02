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
          title: "Customers",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Back/>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[customer]"
        options={{
          headerShown: true,
          title: "Customer Information",
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
