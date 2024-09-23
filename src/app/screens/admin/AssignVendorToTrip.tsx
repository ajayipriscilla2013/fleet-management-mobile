// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
// import Camera from "@/assets/svgs/Camera.svg"
// import Tick from "@/assets/svgs/tick.svg"
// import SuccessIcon from "@/assets/images/success.png"
// import { router } from 'expo-router';
// import Picker from 'react-native-picker-select';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API from '@/src/services/api';


// const AssignTruckDriverScreen = () => {
//   const handlePress = (path) => {
//     router.push(path);
//   };

//   const [formData, setFormData] = useState({
//     producttype_id: "",
//     loading_point: "",
//     offloading_point: "",
//     customer_id: "",
//     is_customer_confirmation_required: "0",
//     loading_qty: "",
//     start_date: new Date(),
//     end_date: new Date(),
//     user_id: "fma1000",
//   });

//   const [drivers, setDrivers] = useState([]);
//   const [trips, setTrips] = useState([]);

//   const fetchDrivers = async () => {
//     try {
//       const response = await API.post("trip/trip.php", {
//         dataname: "getTruckDrivers",
//       });
//       console.log("Drivers fetched:", response.data);
//       setDrivers(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching truck Drivers:", error);
//       // Alert.alert("Error", "Failed to fetch truck drivers");
//     }
//   };

//   const fetchTrips = async () => {
//     try {
//       const user_id = await AsyncStorage.getItem("user_id");
//       const response = await API.post("trip/trip.php", {
//         dataname: "getTrips",
//         user_id,
//       });
//       setTrips(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching trips:", error);
//       // Alert.alert("Error", "Failed to fetch trips");
//     }
//   };

//   useEffect(() => {
//     fetchDrivers();
//     fetchTrips();
//   }, []);

//   return (
//     <ScrollView className="flex-1 bg-[#F9F9F9] px-6 pt-6">
//        {/* Step Indicator */}
//        <View className="flex-row justify-between items-center mb-4">
//         <View className="items-center">
//           <View className="w-6 h-6 bg-[#394F91] rounded-full justify-center items-center">
//             <Tick/>
//           </View>
//           <Text className="text-sm font-semibold mt-1 ">Trip Information</Text>
//           <Text className="text-xs text-gray-400">Setup Trip Information</Text>
//         </View>
//         <View className="h-1 bg-gray-200 flex-1 mx-2" />
//         <View className="items-center">
//           <View className="w-6 h-6 bg-gray-200 border border-[#394F91] rounded-full items-center justify-center" >
//             <View className="w-3 h-3 bg-[#394F91] rounded-full"/>
//           </View>
//           <Text className="text-sm font-semibold mt-1 text-[#394F91]">Assign Truck/Drivers</Text>
//           <Text className="text-xs text-gray-400">Setup Fuel Information</Text>
//         </View>
//       </View>

//       <View>
//         <Text className="text-gray-600 mb-[10px]">Truck Driver</Text>
//         <View
//           className="mb-4 bg-white"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//           <Picker
//             selectedValue={formData?.producttype_id}
//             // onValueChange={(itemValue) =>
//             //   setFormData({ ...formData, producttype_id: itemValue })
//             // }
//           >
//             <Picker.Item label="Select Product Type" value="" />
//             {drivers?.map((type) => (
//               <Picker.Item key={type.id} label={type.name} value={type.id} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       <View>
//         <Text className="text-gray-600 mb-[10px]">Trips</Text>
//         <View
//           className="mb-4 bg-white"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//           <Picker
//             selectedValue={formData?.producttype_id}
//             // onValueChange={(itemValue) =>
//             //   setFormData({ ...formData, producttype_id: itemValue })
//             // }
//           >
//             <Picker.Item label="Select Trip" value="" />
//             {drivers?.map((type) => (
//               <Picker.Item key={type.id} label={type.name} value={type.id} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       <View>
//         <Text className="text-gray-600 mb-[10px]">Fueling ?</Text>
//         <View
//           className="mb-4 bg-white"
//           style={{
//             borderWidth: 1,
//             borderColor: "#C4CCF0",
//             borderRadius: 8,
//             paddingVertical: 2,
//             // paddingHorizontal: 10,
//           }}
//         >
//           <Picker
//             selectedValue={formData?.producttype_id}
//             // onValueChange={(itemValue) =>
//             //   setFormData({ ...formData, producttype_id: itemValue })
//             // }
//           >
//             <Picker.Item label="Fueling" value="" />
//             <Picker.Item label="Yes" value="1" />
    
