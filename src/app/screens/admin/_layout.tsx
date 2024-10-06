import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"
import Ionicons from '@expo/vector-icons/Ionicons';

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
     
      <Stack.Screen
        name="[AdminTripDetailsScreen]"
        options={{
          headerShown: true,
          headerTitle:"Trip Details",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            {/* <Back/> */}
            <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AssignTruckDriver"
        options={{
          headerShown: true,
          headerTitle:"Assign TruckDriver",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            {/* <Back/> */}
            <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="createTrip"
        options={{
          headerShown: true,
          headerTitle:"Create Trip",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            {/* <Back/> */}
            <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          ),
        }}
      />
       <Stack.Screen
        name="AssignVendorToTrip"
        options={{
          headerShown: true,
          headerTitle:"Assign Vendor to Trip",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            {/* <Back/> */}
            <Ionicons name="chevron-back-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          ),
        }}
      />
    
    </Stack>
  );
};

export default Layout;