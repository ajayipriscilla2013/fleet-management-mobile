import { Image, Text, View } from "react-native";
import Avatar1 from "@/assets/images/avatar1.png";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getDriver } from "@/src/services/other";

const TruckDriverInfo = () => {

  const{driver:driverId} = useLocalSearchParams()
 
  const { data: driverData, isLoading, isError } = useQuery({
    queryKey:["driver",driverId],
    queryFn:()=>getDriver(driverId)
  })

  return (
    <View className="flex-1 p-6">
      <View className="bg-white rounded-lg p-3">
        <Image
          source={Avatar1}
          className="w-24 h-24 rounded-full mx-auto mb-4 items-center"
        />
        {[
          { label: "Name", value: driverData?.driver_name },
          { label: "Email", value: driverData?.driver_email },
          { label: "Phone Number", value: driverData?.driver_phone },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between mb-1   border-b-[1px] border-[#F0F1F1] py-3"
          >
            <Text className="text-[#A5A6AB]">{item.label}</Text>
            <Text className={"font-semibold "}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TruckDriverInfo;