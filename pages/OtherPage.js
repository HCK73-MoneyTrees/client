import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/auth";
import * as SecureStore from "expo-secure-store";
import client from "../config/apollo";
import { useMutation, useQuery } from "@apollo/client";
import {
  ACC_INVITATION,
  DEC_INVITATION,
  INVITATION_WALLET,
  GET_WALLET,
} from "../query/wallet";

const Invitation = ({ username, walletName, onAccept, onDecline }) => (
  <View style={styles.invitationContainer}>
    <Text style={styles.invitationText}>
      You have been invited to{" "}
      <Text style={styles.walletName}>{walletName}</Text> wallet by{" "}
      <Text style={styles.walletName}>@{username}</Text>.
    </Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.acceptButton]}
        onPress={onAccept}
      >
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.declineButton]}
        onPress={onDecline}
      >
        <Text style={styles.buttonText}>Decline</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function OtherPage({ navigation }) {
  const { setIsSignedIn } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery(INVITATION_WALLET);
  const [accInv] = useMutation(ACC_INVITATION, {
    refetchQueries: [INVITATION_WALLET, GET_WALLET],
  });
  const [decInv] = useMutation(DEC_INVITATION, {
    refetchQueries: [INVITATION_WALLET, GET_WALLET],
  });

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
    await client.clearStore();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleAcc = async (params) => {
    const form = { walletId: params };
    await accInv({ variables: { form } });
  };

  const handleDec = async (params) => {
    const form = { walletId: params };
    await decInv({ variables: { form } });
  };

  const renderNotifications = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#D9FF3D" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>An error occurred. Please try again.</Text>
      ) : data?.getInvitedWalletByUserLogin.length > 0 ? (
        data.getInvitedWalletByUserLogin.map((el) => (
          <Invitation
            key={el._id}
            username={el.result.username}
            walletName={el.name}
            onAccept={() => handleAcc(el._id)}
            onDecline={() => handleDec(el._id)}
          />
        ))
      ) : (
        <View style={styles.noInvitationContainer}>
          <Text style={styles.noInvitationText}>There are no invitations</Text>
        </View>
      )}
    </View>
  );

  const renderUserData = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>User Profile</Text>
      <View style={styles.userDataContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>johndoe@example.com</Text>
          <Text style={styles.userBio}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
      >
        {renderNotifications()}
        {renderUserData()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D1D",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    fontFamily: 'Clash-Display-Medium',
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  logoutButton: {
    backgroundColor: '#D9FF3D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Clash-Display-Semibold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  sectionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Clash-Display-Medium',
    letterSpacing: 1.5,
  },
  userDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Clash-Display-Semibold',
  },
  userEmail: {
    color: '#D9FF3D',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Clash-Display-Medium',
  },
  userBio: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Clash-Display-Regular',
  },
  // ... add other styles from Notification.js ...
  invitationContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  invitationText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    fontFamily: "Clash-Display-Semibold",
  },
  walletName: {
    fontWeight: "bold",
    color: "#D9FF3D",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: "#D6FF65",
  },
  declineButton: {
    backgroundColor: "#D6FF65",
  },
  buttonText: {
    color: "#1D1D1D",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Clash-Display-Semibold",
    letterSpacing: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF3D3D",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Clash-Display-Semibold",
  },
  noInvitationContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  noInvitationText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Clash-Display-Semibold",
  },
});