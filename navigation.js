import * as SecureStore from "expo-secure-store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/auth";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./pages/Login";
import HomeScreen from "./pages/Home";
// import CreatePost from "./pages/CreatePost";
// import DetailPost from "./pages/DetailPost";
import Register from "./pages/Register";
// import SearchUser from "./pages/SearchUser";  // Create this page
// import UserProfile from "./pages/UserProfile"; // Create this page
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import CreateTrx from "./pages/CreateTrx";
// import Statistic from "./pages/Statistic";
import { Bell, ChartPie, HouseSimple, PlusCircle, DotsThreeCircle } from "phosphor-react-native";
import AddWallet from "./pages/CreateWallet";
import Stats from "./pages/Stats";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Notification from "./pages/Notification";
import client from "./config/apollo";
import OtherPage from "./pages/OtherPage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainTab() {
  const { setIsSignedIn } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#1D1D1D' },
        tabBarActiveTintColor: '#D6FF65',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarLabelStyle: { fontSize: 12, fontFamily: 'Clash-Display-Semibold', textTransform: 'uppercase', },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <HouseSimple size={24} color={color} weight={focused ? "fill" : "regular"} />
          )
        }}
      />
      <Tab.Screen
        name="Statistic"
        component={Stats}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <ChartPie size={24} color={color} weight={focused ? "fill" : "regular"} />
          )
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={CreateTrx}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <PlusCircle size={24} color={color} weight={focused ? "fill" : "regular"} />
          )
        }}
      />
      <Tab.Screen name="Other" component={OtherPage } options={{
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => (
          <DotsThreeCircle size={24} color={color} weight={focused ? "fill" : "regular"} />
        )
      }}/>
      {/* <Tab.Screen name="Statistic" component={Statistic} options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => (<ChartPie size={24} color={color} weight={focused ? "fill" : "regular"} />) }} /> */}
      {/* <Tab.Screen name="Profile" component={UserProfile} options={{
        tabBarIcon:({color,size})=>(<Ionicons name="person-outline" size={24} color={color} />),
        headerRight: () => (
          <Pressable
            onPress={async () => {
              await SecureStore.deleteItemAsync("access_token");
              setIsSignedIn(false);
            }}
            // style={{ backgroundColor: 'red', padding: 12 }}
          >
            <Text style={{ color: 'red', marginRight:15 }}>Logout</Text>
          </Pressable>
        )
      }}/> */}
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { setIsSignedIn } = useContext(AuthContext);
  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    SecureStore.getItemAsync("access_token").then((r) => {
      if (r) {
        setIsSignedIn(true);
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen name="Main" component={MainTab} options={{ headerShown: false }} />
              <Stack.Screen name="AddWallet" component={AddWallet}
                options={{
                  headerShown: false,
                  // tabBarIcon: ({ color, size }) => (<Ionicons name="person-outline" size={24} color="black" />),
                  // headerRight: () => (
                  //   <Pressable
                  //     onPress={async () => {
                  //       await SecureStore.deleteItemAsync("access_token");
                  //       setIsSignedIn(false);
                  //       await client.clearStore()
                  //     }}
                  //   // style={{ backgroundColor: 'red', padding: 12 }}
                  //   >
                  //     <Text style={{ color: 'red', marginRight: 15 }}>Logout</Text>
                  //   </Pressable>
                  // )
                }}
              />
            </>
            // <Text>pppp</Text>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}