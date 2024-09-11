import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TRX } from "../query/trx";
import { GET_STATS, GET_STATS_INCOME, GET_WALLET } from "../query/wallet";
import { LOGIN_TRX } from "../query/users";
import { ArrowLeft } from "phosphor-react-native"; // Add this import

const Calculator = ({ onAmountChange }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [firstValue, setFirstValue] = useState('');

  const handleNumberInput = (num) => {
    if (displayValue === '0') {
      setDisplayValue(num.toString());
    } else {
      setDisplayValue(displayValue + num.toString());
    }
    onAmountChange(displayValue + num.toString());
  };

  const handleOperator = (op) => {
    setFirstValue(displayValue);
    setDisplayValue('0');
    setOperator(op);
  };

  const handleEqual = () => {
    const first = parseFloat(firstValue);
    const second = parseFloat(displayValue);
    let result;

    switch (operator) {
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '*':
        result = first * second;
        break;
      case '/':
        result = first / second;
        break;
      default:
        return;
    }

    setDisplayValue(result.toString());
    onAmountChange(result.toString());
    setOperator(null);
    setFirstValue('');
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
    onAmountChange('0');
  };

  const renderButton = (content, onPress) => (
    <TouchableOpacity style={styles.calcButton} onPress={onPress}>
      <Text style={styles.calcButtonText}>{content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.calculatorContainer}>
      <View style={styles.display}>
        <Text style={styles.displayText}>Rp,  {displayValue}</Text>
      </View>
      <View style={styles.buttonRow}>
        {renderButton('7', () => handleNumberInput(7))}
        {renderButton('8', () => handleNumberInput(8))}
        {renderButton('9', () => handleNumberInput(9))}
        {renderButton('+', () => handleOperator('+'))}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('4', () => handleNumberInput(4))}
        {renderButton('5', () => handleNumberInput(5))}
        {renderButton('6', () => handleNumberInput(6))}
        {renderButton('-', () => handleOperator('-'))}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('1', () => handleNumberInput(1))}
        {renderButton('2', () => handleNumberInput(2))}
        {renderButton('3', () => handleNumberInput(3))}
        {renderButton('*', () => handleOperator('*'))}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('C', handleClear)}
        {renderButton('0', () => handleNumberInput(0))}
        {renderButton('=', handleEqual)}
        {renderButton('/', () => handleOperator('/'))}
      </View>
    </View>
  );
};

