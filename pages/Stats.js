import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import { PieChart } from "react-native-svg-charts";
import { GET_STATS, GET_STATS_INCOME, GET_WALLET } from "../query/wallet";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CaretLeft, CaretRight } from "phosphor-react-native";

const Stats = () => {
    const [isExpense, setIsExpense] = useState(true);
    const [nilai, setNilai] = useState(0);
    const [openCategory, setOpenCategory] = useState(false);
    const {
        data: dataWallet,
        loading: loadingWallet,
        error: errorWallet,
    } = useQuery(GET_WALLET);

    if (loadingWallet) {
        // return (
        //     // <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        // );
    }
    const [wallet, setWallet] = useState(dataWallet.getWalletByUserLogin[0]._id);
    //   console.log(dataWallet);

    // const month = new Date();
    const month = new Date("2024-01-01T00:00:00.000Z");

    month.setMonth(new Date().getMonth() + nilai);

    // Handle swipe gestures
    const handleGestureEvent = ({ nativeEvent }) => {
        // console.log(month, "llll"); 

        if (nativeEvent.state === State.END) {
            if (nativeEvent.translationX > 50) {
                setNilai((prev) => prev - 1);
            } else if (nativeEvent.translationX < -50) {
                setNilai((prev) => prev + 1);
            }
        }
    };
    //   console.log(month);

    const {
        data: stats,
        loading: loadingStats,
        error: errorStats,
    } = useQuery(GET_STATS, {
        variables: { getStatsByDateAndWalletIdId: wallet, date: month },
        skip: !wallet, // Skip this query if wallet is not selected
    });

    const {
        data: statsIncome,
        loading: loadingStatsIncome,
        error: errorStatsIncome,
    } = useQuery(GET_STATS_INCOME, {
        variables: { getStatsByDateAndWalletIdIncomeId: wallet, date: month },
        skip: !wallet, // Skip this query if wallet is not selected
    });

    if (loadingStats || loadingStatsIncome) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            </View>
        );
    }
    //   console.log(stats, "ooooooooo");
    const data = [
        { key: 1, value: 700, svg: { fill: "#FF6384" } },
        { key: 2, value: 4300, svg: { fill: "#36A2EB" } },
    ];

    const categoryColors = [
        "#D6FF65", "#CFB1FB", "#FF6384", "#36A2EB", "#FFCE56",
        "#4BC0C0", "#9966FF", "#FF9F40", "#8CB126", "#FF6384"
    ];

    const getColorForIndex = (index) => categoryColors[index % categoryColors.length];

    const processData = (data) => {
        return data.map((el, idx) => ({
            ...el,
            color: getColorForIndex(idx),
            value: Math.abs(el.totalAmount)
        }));
    };

    const expenseData = processData(stats?.getStatsByDateAndWalletId || []);
    const incomeData = processData(statsIncome?.getStatsByDateAndWalletIdIncome || []);

    const datapie = isExpense ? expenseData : incomeData;

    return (
       
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.accountSection}>
                    <Text style={styles.headerTitle}>Account</Text>
                    <DropDownPicker
                        open={openCategory}
                        setOpen={setOpenCategory}
                        value={wallet}
                        setValue={setWallet}
                        items={
                            dataWallet?.getWalletByUserLogin.map((el, idx) => ({
                                key: idx + 1,
                                label: el.name,
                                value: el._id,
                            })) || []
                        }
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
                            tintColor: "black",
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: "#CFB1FB",
                            borderColor: "black",
                            marginTop: -10,
                        }}
                    />
                </View>
                <View style={styles.dateStrip}>
                    <TouchableOpacity onPress={() => setNilai(prev => prev - 1)} style={styles.arrowButton}>
                        <CaretLeft size={24} color="#000" weight="bold" />
                    </TouchableOpacity>
                    <View style={styles.dateContainer}>
                        <Text style={styles.monthText}>
                            {month.toLocaleString("default", { month: "short" })}{" "}
                            {month.getFullYear()}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setNilai(prev => prev + 1)} style={styles.arrowButton}>
                        <CaretRight size={24} color="#000" weight="bold" />
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
                <PanGestureHandler onHandlerStateChange={handleGestureEvent}>
                    <View style={styles.content}>
                        <PieChart
                            style={styles.pieChart}
                            data={datapie.map(item => ({
                                key: item._id,
                                value: item.value,
                                svg: { fill: item.color }
                            }))}
                            outerRadius={"100%"}
                            innerRadius={"50%"}
                        />

                        <View style={styles.expenseBreakdown}>
                            {datapie.map((item, index) => (
                                <View key={index} style={styles.categoryItem}>
                                    <Text style={[styles.breakdownText, { color: item.color }]}>{item._id}</Text>
                                    <Text style={styles.amountText}>
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(item.totalAmount)}
                                        </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </PanGestureHandler>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1D1D1D',
    },
    container: {
        flex: 1,
        backgroundColor: '#1D1D1D',
    },
    accountSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        zIndex: 1000,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: 'Clash-Display-Medium',
        letterSpacing: 1.5,
    },
    dropdownContainer: {
        width: 150,
        borderColor: "transparent",
        borderWidth: 0,
        padding: 0,
        zIndex: 100,
    },
    dropdown: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        padding: 0,
        zIndex: 100,
        marginLeft: -10,
        marginTop: -10,
    },
    dropdownText: {
        color: "black",
        fontSize: 21,
        fontFamily: 'Clash-Display-Semibold',
    },
    dropdownLabel: {
        color: "black",
        fontFamily: 'Clash-Display-Semibold',
    },
    dropdownArrow: {
        tintColor: "black",
        marginLeft: -20,
    },
    dropdownTick: {
        tintColor: "black",
    },
    dateStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderRadius: 10    ,
        paddingHorizontal: 16,
        marginBottom: 20,
        marginHorizontal: 16,
    },
    arrowButton: {
        padding: 8,
    },
    dateContainer: {
        flex: 1,
        alignItems: 'center',
    },
    monthText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Clash-Display-Semibold",
    },
    toggleText: {
        fontSize: 16,
        color: "#777",
    },
    financialSummary: {
        alignItems: "center",
        marginBottom: 20,
    },
    incomeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    expensesText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6384",
        marginTop: 5,
    },
    pieChart: {
        height: 150,
        width: 150,
        marginBottom: 50,
        alignSelf: 'center',
    },
    expenseBreakdown: {
        alignItems: "center",
        fontFamily: 'Clash-Display-Semibold',

    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 16,
    },
    breakdownText: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: 'Clash-Display-Semibold',
        letterSpacing: 1.5,
    },
    amountText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        fontFamily: 'Clash-Display-Semibold',
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 50,

    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginRight: 10,
        fontFamily: 'Clash-Display-Medium',
        letterSpacing: 1.5,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#d1ff00",
    },
    tabText: {
        color: "#FFFFFF",
        fontSize: 21,
        fontFamily: "Clash-Display-Bold",
    },
    activeTabText: {
        color: "#D6FF65",
        fontWeight: "bold",
        fontSize: 21,
    },
});

export default Stats;