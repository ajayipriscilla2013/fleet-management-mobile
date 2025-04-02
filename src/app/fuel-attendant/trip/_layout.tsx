
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TripLayout() {
    const router = useRouter();
  return (
    <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[tripId]" options={{ headerShown: true ,title:"Trip Details" ,headerBackTitle: "Back",
          }} 
          />
           <Stack.Screen name="confirm-fuel" options={{ headerShown: true ,title:"Confirm Fueling Details "}} />
        

      {/* 
        This <Stack> will render the nested screens: 
        - index.tsx (Trip List)
        - create.tsx (Create Trip)
        - [tripId].tsx (Trip Details)
      */}
    </Stack>
  );
}