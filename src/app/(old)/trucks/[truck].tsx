import { Image, Text, View } from "react-native";
import TruckImg from "@/assets/images/truck.png";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getTruck } from "@/src/services/other";

const Truck = () => {
  const { truck:truckId  } = useLocalSearchParams();
  console.log(truckId);

  const fallbackTruckImage = "https://images.pexels.com/photos/188679/pexels-photo-188679.jpeg?auto=compress&cs=tinysrgb&w=800";


  const { data: truckData, isLoading, isError } = useQuery({
    queryKey: ["truck", truckId], 
     queryFn:() => getTruck(truckId) 
   });


  return (
    <View className="flex-1 p-6">
      <Image source={{uri: truckData?.image || fallbackTruckImage}} className="w-full h-48 mb-4 rounded-lg" />

      <View className="bg-white rounded-lg p-3">
        {[
          { label: "Truck Name", value: truckData?.model },
          { label: "Plate Number", value: truckData?.plate_number },
          { label: "Status", value: truckData?.status },
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

export default Truck;
