import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import DropDownPicker from "react-native-dropdown-picker";
import { LOGIN_TRX } from "../query/users";
import { GET_WALLET } from "../query/wallet";
import { useNavigation } from "@react-navigation/native";
import { FilmReel, ForkKnife, CirclesFour, Bus, Invoice, HandCoins, Briefcase, Confetti } from "phosphor-react-native";




export default function App() {
  const [openCategory, setOpenCategory] = useState(false);
  const [wallet, setWallet] = useState(null);

  const navigation = useNavigation();
  // Fetch wallet data
  const { data: dataWallet, loading: loadingWallet, error: errorWallet } = useQuery(GET_WALLET);

  // Fetch transactions data based on the selected wallet
  const { data, loading, error } = useQuery(LOGIN_TRX, {
    variables: { id: wallet },
    skip: !wallet, // Skip this query if wallet is not selected
  });

  // Set wallet state when wallet data is available
  useEffect(() => {
    if (dataWallet && dataWallet.getWalletByUserLogin.length > 0) {
      setWallet(dataWallet.getWalletByUserLogin[0]._id);
    }
  }, [dataWallet]);

  if (loadingWallet || !wallet) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  if (errorWallet || error) {
    return <Text style={styles.errorText}>An error occurred. Please try again later.</Text>;
  }

  // Ensure data is defined before accessing it
  const transactions = data?.userLoginTrxAll?.result || [];
  const total = data?.userLoginTrxAll?.wallet?.total || 0;
  const totalIncome = data?.userLoginTrxAll?.income.reduce((acc, el) => acc + el.nominal, 0) || 0;
  const totalExpense = data?.userLoginTrxAll?.expense.reduce((acc, el) => acc + el.nominal, 0) || 0;

  const renderTransaction = ({ item }) => (
    <View style={styles.transaction}>
      <View style={styles.categorySquare}>
        {item.category.toLowerCase() === 'entertainment' ? (
          <FilmReel size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'f&b' ? (
          <ForkKnife size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'other' ? (
          <CirclesFour size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'transport' ? (
          <Bus size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'bills & utilities' ? (
          <Invoice size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'allowance' ? (
          <HandCoins size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'salary' ? (
          <Briefcase size={32} color="#1D1D1D" weight="fill" />
        ) : item.category.toLowerCase() === 'bonus' ? (
          <Confetti size={32} color="#1D1D1D" weight="fill" />
        ) : (
          <MaterialCommunityIcons name={item.icon} size={32} color="#1D1D1D" />
        )}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.note}</Text>
      </View>
      <Text style={[
        styles.amount,
        item.nominal > 0 ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Math.abs(item.nominal))}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Account</Text>
            <DropDownPicker
              open={openCategory}
              setOpen={setOpenCategory}
              value={wallet}
              setValue={setWallet}
              items={dataWallet?.getWalletByUserLogin.map(el => ({
                label: el.name,
                value: el._id,
              })) || []}
              placeholder="Personal"
              containerStyle={{
                borderColor: "transparent",
                borderWidth: 0,
                padding: 0,
                width: 150, 
                zIndex: 100,
                
              }}
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                borderWidth: 0,
                padding: 0,
                zIndex: 100,
                marginLeft: -10,
                marginTop: -10,
              }}
              textStyle={{
                color: "black",
                fontSize: 21,
                fontFamily: 'Clash-Display-Semibold',
              }}
              labelStyle={{
                color: "#CFB1FB",
                fontFamily: 'Clash-Display-Semibold',
              }}
              arrowIconStyle={{
                tintColor: "#CFB1FB",
                marginLeft: -20,
              }}
              tickIconStyle={{
                tintColor: "#CFB1FB",
              }}
              dropDownContainerStyle={{
                backgroundColor: "#CFB1FB",
                borderColor: "black",
                marginTop: -10,
              }}
            />
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              onPress={() => navigation.navigate("AddWallet")}
              name="plus" size={24} color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.overallBalance}>
          <View style={styles.balanceContent}>
            <Image
              source={require('../assets/money-planting.png')}
              style={styles.balanceIcon}
              resizeMode="contain"
            />
            <View style={styles.balanceTextContainer}>
              <Text style={styles.balanceText}>Total balance</Text>
              <Text style={styles.balanceAmount}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(total)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.incomeExpense}>
          <View style={styles.incomeBox}>
            <View style={styles.incomeExpenseHeader}>
              <Image source={require('../assets/wallet-add.png')} style={styles.incomeExpenseIcon} />
              <Text style={styles.incomeExpenseLabel}>Income total</Text>
            </View>
            <Text style={styles.incomeExpenseAmount}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalIncome)}
            </Text>
          </View>
          <View style={styles.expenseBox}>
            <View style={styles.incomeExpenseHeader}>
              <Image source={require('../assets/wallet-remove.png')} style={styles.incomeExpenseIcon} />
              <Text style={styles.incomeExpenseLabel}>Expense total</Text>
            </View>
            <Text style={styles.incomeExpenseAmount}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalExpense)}
            </Text>
          </View>
        </View>
        <View>

          <Text style={styles.transactionsTitle}>Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item._id}
            style={styles.transactionsList}
            contentContainerStyle= {{paddingBottom: 220}}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#1D1D1D",
    paddingHorizontal: 7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "column", 
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    fontFamily: 'Clash-Display-Medium',
    letterSpacing: 1.5,
  },
  oa: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 5,
    color: "#fff",
  },
  overallBalance: {
    backgroundColor: "#D9FF3D",
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    borderColor: "#000",
    borderWidth: 2,
    height: 150, 
    justifyContent: 'center', 
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  balanceIcon: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceText: {
    fontSize: 16,
    color: "#1D1D1D",
    fontFamily: 'Clash-Display-Medium',
    paddingBottom: 5,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: 'Clash-Display-Semibold',
    letterSpacing: 1.5,
    color: "#1D1D1D",
  },
  incomeExpense: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  incomeBox: {
    flex: 1,
    backgroundColor: "black",
    marginRight: 5,
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseBox: {
    flex: 1,
    backgroundColor: "black",
    marginLeft: 5,
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeExpenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  incomeExpenseIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  incomeExpenseLabel: {
    fontSize: 14,
    color: "#fff",
    fontFamily: 'Clash-Display-Medium',
    letterSpacing: 1,
  },
  incomeExpenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Changed to white
    fontFamily: 'Clash-Display-Bold',
    letterSpacing: 1,
    marginTop: 5,
    textAlign: 'center',
  },
  incomeAmount: {
    color: "#2BBF5D",
  },
  expenseAmount: {
    color: "#FF5E54",
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Clash-Display-Medium',
    color: "#fff",
    letterSpacing: 1.5,
    paddingBottom: 10,
  },
  transactionsList: {
    marginTop:5,
    marginBottom: 150,
    fontFamily: 'Clash-Display-Semibold',
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  categorySquare: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'Clash-Display-Semibold',
    color: "#fff",
    letterSpacing: 1,
  },
  description: {
    color: "#777",
  },
  amount: {
    fontWeight: "bold",
    fontFamily: 'Clash-Display-Semibold',
  },
  seeAllButton: {
    backgroundColor: "#D9FF3D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  seeAllButtonText: {
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});