export default function CreateTrx({ navigation }) {
  const [isExpense, setIsExpense] = useState(true);
  const [account, setAccount] = useState(null);
  const [category, setCategory] = useState(null);
  const [openAccount, setOpenAccount] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState('0');

  const [addTrx, { data, loading, error }] = useMutation(ADD_TRX, { refetchQueries: [LOGIN_TRX, GET_WALLET, GET_STATS, GET_STATS_INCOME] })
  const { data: dataWallet, loading: loadingWallet, error: errorWallet } = useQuery(GET_WALLET);

  if (loadingWallet) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  if (errorWallet || error) {
    return <Text style={styles.errorText}>An error occurred. Please try again later. di sini</Text>;
  }

  // console.log(dataWallet, "ADA KAGASIHHHHH");

  const handleAdd = async () => {
    // isExpense? setAmount(Number(amount)) : setAmount(Number(amount))
    // console.log(amount, "<<<APAKAH JADINYA???????");
    // console.log(amount*-1, "<<<SETELAH");
    try {
      // console.log(amount, account, isExpense, category, note, date, "INPUTANNN");
      const form = {
        nominal: Number(amount),
        walletId: account || dataWallet.getWalletByUserLogin[0]._id,
        type: isExpense ? "expense" : "income",
        category: category,
        note: note,
        inputDate: date
      }
      // console.log(form, "<<<<<<<<<<");
      const result = await addTrx({
        variables: {
          form
        }
      })
      setCategory(null)
      setNote("")
      navigation.navigate("Home")
      handleClear()
    // setOperator(null)
    // setFirstValue('')
    // onAmountChange('0')
    } catch (error) {
      console.log(error);
    }
  }


  const formatCurrency = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (value) => {
    let formattedValue = value.replace(/[^0-9]/g, "");
    formattedValue = formatCurrency(formattedValue);
    setAmount(isExpense ? `-${formattedValue}` : formattedValue);
  };

  const openDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const openTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleTimeConfirm = (selectedTime) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  const formatDate = (date) => format(date, "dd MMM, yyyy").toUpperCase();
  const formatTime = (time) => format(time, "HH:mm").toUpperCase();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setIsExpense(false)}
          style={[styles.tab, !isExpense && styles.activeTab]}
        >
          <Text style={[styles.tabText, !isExpense && styles.activeTabText]}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsExpense(true)}
          style={[styles.tab, isExpense && styles.activeTab]}
        >
          <Text style={[styles.tabText, isExpense && styles.activeTabText]}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      <DropDownPicker
        open={openAccount}
        setOpen={setOpenAccount}
        value={account}
        setValue={setAccount}
        items={dataWallet.getWalletByUserLogin.map(wallet => ({
          label: wallet.name,
          value: wallet._id
        }))}
        placeholder="ACCOUNT"
        containerStyle={styles.dropdownFirst}
        style={{
          backgroundColor: "#CFB1FB",
          height: 45,
          justifyContent: 'center',
          fontFamily: 'Clash-Display-Bold',
        }}
        dropDownContainerStyle={{ backgroundColor: "#CFB1FB" }}
        labelStyle={(labelProps) => ({
          fontWeight: 'bold',
          color: labelProps.isPlaceholder ? '#999' : '#000',
          fontFamily: 'System',
          fontSize: 20,
          textAlign: 'center',
          textTransform: 'uppercase',
          fontFamily: 'Clash-Display-Bold',
        })}
        listItemLabelStyle={{
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 20,
          textTransform: 'uppercase',
          fontFamily: 'Clash-Display-Bold',
        }}
        textStyle={{
          fontWeight: 'bold',
          fontFamily: 'System',
          textAlign: 'center',
          fontSize: 20,
          textTransform: 'uppercase',
          fontFamily: 'Clash-Display-Bold',
        }}
      />

      <DropDownPicker
        open={openCategory}
        setOpen={setOpenCategory}
        value={category}
        setValue={setCategory}
        items={
          isExpense
            ? [
              { label: "ENTERTAINMENT", value: "Entertainment" },
              { label: "F&B", value: "F&B" },
              { label: "BILLS & UTILITIES", value: "Bills & Utilities" },
              { label: "TRANSPORT", value: "Transport" },
              { label: "OTHER", value: "Other" },
            ]
            : [
              { label: "ALLOWANCE", value: "Allowance" },
              { label: "SALARY", value: "Salary" },
              { label: "BONUS", value: "Bonus" },
              { label: "OTHER", value: "Other" },
            ]
        }
        placeholder="CATEGORY"
        containerStyle={styles.dropdown}
        style={{
          backgroundColor: "#D6FF65",
          height: 45,
          justifyContent: 'center',
        }}
        dropDownContainerStyle={{ backgroundColor: "#D6FF65" }}
        labelStyle={(labelProps) => ({
          fontWeight: 'bold',
          color: labelProps.isPlaceholder ? '#999' : '#000',
          fontFamily: 'System',
          fontSize: 20,
          textAlign: 'center',
          textTransform: 'uppercase',
          fontFamily: 'Clash-Display-Bold',
        })}
        listItemLabelStyle={{
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 20,
          textTransform: 'uppercase',
          fontFamily: 'Clash-Display-Bold',
        }}
        textStyle={{
          fontWeight: 'bold',
          fontFamily: 'System',
          textAlign: 'center',
          fontSize: 20,
          textTransform: 'uppercase',
          fontFamily: 'Clash-Display-Bold',
        }}
      />

      <View style={styles.componentSize}>
        <TouchableOpacity style={styles.dateTimePicker} onPress={openDatePicker}>
          <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <TextInput
        placeholder="NOTE"
        style={[styles.textArea, styles.componentSize]}
        value={note}
        onChangeText={setNote}
        multiline
        placeholderTextColor="#999"
      />
      {/* <View style={styles.nominalContainer}>
        <Text style={styles.currencyText}>Rp.</Text>
        <Text style={styles.nominalText}>{amount}</Text>
      </View> */}

      <Calculator onAmountChange={setAmount} />

      <TouchableOpacity
        style={[styles.submitButton, styles.componentSize]}
        onPress={() => {
          handleAdd()
        }}
      >
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={renderContent}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.scrollViewContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D1D",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontFamily: 'Clash-Display-Bold',
    marginLeft: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#d1ff00",
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontFamily: 'Clash-Display-Bold',
    letterSpacing: 1.5,
  },
  activeTabText: {
    color: "#D6FF65",
    fontWeight: "bold",
    fontSize: 21,
  },
  dropdownFirst: {
    marginBottom: 15,
    zIndex: 100,
  },
  dropdown: {
    marginBottom: 15,
    zIndex: 10,
  },
  dateTimeContainer: {

    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateTimePicker: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    textTransform: 'uppercase',
    fontFamily: 'Clash-Display-Semibold',
  },
  datePicker: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    marginHorizontal: "auto",
    width: "100%",
    marginBottom: 15,
  },
  textArea: {
    padding: 10,
    backgroundColor: "#FAFAFA",
    textAlignVertical: "top",
    borderRadius: 4,
    fontFamily: 'Clash-Display-Semibold',
    fontSize: 16,
  },
  calculatorContainer: {
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  display: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
  },
  displayText: {
    fontSize: 24,
    textAlign: 'right',
    fontFamily: 'Clash-Display-Semibold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calcButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    width: '23%',
    alignItems: 'center',
  },
  calcButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Clash-Display-Semibold',
  },
  componentSize: {
    height: 50,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#D6FF65',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Clash-Display-Semibold',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
});