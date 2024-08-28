import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
export default () => {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: true, headerShown: true }}>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color="black" />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="Trip"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="truck" size={24} color="black" />
          ),
          title: "Trip",
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bell" size={24} color="black" />
          ),
          title: "Notification",
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color="black" />
          ),
          title: "Account",
        }}
      />
    </Tabs>
  );
};
