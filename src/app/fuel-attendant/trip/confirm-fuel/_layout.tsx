
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TripLayout() {
    const router = useRouter();
  return (
    <Stack screenOptions={{ headerShown: false }}>
           <Stack.Screen name="confirm-fuel" options={{ headerShown: true ,title:"Confirm Fueling Details "}} />
    </Stack>
  );
}