import React, { useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../query/users";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ navigation }) {
  const { setIsSignedIn } = useContext(AuthContext);
  const [loginFn, { data, loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");

  return (
    <SafeAreaView style={{flex:1}}  >

    <View style={styles.container}>
      <Text style={styles.title}>Hello again!</Text>

      {isError && <Text style={styles.errorText}>Error: {isError}</Text>}
      <Text style={styles.label}>Email / Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email / username"
        placeholderTextColor="#a3a3a3"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#a3a3a3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonLoading]}
        onPress={async () => {
          try {
            const result = await loginFn({
              variables: { username, password },
            });
            
            await SecureStore.setItemAsync(
              "access_token",
              result.data.login.accessToken
            );
            
            setIsSignedIn(true);
          } catch (error) {
            setIsError(error.message);
          }
        }}
      >
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>I don't have an account</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 34,
    backgroundColor: "#1D1D1D",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontFamily: 'Clash-Display-Bold',
    letterSpacing:1.5,
    marginBottom: 150,
    marginTop: 50,
    textAlign: "center",
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Clash-Display-SemiBold',
    letterSpacing:1.5,
  },
  input: {
    height: 50,
    borderColor: "#dcdcdc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  button: {
    height: 50,
    backgroundColor: "#CFB1FB", 
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonLoading: {
    backgroundColor: "#6dd400",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 21,
    fontFamily: 'Clash-Display-Bold',
    letterSpacing:2,

  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  signupContainer: {
    flex: 1,
    gap:10,
    alignItems: "center",
    flexDirection: "col",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#ffffff",
    fontFamily: 'Clash-Display-SemiBold',
    letterSpacing:1,
    fontSize: 16,
  },
  signupLink: {
    color: "#ffffff", 
    letterSpacing: 1,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'Clash-Display-Bold',
    textDecorationLine: 'underline',
  },
});
