// app/(admin)/trip/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TripLayout() {
    const router = useRouter();
  return (
    <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[tripId]" options={{ headerShown: true ,title:"Trip Details" ,headerBackTitle: "Back",
        //   headerLeft: () => (
        //     <TouchableOpacity onPress={() => router.back()}>
        //     {/* <Back/> */}
        //     <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
        //   </TouchableOpacity>
        //   )
          }} 
          />
        <Stack.Screen name="create" options={{ headerShown: true ,title:"Create Trip "}} />
        <Stack.Screen name="fuel-confirmation" options={{ headerShown: true ,title:"Confrim Fuel Request"}} />

      {/* 
        This <Stack> will render the nested screens: 
        - index.tsx (Trip List)
        - create.tsx (Create Trip)
        - [tripId].tsx (Trip Details)
      */}
    </Stack>
  );
}