import { Stack, useRouter } from "expo-router";
import { Button, TouchableOpacity } from "react-native";
import Back from "@/assets/svgs/Back.svg"

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
     
      <Stack.Screen
        name="CustomerTripDetailsScreen"
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
        name="loadingPoint"
        options={{
          headerShown: true,
          headerTitle:"Loading Point",
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
            <Back/>
          </TouchableOpacity>
          ),
        }}
      />

<Stack.Screen
        name="offLoadingPoint"
        options={{
          headerShown: true,
          headerTitle:"Offloading Point",
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