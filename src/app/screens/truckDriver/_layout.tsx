import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
     
      <Stack.Screen
        name="[DriverTripDetails]"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle:"Trip Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="DriverTrips"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerTitle:"Trip Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
       <Stack.Screen
        name="getFuel"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
       <Stack.Screen
        name="confirmLoading"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />
       <Stack.Screen
        name="ConfirmOffloading"
        options={{
          headerShown: true,
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