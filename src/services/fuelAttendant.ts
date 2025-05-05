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

   export const confirmFuelEntry = async (data) => {
    const vendor_agent_id = await AsyncStorage.getItem("user_id");
    console.log("LOOK HERE",vendor_agent_id);
    
    const response = await API.post("trip/trip.php", {
      dataname: "attendantFuelEntry",
      vendor_agent_id,
      ...data,
    });
    return response.data;
  };
  



export const getFuelReqToBeFueledByVendor = async ({ pageParam = 1 }) => {


  const vendor_agent_id = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      vendor_agent_id,
      dataname: "getFuelReqToBeFueledByVendor",
      page: pageParam,
    });
    console.log(`Fetched to be fueled data for page ${pageParam}:`, response.data);
    
    return {
      data: response.data.data || [],
      nextPage: response.data.pagination?.current_page < response.data.pagination?.total_pages 
        ? pageParam + 1 
        : undefined,
      currentPage: pageParam,
    };
  } catch (error) {
    console.error(`Error fetching FuelReqToBeFueledByVendor page ${pageParam}:`, error);
    throw error;
  }
};

export const getReqsFueledByVendor = async ({ pageParam = 1 }) => {
  const vendor_agent_id = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      vendor_agent_id,
      dataname: "getReqsFueledByVendor",
      page: pageParam,
    });
    console.log(`Fetched fueled data for page ${pageParam}:`, response.data);
    
    return {
      data: response.data.data || [],
      nextPage: response.data.pagination?.current_page < response.data.pagination?.total_pages 
        ? pageParam + 1 
        : undefined,
      currentPage: pageParam,
    };
  } catch (error) {
    console.error(`Error fetching ReqsFueledByVendor page ${pageParam}:`, error);
    throw error;
  }
};


// This is a helper function to simulate pagination by slicing the data
// const simulatePagination = (data, pageParam, itemsPerPage = 2) => {
//   if (!data || !Array.isArray(data)) return { data: [], hasMore: false };
  
//   const startIndex = (pageParam - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const pageData = data.slice(startIndex, endIndex);
  
//   return {
//     data: pageData,
//     hasMore: endIndex < data.length
//   };
// };

// export const getFuelReqToBeFueledByVendor = async ({ pageParam = 1 }) => {
//   const vendor_agent_id = await AsyncStorage.getItem("user_id");
//   try {
//     const response = await API.post("trip/trip.php", {
//       vendor_agent_id,
//       dataname: "getFuelReqToBeFueledByVendor",
//       page: 1, // Always request page 1 to get all data
//     });
    
//     console.log(`Fetched to be fueled data:`, response.data);
    
//     // Simulate pagination with the complete dataset
//     const allData = response.data.data || [];
//     const itemsPerPage = 2; // Show only 2 items per page for testing
//     const { data: paginatedData, hasMore } = simulatePagination(allData, pageParam, itemsPerPage);
    
//     // For debugging
//     console.log(`Simulated page ${pageParam} with ${paginatedData.length} items. Has more: ${hasMore}`);
    
//     return {
//       data: paginatedData,
//       nextPage: hasMore ? pageParam + 1 : undefined,
//       currentPage: pageParam,
//     };
//   } catch (error) {
//     console.error(`Error fetching FuelReqToBeFueledByVendor page ${pageParam}:`, error);
//     throw error;
//   }
// };

// export const getReqsFueledByVendor = async ({ pageParam = 1 }) => {
//   const vendor_agent_id = await AsyncStorage.getItem("user_id");
//   try {
//     const response = await API.post("trip/trip.php", {
//       vendor_agent_id,
//       dataname: "getReqsFueledByVendor",
//       page: 1, // Always request page 1 to get all data
//     });
    
//     console.log(`Fetched fueled data:`, response.data);
    
//     // Simulate pagination with the complete dataset
//     const allData = response.data.data || [];
//     const itemsPerPage = 2; // Show only 2 items per page for testing
//     const { data: paginatedData, hasMore } = simulatePagination(allData, pageParam, itemsPerPage);
    
//     // For debugging
//     console.log(`Simulated page ${pageParam} with ${paginatedData.length} items. Has more: ${hasMore}`);
    
//     return {
//       data: paginatedData,
//       nextPage: hasMore ? pageParam + 1 : undefined,
//       currentPage: pageParam,
//     };
//   } catch (error) {
//     console.error(`Error fetching ReqsFueledByVendor page ${pageParam}:`, error);
//     throw error;
//   }
// };

