import { Redirect } from "expo-router";

const Home = () => {
  return <Redirect href="/(auth)/signin" />;
  // return <Redirect href="/home" />;
};

export default Home;
