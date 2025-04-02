// import TabLayout from "../(tabs)/_layout";

// const CustomerLayout = () => {
//     return <TabLayout />; 
//   };
  
//   export default CustomerLayout;

import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Svg, Path, G, Defs, Rect, ClipPath } from "react-native-svg";
import ProtectedRoute from "@/src/components/ProtectedRoute";


const HomeIcon = ({ fill = "#394F91", width = 25, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
    <G clipPath="url(#clip0_296_2373)">
      <Path
        d="M21.3603 8.36985L14.4303 2.82985C13.3603 1.96985 11.6303 1.96985 10.5703 2.81985L3.64027 8.36985C2.86027 8.98985 2.36027 10.2998 2.53027 11.2798L3.86027 19.2398C4.10027 20.6598 5.46027 21.8098 6.90027 21.8098H18.1003C19.5303 21.8098 20.9003 20.6498 21.1403 19.2398L22.4703 11.2798C22.6303 10.2998 22.1303 8.98985 21.3603 8.36985ZM12.5003 15.4998C11.1203 15.4998 10.0003 14.3798 10.0003 12.9998C10.0003 11.6198 11.1203 10.4998 12.5003 10.4998C13.8803 10.4998 15.0003 11.6198 15.0003 12.9998C15.0003 14.3798 13.8803 15.4998 12.5003 15.4998Z"
        fill={fill}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_296_2373">
        <Rect width="24" height="24" fill="white" transform="translate(0.5)" />
      </ClipPath>
    </Defs>
  </Svg>
);

const ProfileIcon = ({ fill = "", width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M22 12C22 6.49 17.51 2 12 2C6.49 2 2 6.49 2 12C2 14.9 3.25 17.51 5.23 19.34C5.23 19.35 5.23 19.35 5.22 19.36C5.32 19.46 5.44 19.54 5.54 19.63C5.6 19.68 5.65 19.73 5.71 19.77C5.89 19.92 6.09 20.06 6.28 20.2C6.35 20.25 6.41 20.29 6.48 20.34C6.67 20.47 6.87 20.59 7.08 20.7C7.15 20.74 7.23 20.79 7.3 20.83C7.5 20.94 7.71 21.04 7.93 21.13C8.01 21.17 8.09 21.21 8.17 21.24C8.39 21.33 8.61 21.41 8.83 21.48C8.91 21.51 8.99 21.54 9.07 21.56C9.31 21.63 9.55 21.69 9.79 21.75C9.86 21.77 9.93 21.79 10.01 21.8C10.29 21.86 10.57 21.9 10.86 21.93C10.9 21.93 10.94 21.94 10.98 21.95C11.32 21.98 11.66 22 12 22C12.34 22 12.68 21.98 13.01 21.95C13.05 21.95 13.09 21.94 13.13 21.93C13.42 21.9 13.7 21.86 13.98 21.8C14.05 21.79 14.12 21.76 14.2 21.75C14.44 21.69 14.69 21.64 14.92 21.56C15 21.53 15.08 21.5 15.16 21.48C15.38 21.4 15.61 21.33 15.82 21.24C15.9 21.21 15.98 21.17 16.06 21.13C16.27 21.04 16.48 20.94 16.69 20.83C16.77 20.79 16.84 20.74 16.91 20.7C17.11 20.58 17.31 20.47 17.51 20.34C17.58 20.3 17.64 20.25 17.71 20.2C17.91 20.06 18.1 19.92 18.28 19.77C18.34 19.72 18.39 19.67 18.45 19.63C18.56 19.54 18.67 19.45 18.77 19.36C18.77 19.35 18.77 19.35 18.76 19.34C20.75 17.51 22 14.9 22 12ZM16.94 16.97C14.23 15.15 9.79 15.15 7.06 16.97C6.62 17.26 6.26 17.6 5.96 17.97C4.44 16.43 3.5 14.32 3.5 12C3.5 7.31 7.31 3.5 12 3.5C16.69 3.5 20.5 7.31 20.5 12C20.5 14.32 19.56 16.43 18.04 17.97C17.75 17.6 17.38 17.26 16.94 16.97Z" fill={fill} />
    <Path d="M12 6.93018C9.93 6.93018 8.25 8.61018 8.25 10.6802C8.25 12.7102 9.84 14.3602 11.95 14.4202C11.98 14.4202 12.02 14.4202 12.04 14.4202C12.06 14.4202 12.09 14.4202 12.11 14.4202C12.12 14.4202 12.13 14.4202 12.13 14.4202C14.15 14.3502 15.74 12.7102 15.75 10.6802C15.75 8.61018 14.07 6.93018 12 6.93018Z" fill={fill} />
  </Svg>
);

const NotificationIcon=({ fill = "#000", width = 24, height = 24 })=>(
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M19.34 14.49L18.34 12.83C18.13 12.46 17.94 11.76 17.94 11.35V8.82C17.94 6.47 16.56 4.44 14.57 3.49C14.05 2.57 13.09 2 11.99 2C10.9 2 9.92 2.59 9.4 3.52C7.45 4.49 6.1 6.5 6.1 8.82V11.35C6.1 11.76 5.91 12.46 5.7 12.82L4.69 14.49C4.29 15.16 4.2 15.9 4.45 16.58C4.69 17.25 5.26 17.77 6 18.02C7.94 18.68 9.98 19 12.02 19C14.06 19 16.1 18.68 18.04 18.03C18.74 17.8 19.28 17.27 19.54 16.58C19.8 15.89 19.73 15.13 19.34 14.49Z"  fill={fill}/>
<Path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill={fill}/>
</Svg>
)

const TruckIcon=({ fill = "#000", width = 24, height = 24 })=>(
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M14 2.92V11.23C14 12.25 13.17 13.08 12.15 13.08H3C2.45 13.08 2 12.63 2 12.08V5.69C2 3.65 3.65 2 5.69 2H13.07C13.59 2 14 2.41 14 2.92Z" fill={fill}/>
<Path d="M21.5 15.5C21.78 15.5 22 15.72 22 16V17C22 18.66 20.66 20 19 20C19 18.35 17.65 17 16 17C14.35 17 13 18.35 13 20H11C11 18.35 9.65 17 8 17C6.35 17 5 18.35 5 20C3.34 20 2 18.66 2 17V15C2 14.45 2.45 14 3 14H12.5C13.88 14 15 12.88 15 11.5V6C15 5.45 15.45 5 16 5H16.84C17.56 5 18.22 5.39 18.58 6.01L19.22 7.13C19.31 7.29 19.19 7.5 19 7.5C17.62 7.5 16.5 8.62 16.5 10V13C16.5 14.38 17.62 15.5 19 15.5H21.5Z" fill={fill}/>
<Path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" fill={fill}/>
<Path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" fill={fill}/>
<Path d="M22 12.53V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L21.74 11.54C21.91 11.84 22 12.18 22 12.53Z" fill={fill}/>
</Svg>

)



const  CustomerLayout =() => {
  return (
    <ProtectedRoute role="customer">
    <Tabs screenOptions={{ tabBarShowLabel: true, headerShown: true ,tabBarActiveTintColor: '#394F91', // Active tab color (e.g., green)
      tabBarInactiveTintColor: '#999999'}}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <HomeIcon fill={color} width={24} height={24}/>
          ),
          title: "Home",
          headerShown:false
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          tabBarIcon: ({ color }) => (
            <TruckIcon fill={color}   />
          ),
          title: "Trip",
          headerShown:false
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          tabBarIcon: ({ color }) => (
            <NotificationIcon fill={color}   />
          ),
          title: "Notification",
          headerShown:false
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileIcon fill={color}   />
          ),
          title: "Account",
          headerShown:false
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          href: null, // This prevents it from appearing in tabs
          headerShown:false
        }}
      />
       <Tabs.Screen
        name="trucks"
        options={{
          href: null, // This prevents it from appearing in tabs
          headerShown:false
        }}
      />
       <Tabs.Screen
        name="vendors"
        options={{
          href: null, // This prevents it from appearing in tabs
          headerShown:false
        }}
      />
    </Tabs>
    </ProtectedRoute>
  );
};

export default CustomerLayout