//           </Picker>
//         </View>
//       </View>

//       {/* {[
//         { label: 'Truck Driver', value: 'Jimoh Sunday' },
//         { label: 'Assign Truck', placeholder: 'Assign Truck' },
//         { label: 'Loading Point', placeholder: 'Select Loading point' },
//         { label: 'Plate Number', placeholder: 'Enter Plate Number' },
//         { label: 'Truck Model', placeholder: 'Enter Truck Model' },
//         { label: 'Getting Fuel?', placeholder: 'Yes' },
//         { label: 'Vendors', placeholder: 'Select vendor' },
//       ].map((item, index) => (
//         <View key={index} className="mb-4">
//           <Text className="text-gray-600 mb-[10px]">{item.label}</Text>
//           <TextInput
//             className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border  border-[#C4CCF0] rounded-md p-2 h-[60px]"
//             placeholder={item.placeholder}
//             value={item.value}
//           />
//         </View>
//       ))} */}

// <Dialog>
//   <DialogTrigger>
//   <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" >
//         <Text className="text-white text-center font-semibold">Submit</Text>
//       </TouchableOpacity>
//   </DialogTrigger>
//   <DialogContent className="h-[343px] pt-12 w-[343px]">
//     <View className="flex gap-4 mx-auto ">
//       <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
//           <Image source={SuccessIcon}/>
//       </View>
//       <Text className="font-semibold text-center text-xl  text-[#394F91]">Trip Created Successfully 🚀</Text>
//       <Text className="text-primary">
//       You have successfully created your trip
//       </Text>
//       <TouchableOpacity
//           className="bg-[#394F91] p-4  rounded-lg mb-4"
//           onPress={()=> handlePress("/(admin)/Trip")}
//         >
//           <Text className="text-white text-center font-semibold">Continue</Text>
//         </TouchableOpacity>
//     </View>
//   </DialogContent>
// </Dialog>

      
//     </ScrollView>
//   );
// };

// export default AssignTruckDriverScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Alert } from 'react-native';
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import Camera from "@/assets/svgs/Camera.svg"
import Tick from "@/assets/svgs/tick.svg"
import SuccessIcon from "@/assets/images/success.png"
import { router } from 'expo-router';
import Picker from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/src/services/api';

