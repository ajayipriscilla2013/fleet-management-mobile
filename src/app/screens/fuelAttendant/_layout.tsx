import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
     
      <Stack.Screen
        name="tripDetails"
        options={{
          headerShown: true,
          headerTitle:"Trip Details",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />

<Stack.Screen
        name="confirmFuel"
        options={{
          headerShown: true,
          headerTitle:"Confirm Fuel Information",
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