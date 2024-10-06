import { Image, Text, View } from "react-native";
import Avatar1 from "@/assets/images/avatar1.png";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getDriver } from "@/src/services/other";

const ProductInfo = () => {

  const fallbackProductImage = "https://cdn.pixabay.com/photo/2022/04/24/16/01/beach-7153932_1280.jpg";

  const{product:productId} = useLocalSearchParams()
  console.log();
  
 
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey:["product",productId],
    queryFn:()=>getDriver(productId)
  })

  return (
    <View className="flex-1 p-6">
      <View className="bg-white rounded-lg p-3">
        <Image
          source={{uri:productsData?.image || fallbackProductImage}}
          className="w-24 h-24 rounded-full mx-auto mb-4 items-center"
        />
        {[
          { label: "Name", value: productsData?.name },
          { label: "Email", value: productsData?.created_at },
          { label: "Phone Number", value: productsData?.updated_at },
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

export default ProductInfo;
