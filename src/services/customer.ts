import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export const getInitiatedTripsforCustomer= async({ pageParam = 1 })=>{
    const customer_id= await AsyncStorage.getItem("user_id")
    try {
      const response = await API.post("trip/trip.php",{
        dataname:"getInitiatedTripForCustomer",
        customer_id,
        page: pageParam,
      })
      console.log("initiatedTripsCustomer",response.data.data);
      
      return {
        data: response.data.data || [],
        nextPage: response.data.pagination?.current_page < response.data.pagination?.total_pages 
          ? pageParam + 1 
          : undefined,
        currentPage: pageParam,
      };
    } catch (error) {
      
    }
  }
  
  export const getInProgressTripsforCustomer= async({ pageParam = 1 })=>{
    const customer_id= await AsyncStorage.getItem("user_id")
    try {
      const response = await API.post("trip/trip.php",{
        dataname:"getInProTripForCustomer",
        customer_id,
        page: pageParam,
      })
      console.log("inProgressTripsCustomer",response.data.data);
      
      return {
        data: response.data.data || [],
        nextPage: response.data.pagination?.current_page < response.data.pagination?.total_pages 
          ? pageParam + 1 
          : undefined,
        currentPage: pageParam,
      };
    } catch (error) {
      
    }
  }
  
  export const getCompletedTripsforCustomer= async({ pageParam = 1 })=>{
    const customer_id= await AsyncStorage.getItem("user_id")
    try {
      const response = await API.post("trip/trip.php",{
        dataname:"getCompletedTripForCustomer",
        customer_id,
        page: pageParam,
      })
      console.log("CompletedTripsCustomer",response.data.data);
      
      return {
        data: response.data.data || [],
        nextPage: response.data.pagination?.current_page < response.data.pagination?.total_pages 
          ? pageParam + 1 
          : undefined,
        currentPage: pageParam,
      };
    } catch (error) {
      
    }
  }

  export const getTripDetailsforCustomer= async(tripId)=>{
    // const customer_id= await AsyncStorage.getItem("user_id")
    try {
      const response = await API.post("trip/trip.php",{
        dataname:"getTripDetailsForCustomer",
        trip_id:tripId
      })
      console.log("TripDetailsForCustomerr",response.data.data);
      
      return response.data.data
    } catch (error) {
      
    }
  }
  
  
  