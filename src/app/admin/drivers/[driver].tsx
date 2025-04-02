import { Image, Text, View } from "react-native";
import Avatar1 from "@/assets/images/avatar1.png";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getDriver } from "@/src/services/other";

const SkeletonLoader = () => {
  return (
    <View className="flex-1 p-6">
      {/* Skeleton for Truck Image */}
      <View className="w-full h-48 mb-4 rounded-lg bg-[#e0e0e0] animate-pulse" />

      <View className="bg-white rounded-lg p-3">
        {["Name", "Email", "Phone Number"].map((label, index) => (
          <View
            key={index}
            className="flex-row justify-between mb-1 border-b-[1px] border-[#F0F1F1] py-3"
          >
            <Text className="text-[#A5A6AB]">{label}</Text>
            {/* Skeleton for the values */}
            <View className="w-[120px] h-[16px] bg-[#e0e0e0] rounded-sm animate-pulse" />
          </View>
        ))}
      </View>
    </View>
  );
};

const TruckDriverInfo = () => {

  const{driver:driverId} = useLocalSearchParams()
 
  const { data: driverData, isLoading, isError } = useQuery({
    queryKey:["driver",driverId],
    queryFn:()=>getDriver(driverId)
  })
  const fallbackDriverImage = "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=800";
  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <>
    <SkeletonLoader />
    <Text>{isError}</Text>
      </>
    );
  }



  return (
    <View className="flex-1 p-6">
      <View className="bg-white rounded-lg p-3">
        <Image
          source={{uri:driverData?.image || fallbackDriverImage}}
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
