import { Stack } from "expo-router";
import { Button } from "react-native";
import { useRouter } from "expo-router";
const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="CreateTrip"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          title: " Create Trip",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="AssignTruck"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          title: "Assign Trucks",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="CloseTrip"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          title: "End Trips",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="TripDetails/index"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          title: "Created Trips",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="TripDetails/[tripId]"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          title: "Trip Details",
          // headerLeft: () => (
          //   <Button title="< Back" onPress={() => router.back()} />
          // ),
        }}
      />
      <Stack.Screen
        name="FuelManagement"
        options={{
          headerShown: true,
          title: "Fuel Management",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="TripProgress"
        options={{
          headerShown: true,
          title: "Trip Progress",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
      <Stack.Screen
        name="CreatedTrips"
        options={{
          headerShown: true,
          title: "Created Trips",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
