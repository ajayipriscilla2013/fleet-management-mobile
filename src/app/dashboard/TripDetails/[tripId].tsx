import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { SafeAreaView, Text } from "react-native";

export default function Page() {
  const { slug } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Trip Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              <Text className="text-xl font-bold mb-4">Trip Information</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-6">
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Trip ID:</Text>
                <Text>12345</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Destination:</Text>
                <Text>Abuja</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Departure Time:</Text>
                <Text>10:00 AM</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Load Quantity:</Text>
                <Text>5000 kg</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Truck and Driver Assigned */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              <Text className="text-xl font-bold mb-4">
                Truck and Driver Assigned
              </Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-6">
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Truck License Plate:</Text>
                <Text>ABC-1234</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Truck Make:</Text>
                <Text>MAN TGX</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between">
                <Text className="font-semibold">Driver Name:</Text>
                <Text>John Doe</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Fuel Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              <Text className="text-xl font-bold mb-4">Fuel Information</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View>
              <View className="mb-2 flex flex-row justify-between ">
                <Text className="font-semibold">Current Fuel Level:</Text>
                <Text>75%</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between ">
                <Text className="font-semibold">
                  Recommended Fuel Quantity:
                </Text>
                <Text>150 Litres</Text>
              </View>
              <View className="mb-2 flex flex-row justify-between ">
                <Text className="font-semibold">Nearest Fuel Station:</Text>
                <Text>Shell Station, Mile 2</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
