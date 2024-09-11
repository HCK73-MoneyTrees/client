import { useLazyQuery, useMutation } from "@apollo/client";
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
    ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ADD_WALLET, GET_WALLET } from "../query/wallet";
import { SEARCH_USER } from "../query/users";
import { ArrowLeft, MagnifyingGlass } from "phosphor-react-native";

export default function AddWallet({ navigation }) {

    const [type, setType] = useState(null);
    const [openCategory, setOpenCategory] = useState(false);
    const [name, setName] = useState("");
    const [keywords, setKeywords] = useState("")
    const [inviteList, setInviteList] = useState([])
    const [addWallet, { loading, error }] = useMutation(ADD_WALLET, { refetchQueries: [GET_WALLET] })
    const [searchFn, { data: dataSearch, loading: loadingSearch, error: errorSearch }] = useLazyQuery(SEARCH_USER)

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>An error occurred. Please try again later. di sini</Text>;
    }

    const handleAddWallet = async () => {
        try {
            // console.log(amount, account, isExpense, category, note, date, "INPUTANNN");
            console.log(inviteList, "SEBELUM NAAVIGATE");
            const form = {
                name: name,
                type: type,
                userId: inviteList
            }
            console.log("AAAAAAAAA");
            console.log(form, "<<<<<<<<<< FORM INVITE");
            const result = await addWallet({
                variables: {
                    form
                }
            })
            setName("");
            setType(null);
            setInviteList([]);
            setKeywords("");
            navigation.navigate("Home")
        } catch (error) {
            console.log(error);
        }
    }

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
            <View style={styles.header}>
                <Text style={[styles.purpleTitle, { color: "#CFB1FB" }]}>ADD WALLET</Text>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        handleAddWallet()
                    }}
                >
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="WALLET NAME"
                style={styles.textArea}
                value={name}
                onChangeText={setName}
                multiline
            />

            <DropDownPicker
                open={openCategory}
                setOpen={setOpenCategory}
                value={type}
                setValue={setType}
                items={
                    [
                        { label: "PERSONAL", value: "Personal" },
                        { label: "GROUP", value: "Group" }
                    ]

                }
                placeholder="TYPE"
                containerStyle={styles.dropdown}
                style={{
                    backgroundColor: "#D9FF3D",
                    height: 45,
                    justifyContent: 'center',
                }}
                dropDownContainerStyle={{ backgroundColor: "#D9FF3D" }}
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

            {type === "Group" && (
                <>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5
                        }}
                    >
                        <TextInput
                            placeholder={`Search by name / username`}
                            value={keywords}
                            style={{
                                backgroundColor: "#f2f2f2",
                                padding: 10,
                                borderRadius: 5,
                                width: "100%",
                                flex: 10,
                                height: 45
                            }}
                            onChangeText={setKeywords}
                        />
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    // console.log(keywords, "<<<KEYWORD MASUUK");
                                    const result = await searchFn({
                                        variables: {
                                            keywords: keywords
                                        }
                                    })
                                    // console.log(result, "<<<<DATA SEARCHH");
                                } catch (error) {
                                    console.log(error, "error search<<<<");
                                }
                            }}
                            style={{
                                backgroundColor: "#fff",
                                height: 45,
                                justifyContent: "center",
                                padding: 5,
                                borderRadius: 5
                            }}
                        >

                            <MagnifyingGlass size={24} />

                        </TouchableOpacity>
                    </View>

                    {loadingSearch &&
                        <Text
                            style={{
                                color: "gray",
                                textAlign: "center",
                                textAlignVertical: "center",
                                flex: 1
                            }}
                        >Loading...</Text>}

                    {errorSearch && <Text
                        style={{
                            color: "gray",
                            textAlign: "center",
                            textAlignVertical: "center",
                            flex: 1
                        }}
                    >Error: {error.message}</Text>}

                    {dataSearch?.searchUser.length === 0 &&
                        <Text
                            style={{
                                color: "gray",
                                textAlign: "center",
                                textAlignVertical: "center",
                                marginVertical: 250
                            }}
                        >user not found, please try another name/username</Text>

                    }

                    {dataSearch && (
                        <FlatList
                            data={dataSearch.searchUser}
                            keyExtractor={(item, index) => index}
                            renderItem={(props) => {
                                return (
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                paddingVertical: 10,
                                                marginVertical: 10
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#fff"
                                                }}
                                            >
                                                {props.item.username}
                                            </Text>

                                        </View>

                                        <View>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    try {
                                                        inviteList.push(props.item._id)
                                                    } catch (error) {
                                                        console.log(error, "error follow<<<<");
                                                    }
                                                }}

                                                style={{
                                                    backgroundColor: "#CFB1FB",
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 12,
                                                    borderRadius: 5
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#1d1d1d"
                                                    }}
                                                >
                                                    +
                                                </Text>
                                            </TouchableOpacity>

                                        </View>


                                    </View>
                                )
                            }}
                        />
                    )}

                </>

            )}
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
        justifyContent: 'space-between'
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
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    purpleTitle: {
        color: "#CFB1FB",
        fontSize: 21,
        fontFamily: 'Clash-Display-Bold',
    },
    submitButton: {
        backgroundColor: '#D9FF3D',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    submitButtonText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Clash-Display-Semibold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    dropdown: {
        marginBottom: 20,
        zIndex: 10,
    },
    textArea: {
        padding: 10,
        backgroundColor: "#FAFAFA",
        height: 50,
        textAlignVertical: "top",
        marginBottom: 20,
        borderRadius: 4,
    },
});