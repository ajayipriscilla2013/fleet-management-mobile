import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export const getCompletedTripsForDriver = async () => {
  const userId = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getCompletedTripForDriver",
      driver_id: userId,
    });
    //   if (response.data.error === "Not Found") {
    //     throw new Error("No trips found");
    //  }
    //   else {

    //     return response.data.data
    //   }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching completed trips for Driver:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getInitiatedTripsForDriver = async () => {
  const userId = await AsyncStorage.getItem("user_id");
  console.log(userId);

  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getInitiatedTripForDriver",
      driver_id: userId,
    });
    //   if (response.data.error === "Not Found") {
    //     throw new Error("No trips found");
    //  }
    //   else {

    //     return response.data.data
    //   }

    // console.log("api response:", response.data);
    return response.data.data;
    // return response.data.data
  } catch (error) {
    console.error("Error fetching initiated trips for driver:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getInProgressTripsForDriver = async () => {
  const userId = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getInProgressTripForDriver",
      driver_id: userId,
    });
    //   if (response.data.error === "Not Found") {
    //     throw new Error("No trips found");
    //  }
    //   else {

    //     return response.data.data
    //   }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching InProgress trips:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const getTripDetailsForDriver = async (trip_id) => {
  const userId = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      dataname: "getTripDetailsForDriver",
      trip_id,
    });
    //   if (response.data.error === "Not Found") {
    //     throw new Error("No trips found");
    //  }
    //   else {

    //     return response.data.data
    //   }
    console.log("tripdetails for driver",response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching InProgress trips:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const DriverRequestToCloseTrip = async (tripId) => {
  const driverId = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      trip_id: tripId,
      driver_id: driverId,
      dataname: "createTripClosingRequest",
    });
    console.log(response);
    
    return response.data.data
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export const getFuelRequestStatus = async () => {
  const driverId = await AsyncStorage.getItem("user_id");
  try {
    const response = await API.post("trip/trip.php", {
      driver_id: driverId,
      dataname: "getFuelRequestStatus"
    });
    
    
    return response.data
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};