const AssignVendorScreen = ({onAssignVendor}) => {
  const handlePress = (path) => {
    router.push(path);
  };

  
  
  const [formData, setFormData] = useState({
    vendor_id: "",
    trip_id: "",
    role:""
  });

  const [vendors, setVendors] = useState([]);
  const [trips, setTrips] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await API.post("trip/trip.php", {
        dataname: "getVendors",
      });
      console.log("Vendors fetched:", response.data);
      const formattedVendors = response.data.vendors.map(vendor => ({
        label: `${vendor.name} ${vendor.vendor_type_name
        }`,
        value: vendor.id
      }));
      setVendors(formattedVendors);
    } catch (error) {
      console.error("Error fetching Vendors:", error);
    }
  };

  const fetchTrips = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "getTrips",
        user_id,
      });
      console.log("Trips fetched:", response.data);
      const formattedTrips = response.data.data.map(trip => ({
        label: `Trip ${trip.id} - ${trip.loading_point} to ${trip.offloading_point}`,
        // label: `Trip ${trip.trip_id} `,
        value: trip.trip_id
      }));
      setTrips(formattedTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchTrips();
  }, []);

  const handleSubmit = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      const response = await API.post("trip/trip.php", {
        dataname: "assignVendorToTrip",
        ...formData,
        user_id,
      });
      console.log("Assignment successful:", response.data);
      if(response.data.error==="success"){
        Alert.alert(
            "Assignment Successful",
            "The Vendor has been successfully assigned to the trip!"
          );
          router.push("/(admin)/Trip")
          
      }
    } catch (error) {
      console.error("Error assigning Vendor:", error);
      Alert.alert(
        "Assignment UnSuccessful",
        `Error assigning Vendor! ${error?.message}`
      );
    }
  };

  const handleTest =()=>{
    console.log("being clicked");
    
    
  }

  return (
   <>

      <View>
        <Text className="text-gray-600 mb-[10px]">Trips</Text>
        <View className="mb-4 bg-white border border-[#C4CCF0] rounded-lg">
          <Picker
            value={formData.trip_id}
            onValueChange={(value) => setFormData({ ...formData, trip_id: value })}
            items={trips}
            placeholder={{ label: "Select Trip", value: null }}
          />
        </View>
      </View>

      <View>
        <Text className="text-gray-600 mb-[10px]">Vendor</Text>
        <View className="mb-4 bg-white border border-[#C4CCF0] rounded-lg">
          <Picker
            value={formData.vendor_id}
            onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
            items={vendors}
            placeholder={{ label: "Select Vendor", value: null }}
          />
        </View>
      </View>

     
 
    <View className="mb-4">
         <Text className="text-gray-600 mb-[10px]">Description</Text>
      <TextInput
        placeholder="Provide a Description"
        keyboardType="default"
        value={formData.role}
        onChangeText={(text) => setFormData({ ...formData, role: text })}
        className="shadow-[0px 1px 2px rgba(16,24,40,0.05)] border bg-white  border-[#C4CCF0] rounded-md p-2 h-[60px]"
      />
      </View>

      <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" onPress={handleSubmit}>
            <Text className="text-white text-center font-semibold">Submit</Text>
          </TouchableOpacity>

       {/* Success Modal */}
 <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View  className="flex-1 justify-center items-center bg-[rgba(0, 0, 0, 0.5)] gap-4  ">
            <View className='m-5 bg-white rounded-2xl p-9 items-center ' style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5
            }}>          
            <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
              <Image source={SuccessIcon}/>
            </View>
            <Text className="font-semibold text-center text-xl  text-[#394F91]">Assignment Successful 🚀</Text>
            <Text className="text-primary">
              You have successfully assigned a Vendor to Trip
            </Text>
            <TouchableOpacity
              className="bg-[#394F91] p-4  rounded-lg mb-4"
              onPress={() =>  setModalVisible(!modalVisible)}
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
            </View>
          </View>
          
        </Modal>

      {/* <Dialog>
        <DialogTrigger>
          <TouchableOpacity className="bg-[#394F91] rounded-2xl p-4 mt-6" onPress={handleSubmit}>
            <Text className="text-white text-center font-semibold">Submit</Text>
          </TouchableOpacity>
        </DialogTrigger>
        <DialogContent className="h-[343px] pt-12 w-[343px]">
          <View className="flex gap-4 mx-auto ">
            <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px]">
              <Image source={SuccessIcon}/>
            </View>
            <Text className="font-semibold text-center text-xl  text-[#394F91]">Assignment Successful 🚀</Text>
            <Text className="text-primary">
              You have successfully assigned a truck driver to the trip
            </Text>
            <TouchableOpacity
              className="bg-[#394F91] p-4  rounded-lg mb-4"
              onPress={() => handlePress("/(admin)/Trip")}
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog> */}
      </>

  );
};

export default AssignVendorScreen;