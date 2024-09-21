import { Image, Text, View } from "react-native";
import FuelStation from "@/assets/images/fuelStation.png"

const Notification = () => {
    return (
      <View className="flex-1 p-6">



<View className="bg-white rounded-lg p-4 mb-6 ">
<Text className="text-lg font-semibold mb-2 border-b-[1px] border-[#F0F1F1]">Fuel Information</Text>
{[
  { label: 'Fuel Vendor', value: 'Mobil Filling Station' },
  { label: 'Location', value: 'Airport Road, Abuja' },
  { label: 'Status', value: 'To be Fueled', color: 'text-yellow-600' },
  { label: 'Date', value: 'Sep 1, 2024' },
 
].map((item, index) => (
  <View key={index} className="flex-row justify-between mb-1  border-b-[1px] border-[#F0F1F1] py-3">
    <Text className="text-[#A5A6AB]">{item.label}</Text>
    <Text className={item.color || 'font-semibold'}>{item.value}</Text>
  </View>
))}
</View>
        </View>
    
    );
  };

  export default Notification