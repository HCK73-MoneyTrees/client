import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import { SafeAreaView } from "react-native-safe-area-context";

const REGISTER_MUTATION = gql`
  mutation Register($form: UserForm!) {
    register(form: $form) {
      _id
      name
      username
      email
    }
  }
`;

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    try {
      const { data } = await register({
        variables: {
          form: {
            name,
            username,
            email,
            password,
          },
        },
      });
      console.log('Registration successful:', data);
      navigation.navigate('Login'); 
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Registration failed', err.message);
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#a3a3a3"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#a3a3a3"
          value={username}
          onChangeText={setUsername}
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#a3a3a3"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#a3a3a3"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonLoading]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 34,
    backgroundColor: "#1D1D1D",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontFamily: 'Clash-Display-Bold',
    letterSpacing: 1.5,
    marginBottom: 50,
    marginTop: 50,
    textAlign: "center",
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Clash-Display-SemiBold',
    letterSpacing: 1.5,
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
    backgroundColor: "#D6FF65",
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
    letterSpacing: 2,
  },
  loginContainer: {
    flex: 1,
    gap: 10,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#ffffff",
    fontFamily: 'Clash-Display-SemiBold',
    letterSpacing: 1,
    fontSize: 16,
  },
  loginLink: {
    color: "#ffffff",
    letterSpacing: 1,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'Clash-Display-Bold',
    textDecorationLine: 'underline',
  },
});

export default Register;
