import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
     
      <Stack.Screen
        name="[notification]"
        options={{
          headerShown: true,
          headerTitle:"Notification Details",
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