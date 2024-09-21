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

export const getOffLoadingPoint= async()=>{
  try {
    const response = await API.post("",{
      dataname:""
    })
  } catch (error) {
    console.log(error);
    
  }
}

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



