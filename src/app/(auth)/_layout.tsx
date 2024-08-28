import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: true }} />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          headerLeft: () => (
            <Button title="< Back" onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
