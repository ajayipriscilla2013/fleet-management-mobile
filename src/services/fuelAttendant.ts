import AsyncStorage from "@react-native-async-storage/async-storage"
import API from "./api"

export const getFuelAttendantTripDetails= async(trip_id)=>{
  
     try {
       const response = await API.post("trip/trip.php",{
         dataname:"getTripDetailsForVendor",
         trip_id
       })
       // console.log("tripsToBEfUELDED",response.data.data);
       
       return response.data.data
     } catch (error) {
       
     }
   }