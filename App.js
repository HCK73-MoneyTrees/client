import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./pages/Home";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import DetailPost from "./pages/DetailPost";
import AuthProvider from "./context/auth";
import Navigation from "./navigation";
const Stack = createNativeStackNavigator();
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from "expo-font";
import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [loaded, error] = useFonts({
    'Clash-Display-Bold': require('./assets/fonts/ClashDisplay-Bold.otf'),
    'Clash-Display-Regular': require('./assets/fonts/ClashDisplay-Regular.otf'),
    'Clash-Display-Semibold': require('./assets/fonts/ClashDisplay-Semibold.otf'),
    'Clash-Display-Medium': require('./assets/fonts/ClashDisplay-Medium.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.preventAutoHideAsync();
    }
  }, [loaded, error]);
  return (

    <AuthProvider>
      <ApolloProvider client={client}>
          <Navigation />

        {/* <NavigationContainer> */}
        {/* <Stack.Navigator>
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name="CreatePost"
            component={CreatePost}
            options={{ headerShown: false }}
            />
            <Stack.Screen name="Post" component={DetailPost} />
            </Stack.Navigator> */}
        {/* </NavigationContainer> */}
      </ApolloProvider>
    </AuthProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
