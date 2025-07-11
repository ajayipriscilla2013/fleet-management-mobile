import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from "expo-router";

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useFocusEffect(() => {
    if (!loading && isMounted) {
      if (!user) {
        router.replace("/signin");
      } else if (role && user.user_role !== role) {
        router.replace("/unauthorized");
      }
    }
  });

  if (!isMounted || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/signin" />;
  if (role && user.user_role !== role) return <Redirect href="/unauthorized" />;

  return children;
};

export default ProtectedRoute;