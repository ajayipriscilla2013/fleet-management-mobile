import { Image, Text, TouchableOpacity, View } from "react-native";
import Globe from "@/assets/svgs/globe.svg"
import ArrowRight from "@/assets/svgs/arrow-right2.svg"

const AboutScreen = () => (
    <View className="flex-1 bg-[#F9F9F9] p-4">
     
      
      <View className="mb-6">
        <Image
          source={require('../../../assets/images/Logo2.png')}
          className="w-16 h-16 mb-4"
        />
        <Text className="text-base text-gray-500 mb-3">
          The Charissatics Fleet Management System is an innovative mobile application designed to
          revolutionize fleet management processes for transportation companies.
        </Text>
      </View>
     
      <TouchableOpacity className="flex-row justify-between rounded-xl bg-white py-2 px-4 items-center mb-4">
        <View className="flex-row gap-4 items-center">
        <Globe/>
        <Text className="text-base">Privacy Policy</Text>

        </View>
       < ArrowRight/>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between rounded-xl bg-white py-2 px-4 items-center mb-4">
        <View className="flex-row gap-4 items-center">
        <Globe/>
        <Text className="text-base">Terms & Conditions</Text>

        </View>
        < ArrowRight/>
      </TouchableOpacity>
      
      <View className="mt-8">
        <Text className="text-sm text-center text-[#394F91]">Version 0.0.1</Text>
        <Text className="text-sm text-center text-[#A5A6AB]">© 2024 Charissatics. All Rights Reserved.</Text>
      </View>
    </View>
  );

  export default AboutScreen