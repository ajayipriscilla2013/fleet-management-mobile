import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Drivers",
          headerBackTitle: "Back",
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
