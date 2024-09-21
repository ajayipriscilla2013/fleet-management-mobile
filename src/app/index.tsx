import { Redirect } from "expo-router";

const Home = () => {
  // return <Redirect href="/screens/admin/createTrip" />;
  return <Redirect href="/(auth)/signin" />;
  // return <Redirect href="/dashboard/TripProgress" />;
  
};

export default Home;
