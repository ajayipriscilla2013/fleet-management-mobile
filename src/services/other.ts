import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export const getTrucks = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getTrucks",
    });
    // console.log(response.data.data);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTruck = async (id) => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getTruck",
      truck_id: id
    });
    // console.log("truck data",response.data.data);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getVendors = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getVendors",
    });
    // console.log("vendor response", response.data.vendors);

    return response.data.vendors;
  } catch (error) {
    console.log(error);
  }
};

export const getVendor = async (id) => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getVendor",
      vendor_id: id,
    });
    // console.log("single vendor data",response.data.vendor );
    return response.data.vendor
  } catch (error) {
    console.log(error);
  }
};

export const getDrivers = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getTruckDrivers",
    });
    // console.log(response.data);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCustomer = async (customerId) => {
  try {
    const response = await API.post("trip/trip.php", {
      customer_id: customerId,
      dataname: "getCustomer",
    });
    // console.log(response.data);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};


export const getDriver = async (driverId) => {
  try {
    const response = await API.post("trip/trip.php", {
      driver_id: driverId,
      dataname: "getTruckDriver",
    });
    // console.log("driver single",response.data.driver);
    return response.data.driver;
  } catch (error) {
    console.log(error);
  }
};

export const getTrips = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getTrips",
    });
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getInitiatedTrips = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getInitiatedTrips",
    });
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getInProgressTrips = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getInProgressTrips",
    });
    
  //   if (response.data.error === "Not Found") {
  //     throw new Error("No trips found");
  //  }    
  //   else {
     
  //     return response.data.data
  //   }
  return response.data.data
  } catch (error) {
    // console.error("Error fetching in-progress trips:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getCompletedTrips = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getCompletedTrips",
    });
  //   if (response.data.error === "Not Found") {
  //     throw new Error("No trips found");
  //  }    
  //   else {
     
  //     return response.data.data
  //   }
  return response.data.data
  } catch (error) {
    console.error("Error fetching completed trips:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getTripsWithClosingRequest = async () => {
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getTripsWithClosingRequest",
    });
  //   if (response.data.error === "Not Found") {
  //     throw new Error("No trips found");
  //  }    
  //   else {
     
  //     return response.data.data
  //   }
  console.log(response.data.data);
  
  return response.data.data
  
  } catch (error) {
    console.error("Error fetching trips with closing request:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const closeTrip = async (tripId) => {
  const user_id= await AsyncStorage.getItem("user_id")
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "closeTrip",
      trip_id: tripId,
      user_id
    });
  console.log(response.data.data);
  
  return response.data.data
  
  } catch (error) {
    console.error("Error fetching trips with closing request:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getSingleTrip = async (tripId) => {
  try {
    const response = await API.post("trip/trip.php", {
      trip_id: tripId,
      dataname: "getTrip",
    });
    // console.log(response.data.data);
    return response.data.data
    
  } catch (error) {
    console.log(error);
    
  }
};

//admin funcitonality
export const getLoadingPoint= async()=>{
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"getTerminalPoints"
    })
    // console.log("Loading Points:",response.data.data);
    
    return response.data.data
  } catch (error) {
    console.log(error);
    
  }
}

// export const getOffLoadingPoint= async()=>{
//   try {
//     const response = await API.post("",{
//       dataname:""
//     })
//   } catch (error) {
//     console.log(error);
    
//   }
// }

export const getProductType= async()=>{
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"getProductTypes"
    })
    // console.log("product type data",response.data.data);
    return response.data.data
  } catch (error) {
    console.log(error);
  }
}

export const getCustomers= async()=>{
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"getCustomers"
    })
    // console.log("customer data",response.data.data);
    return response.data.data
  } catch (error) {
    console.log(error);
    
  }
}


export const getFuelAttendantTripsToBeFueled= async()=>{
 const vendor_agent_id= await AsyncStorage.getItem("user_id")
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"getTripsToBeFueledByVendor",
      vendor_agent_id
    })
    // console.log("tripsToBEfUELDED",response.data.data);
    
    return response.data.data
  } catch (error) {
    console.log(error);
  }
}

export const getFuelAttendantTripsFueled= async()=>{
  const vendor_agent_id= await AsyncStorage.getItem("user_id")
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"getTripsFueledByVendor",
      vendor_agent_id
    })
    // console.log("tripsfUELDED",response.data.data);
    
    return response.data.data
  } catch (error) {
    console.log(error);
  }
}

export const getFuelRequests= async()=>{
  
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"getFuelRequests",
     
    })
   
    
    return response.data.data
  } catch (error) {
    console.log(error);
  }
}
export const requestFuel= async()=>{
  const user_id= await AsyncStorage.getItem("user_id")
  try {
    const response = await API.post("trip/trip.php",{
      dataname:"requestFuel",
     driver_id: user_id,
    })
   
      // Check response status manually
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Request failed.");
      }
  
    console.log(response.data.data.data);
    return response.data.data
    
  } catch (error) {
    // console.log(error);
    throw error.response || new Error("Network error");
  }
}

