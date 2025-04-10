import { Image, Text, View } from "react-native";
import FuelStation from "@/assets/images/fuelStation.png"
import { useQuery } from "@tanstack/react-query";
import { getVendor } from "@/src/services/other";
import { useLocalSearchParams } from "expo-router";

const SkeletonLoader = () => {
  return (
    <View className="flex-1 p-6">
      {/* Skeleton for Truck Image */}
      <View className="w-full h-48 mb-4 rounded-lg bg-[#e0e0e0]" />

      <View className="bg-white rounded-lg p-3">
        {["Name", "Location", "Phone Number"].map((label, index) => (
          <View
            key={index}
            className="flex-row justify-between mb-1 border-b-[1px] border-[#F0F1F1] py-3"
          >
            <Text className="text-[#A5A6AB]">{label}</Text>
            {/* Skeleton for the values */}
            <View className="w-[120px] h-[16px] bg-[#e0e0e0] rounded-sm" />
          </View>
        ))}
      </View>
    </View>
  );
};

const FillingStation = () => {
  const { id  } = useLocalSearchParams();
  console.log(id);

  const fallbackVendorImage = "https://images.pexels.com/photos/18335589/pexels-photo-18335589/free-photo-of-view-of-a-petrol-station-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=800";

  
  const { data: vendorData, isLoading, isError } = useQuery({
   queryKey: ["vendor", id], 
    queryFn:() => getVendor(id) 
  });

  if (isLoading) {
    return <SkeletonLoader />;
  }

    return (
      <View className="flex-1 p-6">
       
        <Image
          source={{uri:vendorData?.image || fallbackVendorImage}}
          className="w-full h-48 mb-4 rounded-lg"
        />

        <View className="bg-white rounded-lg p-3">



        {[
                { label: "Name", value: vendorData?.name },
                { label: "Location", value: vendorData?.address },
                { label: "Phone Number", value: vendorData?.phone_no },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between mb-1   border-b-[1px] border-[#F0F1F1] py-3"
                >
                  <Text className="text-[#A5A6AB]">{item.label}</Text>
                  <Text
                    className={"font-semibold "}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
            </View>


        
        // <Text className="text-lg mb-2">Name: NNPC Filling Station</Text>
        // <Text className="text-lg mb-2">Location: Airport Road, Abuja</Text>
        // <Text className="text-lg">Date: Sep 1, 2024</Text>
    //   </View>
    );
  };

  export default FillingStation