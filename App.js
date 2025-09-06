
import { BarCodeScanner } from 'expo-barcode-scanner';

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  Platform,
  Animated,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Modal,
  Linking,
  Image,
} from "react-native";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from 'react-native-qrcode-svg';


// Voice fallback
let Voice;
try {
  Voice = require("@react-native-voice/voice");
} catch (e) {
  Voice = {
    onSpeechResults: null,
    onSpeechError: null,
    start: async () => {
      Alert.alert("Voice not available", "Real-time speech recognition isn't available in this environment.");
    },
    stop: () => {},
    destroy: async () => {},
    removeAllListeners: () => {},
  };
}


// --- Theme Objects ---
const lightThemeColors = {
  background: '#fff',
  text: '#000',
  card: '#f8f8f8',
  border: '#ddd',
  primary: '#00baf2',
};


const darkThemeColors = {
  background: '#1c1c1e',
  text: '#fff',
  card: '#2c2c2e',
  border: '#444',
  primary: '#00baf2',
};


const highContrastTheme = {
  background: '#000',
  text: '#fff',
  card: '#333',
  border: '#fff',
  primary: '#00baf2',
};


// --- Styles ---
const createStyles = (darkTheme, highContrast, largeTextMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: highContrast ? highContrastTheme.background : darkTheme ? darkThemeColors.background : lightThemeColors.background,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: highContrast ? highContrastTheme.background : darkTheme ? darkThemeColors.background : lightThemeColors.background,
  },
  simplifiedContainer: {
    flex: 1,
    backgroundColor: highContrast ? highContrastTheme.background : darkTheme ? darkThemeColors.background : lightThemeColors.background,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: largeTextMode ? 28 : 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: largeTextMode ? 20 : 16,
    color: '#fff',
    marginTop: 5,
  },
  homeContent: {
    padding: 16,
  },
  servicesCard: {
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 8,
    borderColor: highContrast ? highContrastTheme.border : darkTheme ? darkThemeColors.border : lightThemeColors.border,
    backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : lightThemeColors.card,
  },
  cardTitle: {
    fontSize: largeTextMode ? 22 : 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    alignItems: 'center',
    marginVertical: 8,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    textAlign: 'center',
  },
  simplifiedGrid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  simplifiedItem: {
    alignItems: 'center',
    marginVertical: 20,
  },
  simplifiedText: {
    marginTop: 10,
    fontSize: largeTextMode ? 24 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: largeTextMode ? 28 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTo: {
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: largeTextMode ? 16 : 14,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#666',
  },
  transactionAmount: {
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: largeTextMode ? 18 : 16,
  },
  languageButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : '#f0f0f0',
  },
  languageButtonActive: {
    backgroundColor: '#00baf2',
  },
  languageButtonText: {
    fontSize: largeTextMode ? 16 : 14,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#000',
  },
  languageButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: highContrast ? highContrastTheme.border : darkTheme ? darkThemeColors.border : '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: largeTextMode ? 18 : 16,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#000',
    backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : '#fff',
  },
  primaryButton: {
    backgroundColor: '#00baf2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 60,
    left: 20,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: highContrast ? highContrastTheme.background : darkTheme ? darkThemeColors.background : lightThemeColors.background,
  },
  authContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  authTitle: {
    fontSize: largeTextMode ? 32 : 28,
    fontWeight: 'bold',
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#000',
  },
  authSubtitle: {
    fontSize: largeTextMode ? 20 : 16,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  authButtons: {
    padding: 20,
  },
  loginButton: {
    backgroundColor: '#00baf2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signupButtonText: {
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#000',
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: 'bold',
  },
  authFormContainer: {
    flex: 1,
    backgroundColor: highContrast ? highContrastTheme.background : darkTheme ? darkThemeColors.background : lightThemeColors.background,
    padding: 20,
  },
  authFormTitle: {
    fontSize: largeTextMode ? 28 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  switchAuthText: {
    fontSize: largeTextMode ? 18 : 16,
    color: '#00baf2',
    textAlign: 'center',
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: largeTextMode ? 24 : 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: largeTextMode ? 40 : 36,
    fontWeight: 'bold',
    color: '#00baf2',
  },
  voiceInstruction: {
    fontSize: largeTextMode ? 20 : 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  voiceExample: {
    fontSize: largeTextMode ? 18 : 14,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#666',
    textAlign: 'center',
    marginVertical: 5,
  },
  micButton: {
    backgroundColor: '#00baf2',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  listeningText: {
    fontSize: largeTextMode ? 20 : 16,
    color: '#00baf2',
    marginTop: 10,
  },
  recognizedText: {
    fontSize: largeTextMode ? 18 : 14,
    textAlign: 'center',
    marginTop: 10,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: largeTextMode ? 24 : 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: largeTextMode ? 18 : 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  modalAmount: {
    fontSize: largeTextMode ? 28 : 24,
    fontWeight: 'bold',
    color: '#00baf2',
    marginVertical: 10,
  },
  modalRecipient: {
    fontSize: largeTextMode ? 20 : 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
  },
  confirmButton: {
    backgroundColor: '#00baf2',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: 'bold',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrCard: {
    padding: 20,
    alignItems: 'center',
  },
  qrName: {
    fontSize: largeTextMode ? 24 : 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  qrUpiId: {
    fontSize: largeTextMode ? 20 : 16,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#666',
    marginTop: 10,
  },
  quickPayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickPayDetails: {
    flex: 1,
    marginLeft: 12,
  },
  quickPayName: {
    fontSize: largeTextMode ? 18 : 16,
    fontWeight: '600',
  },
  quickPayUpi: {
    fontSize: largeTextMode ? 16 : 14,
    color: highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#666',
  },
  drawerSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: highContrast ? highContrastTheme.border : darkTheme ? darkThemeColors.border : '#ddd',
    paddingTop: 15,
  },
  drawerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  drawerRowLabel: {
    fontSize: largeTextMode ? 18 : 16,
    marginLeft: 10,
    flex: 1,
  },
  offerCard: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 120,
  },
  offerContent: {
    padding: 15,
  },
  offerTitle: {
    fontSize: largeTextMode ? 20 : 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: largeTextMode ? 16 : 14,
    marginBottom: 10,
  },
  offerCode: {
    fontSize: largeTextMode ? 18 : 14,
    fontWeight: 'bold',
    color: '#00baf2',
    marginTop: 5,
  },
  offerExpiry: {
    fontSize: largeTextMode ? 14 : 12,
    color: '#ff4d4d',
    marginTop: 5,
  },
  billTypeContainer: {
    marginVertical: 15,
  },
  billTypeTitle: {
    fontSize: largeTextMode ? 20 : 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  billProviderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  billProviderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  billProviderName: {
    fontSize: largeTextMode ? 18 : 14,
    fontWeight: '500',
  },
  billSearchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});


// --- CONTEXT ---
const AppCtx = createContext();


// --- MOCK DATA & TRANSLATIONS ---
const INITIAL_MOCK_TRANSACTIONS = [
  { id: "1", type: "sent", amount: 50.0, to: "John Doe", date: "2024-07-28" },
  { id: "2", type: "received", amount: 120.0, from: "Jane Smith", date: "2024-07-27" },
];
const MOCK_BALANCE = 5000.75;
const MOCK_USER = {
  name: 'Demo User',
  upiId: 'demouser@inclusivepay'
};
const MOCK_FAVORITES = [
  { id: '1', name: 'Mom', upi: 'mom@inclusivepay' },
  { id: '2', name: 'Local Shop', upi: 'shop@inclusivepay' },
  { id: '3', name: 'Dr. Smith', upi: 'doc@inclusivepay' },
];


const translations = {
  en: {
    moneyTransfer: "Money Transfer",
    sendMoney: "Send Money",
    checkBalance: "Check Balance",
    voicePay: "Voice Pay",
    rechargeBillPayments: "Recharge & Bill Payments",
    recharge: "Recharge",
    payBills: "Pay Bills",
    offers: "Offers",
    history: "History",
    appName: "InclusivePay",
    appSubtitle: "India's Most-loved Payment App",
    logIn: "Log In",
    signUp: "Sign Up",
    welcomeBack: "Welcome Back!",
    email: "Email",
    password: "Password",
    login: "Login",
    noAccountSignUp: "Don't have an account? Sign Up",
    createAccount: "Create Account",
    fullName: "Full Name",
    alreadyHaveAccount: "Already have an account? Log In",
    yourWalletYourWay: "Your Wallet, Your Way.",
    transactionHistory: "Transaction History",
    settings: "Settings",
    simplifiedMode: "Simplified Mode",
    darkMode: "Dark Mode",
    highContrast: "High Contrast",
    largeTextMode: "Large Text Mode",
    emergencyContact: "Emergency Contact",
    enterPhoneNumber: "Enter phone number",
    logout: "Logout",
    verifyIdentity: "Verify Identity",
    enterPasswordToContinue: "Please enter your password to continue.",
    submit: "Submit",
    availableBalance: "Available Balance",
    recipientsNameOrUpiId: "Recipient's Name or UPI ID",
    amount: "Amount (₹)",
    send: "Send",
    invalidInput: "Invalid Input",
    pleaseEnterValidRecipientAndAmount: "Please enter a valid recipient and amount.",
    insufficientFunds: "Insufficient Funds",
    noEnoughBalance: "You do not have enough balance for this transaction.",
    success: "Success",
    sentTo: "Sent ₹{amount} to {recipient}",
    voiceInstruction: "Tap the mic and say a command like:",
    voiceExample1: "Pay 200 to Mom",
    voiceExample2: "Send 100 rupees to John",
    voiceExample3: "Recharge for 50 rupees",
    voiceExample4: "Check balance",
    listening: "Listening...",
    mobileRecharge: "Mobile Recharge",
    mobileNumber: "Mobile Number",
    pleaseEnterValidMobileAndAmount: "Please enter a valid mobile number and amount.",
    rechargeSuccess: "Recharge of ₹{amount} for {number} is successful.",
    payBillsDescription: "Functionality to pay various bills (Electricity, Water, etc.) would be here.",
    exclusiveOffers: "Exclusive Offers",
    offersDescription: "Special offers and discounts would be displayed here.",
    myQrCode: "My QR Code",
    quickPay: "Quick Pay",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    bengali: "Bengali",
    marathi: "Marathi",
    confirmPayment: "Confirm Payment",
    youArePaying: "You are paying:",
    to: "To:",
    cancel: "Cancel",
    confirm: "Confirm",
    noEmergencyContact: "No Emergency Contact",
    pleaseSetEmergencyContact: "Please set an emergency contact in the settings.",
    wrongPassword: "Wrong Password. Please try again.",
    error: "Error",
    pleaseFillAllFields: "Please fill all fields.",
    pleaseEnterEmailAndPassword: "Please enter email and password.",
    home: "Home",
    sorryInsufficientFunds: "Sorry, you have insufficient funds for this transaction.",
    sorryDidntUnderstand: "Sorry, I didn't understand that command.",
    paidTo: "Paid {amount} rupees to {name}",
    sendingTo: "Sending {amount} rupees to {recipient}",
    rechargingFor: "Recharging for {amount} rupees",
    navigatingTo: "Navigating to {screen}",
    toggledOn: "{setting} turned on",
    toggledOff: "{setting} turned off",
  },
  hi: {
    moneyTransfer: "मनी ट्रांसफर",
    sendMoney: "पैसे भेजें",
    checkBalance: "बैलेंस चेक करें",
    voicePay: "वॉयस पे",
    rechargeBillPayments: "रिचार्ज और बिल भुगतान",
    recharge: "रिचार्ज",
    payBills: "बिल भुगतान",
    offers: "ऑफर",
    history: "इतिहास",
    appName: "InclusivePay",
    appSubtitle: "भारत का सबसे पसंदीदा भुगतान ऐप",
    logIn: "लॉग इन",
    signUp: "साइन अप",
    welcomeBack: "वापसी पर स्वागत है!",
    email: "ईमेल",
    password: "पासवर्ड",
    login: "लॉग इन",
    noAccountSignUp: "खाता नहीं है? साइन अप करें",
    createAccount: "खाता बनाएं",
    fullName: "पूरा नाम",
    alreadyHaveAccount: "पहले से ही खाता है? लॉग इन करें",
    yourWalletYourWay: "आपका वॉलेट, आपका तरीका।",
    transactionHistory: "लेनदेन इतिहास",
    settings: "सेटिंग्स",
    simplifiedMode: "सरलीकृत मोड",
    darkMode: "डार्क मोड",
    highContrast: "उच्च कंट्रास्ट",
    largeTextMode: "बड़ा टेक्स्ट मोड",
    emergencyContact: "आपातकालीन संपर्क",
    enterPhoneNumber: "फोन नंबर दर्ज करें",
    logout: "लॉगआउट",
    verifyIdentity: "पहचान सत्यापित करें",
    enterPasswordToContinue: "जारी रखने के लिए अपना पासवर्ड दर्ज करें।",
    submit: "सबमिट",
    availableBalance: "उपलब्ध बैलेंस",
    recipientsNameOrUpiId: "प्राप्तकर्ता का नाम या UPI ID",
    amount: "राशि (₹)",
    send: "भेजें",
    invalidInput: "अमान्य इनपुट",
    pleaseEnterValidRecipientAndAmount: "कृपया एक मान्य प्राप्तकर्ता और राशि दर्ज करें।",
    insufficientFunds: "अपर्याप्त धनराशि",
    noEnoughBalance: "इस लेनदेन के लिए आपके पास पर्याप्त बैलेंस नहीं है।",
    success: "सफलता",
    sentTo: "{recipient} को ₹{amount} भेजा गया",
    voiceInstruction: "माइक टैप करें और एक कमांड कहें जैसे:",
    voiceExample1: "&quot;Pay 200 to Mom&quot;",
    voiceExample2: "&quot;Send 100 rupees to John&quot;",
    voiceExample3: "&quot;Recharge for 50 rupees&quot;",
    voiceExample4: "&quot;Check balance&quot;",
    listening: "सुन रहा है...",
    mobileRecharge: "मोबाइल रिचार्ज",
    mobileNumber: "मोबाइल नंबर",
    pleaseEnterValidMobileAndAmount: "कृपया एक मान्य मोबाइल नंबर और राशि दर्ज करें।",
    rechargeSuccess: "{number} के लिए ₹{amount} का रिचार्ज सफल है।",
    payBillsDescription: "विभिन्न बिलों (बिजली, पानी, आदि) का भुगतान करने की कार्यक्षमता यहां होगी।",
    exclusiveOffers: "विशेष ऑफर",
    offersDescription: "विशेष ऑफर और छूट यहां प्रदर्शित की जाएंगी।",
    myQrCode: "मेरा QR कोड",
    quickPay: "क्विक पे",
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    bengali: "বাংলা",
    marathi: "मराठी",
    confirmPayment: "भुगतान की पुष्टि करें",
    youArePaying: "आप भुगतान कर रहे हैं:",
    to: "को:",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    noEmergencyContact: "कोई आपातकालीन संपर्क नहीं",
    pleaseSetEmergencyContact: "कृपया सेटिंग्स में एक आपातकालीन संपर्क सेट करें।",
    wrongPassword: "गलत पासवर्ड। कृपया पुनः प्रयास करें।",
    error: "त्रुटि",
    pleaseFillAllFields: "कृपया सभी फ़ीलड भरें।",
    pleaseEnterEmailAndPassword: "कृपया ईमेल और पासवर्ड दर्ज करें।",
    home: "होम",
    sorryInsufficientFunds: "क्षमा करें, इस लेनदेन के लिए आपके पास अपर्याप्त धनराशि है।",
    sorryDidntUnderstand: "क्षमा करें, मैं उस कमांड को समझ नहीं पाया।",
    paidTo: "{name} को {amount} रुपये का भुगतान किया गया",
    sendingTo: "{recipient} को {amount} रुपये भेज रहा है",
    rechargingFor: "{amount} रुपये के लिए रिचार्ज कर रहा है",
    navigatingTo: "{screen} पर जा रहा है",
    toggledOn: "{setting} चालू किया गया",
    toggledOff: "{setting} बंद किया गया",
  },
  bn: {
    moneyTransfer: "টাকা স্থানান্তর",
    sendMoney: "টাকা পাঠান",
    checkBalance: "ব্যালেন্স চেক করুন",
    voicePay: "ভয়েস পে",
    rechargeBillPayments: "রিচার্জ ও বিল পেমেন্ট",
    recharge: "রিচার্জ",
    payBills: "বিল পরিশোধ",
    offers: "অফার",
    history: "ইতিহাস",
    appName: "InclusivePay",
    appSubtitle: "ভারতের সবচেয়ে প্রিয় পেমেন্ট অ্যাপ",
    logIn: "লগ ইন",
    signUp: "সাইন আপ",
    welcomeBack: "ফিরে আসার জন্য স্বাগতম!",
    email: "ইমেল",
    password: "পাসওয়ার্ড",
    login: "লগইন",
    noAccountSignUp: "কোনো অ্যাকাউন্ট নেই? সাইন আপ করুন",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    fullName: "পুরো নাম",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগ ইন করুন",
    yourWalletYourWay: "আপনার ওয়ালেট, আপনার পথ।",
    transactionHistory: "লেনদেনের ইতিহাস",
    settings: "সেটিংস",
    simplifiedMode: "সরল মোড",
    darkMode: "ডার্ক মোড",
    highContrast: "উচ্চ বৈসাদৃশ্য",
    largeTextMode: "বড় টেকস্ট মোড",
    emergencyContact: "জরুরি যোগাযোগ",
    enterPhoneNumber: "ফোন নম্বর লিখুন",
    logout: "লগআউট",
    verifyIdentity: "পরিচয় যাচাই করুন",
    enterPasswordToContinue: "চালিয়ে যেতে আপনার পাসওয়ার্ড লিখুন।",
    submit: "জমা দিন",
    availableBalance: "উপলব্ধ ব্যালেন্স",
    recipientsNameOrUpiId: "প্রাপকের নাম বা UPI আইডি",
    amount: "পরিমাণ (₹)",
    send: "পাঠান",
    invalidInput: "অবৈধ ইনপুট",
    pleaseEnterValidRecipientAndAmount: "অনুগ্রহ করে একটি বৈধ প্রাপক এবং পরিমাণ লিখুন।",
    insufficientFunds: "অপর্যাপ্ত তহবিল",
    noEnoughBalance: "এই লেনদেনের জন্য আপনার পর্যাপ্ত ব্যালেন্স নেই।",
    success: "সাফল্য",
    sentTo: "{recipient} কে ₹{amount} পাঠানো হয়েছে",
    voiceInstruction: "মাইক ট্যাপ করুন এবং এরকম একটি কমান্ড বলুন:",
    voiceExample1: "&quot;Pay 200 to Mom&quot;",
    voiceExample2: "&quot;Send 100 rupees to John&quot;",
    voiceExample3: "&quot;Recharge for 50 rupees&quot;",
    voiceExample4: "&quot;Check balance&quot;",
    listening: "শুনছে...",
    mobileRecharge: "মোবাইল রিচার্জ",
    mobileNumber: "মোবাইল নম্বর",
    pleaseEnterValidMobileAndAmount: "অনুগ্রহ করে একটি বৈধ মোবাইল নম্বর এবং পরিমাণ লিখুন।",
    rechargeSuccess: "{number} এর জন্য ₹{amount} রিচার্জ সফল।",
    payBillsDescription: "বিভিন্ন বিল (বিদ্যুৎ, পানি, ইত্যাদি) পরিশোধের কার্যকারিতা এখানে থাকবে।",
    exclusiveOffers: "বিশেষ অফার",
    offersDescription: "বিশেষ অফার এবং ছাড় এখানে প্রদর্শিত হবে।",
    myQrCode: "আমার QR কোড",
    quickPay: "কুইক পে",
    language: "ভাষা",
    english: "English",
    hindi: "हिन्दी",
    bengali: "বাংলা",
    marathi: "मराठी",
    confirmPayment: "পেমেন্ট নিশ্চিত করুন",
    youArePaying: "আপনি পেমেন্ট করছেন:",
    to: "প্রতি:",
    cancel: "বাতিল",
    confirm: "নিশ্চিত করুন",
    noEmergencyContact: "কোনো জরুরি যোগাযোগ নেই",
    pleaseSetEmergencyContact: "অনুগ্রহ করে সেটিংসে একটি জরুরি যোগাযোগ সেট করুন।",
    wrongPassword: "ভুল পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।",
    error: "ত্রুটি",
    pleaseFillAllFields: "অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন।",
    pleaseEnterEmailAndPassword: "অনুগ্রহ করে ইমেল এবং পাসওয়ার্ড লিখুন।",
    home: "হোম",
    sorryInsufficientFunds: "দুঃখিত, এই লেনদেনের জন্য আপনার পর্যাপ্ত তহবিল নেই।",
    sorryDidntUnderstand: "দুঃখিত, আমি সেই কমান্ডটি বুঝতে পারিনি।",
    paidTo: "{name} কে {amount} টাকা প্রদান করা হয়েছে",
    sendingTo: "{recipient} কে {amount} টাকা পাঠানো হচ্ছে",
    rechargingFor: "{amount} টাকার জন্য রিচার্জ করা হচ্ছে",
    navigatingTo: "{screen} এ যাচ্ছে",
    toggledOn: "{setting} চালু করা হয়েছে",
    toggledOff: "{setting} বন্ধ করা হয়েছে",
  },
  mr: {
    moneyTransfer: "पैसे हस्तांतरण",
    sendMoney: "पैसे पाठवा",
    checkBalance: "शिल्लक तपासा",
    voicePay: "व्हॉइस पे",
    rechargeBillPayments: "रिचार्ज आणि बिल पेमेंट",
    recharge: "रिचार्ज",
    payBills: "बिल पेमेंट",
    offers: "ऑफर",
    history: "इतिहास",
    appName: "InclusivePay",
    appSubtitle: "भारताचे सर्वात आवडते पेमेंट ॲप",
    logIn: "लॉग इन",
    signUp: "साइन अप",
    welcomeBack: "परत स्वागत आहे!",
    email: "ईमेल",
    password: "पासवर्ड",
    login: "लॉगिन",
    noAccountSignUp: "खाते नाही? साइन अप करा",
    createAccount: "खाते तयार करा",
    fullName: "पूर्ण नाव",
    alreadyHaveAccount: "आधीपासून खाते आहे? लॉग इन करा",
    yourWalletYourWay: "तुमचे वॉलेट, तुमची पद्धत.",
    transactionHistory: " व्यवहार इतिहास",
    settings: "सेटिंग्ज",
    simplifiedMode: "सुलभ मोड",
    darkMode: "डार्क मोड",
    highContrast: "उच्च कॉन्ट्रास्ट",
    largeTextMode: "मोठा मजकूर मोड",
    emergencyContact: "आपत्कालीन संपर्क",
    enterPhoneNumber: "फोन नंबर टाका",
    logout: "लॉगआउट",
    verifyIdentity: "ओळख सत्यापित करा",
    enterPasswordToContinue: "पुढे जाण्यासाठी कृपया तुमचा पासवर्ड टाका.",
    submit: "सबमिट",
    availableBalance: "उपलब्ध शिल्लक",
    recipientsNameOrUpiId: "प्राप्तकर्त्याचे नाव किंवा UPI ID",
    amount: "रक्कम (₹)",
    send: "पाठवा",
    invalidInput: "अवैध इनपुट",
    pleaseEnterValidRecipientAndAmount: "कृपया वैध प्राप्तकर्ता आणि रक्कम टाका.",
    insufficientFunds: "अपुरे निधी",
    noEnoughBalance: "या व्यवहारासाठी तुमच्याकडे पुरेशी शिल्लक नाही.",
    success: "यश",
    sentTo: "{recipient} ला ₹{amount} पाठवले",
    voiceInstruction: "माइक टॅप करा आणि खालीलप्रमाणे कमांड सांगा:",
    voiceExample1: "&quot;Pay 200 to Mom&quot;",
    voiceExample2: "&quot;Send 100 rupees to John&quot;",
    voiceExample3: "&quot;Recharge for 50 rupees&quot;",
    voiceExample4: "&quot;Check balance&quot;",
    listening: "ऐकत आहे...",
    mobileRecharge: "मोबाइल रिचार्ज",
    mobileNumber: "मोबाइल नंबर",
    pleaseEnterValidMobileAndAmount: "कृपया वैध मोबाइल नंबर आणि रक्कम टाका.",
    rechargeSuccess: "{number} साठी ₹{amount} चे रिचार्ज यशस्वी झाले.",
    payBillsDescription: "विविध बिलांचे (वीज, पाणी, इ.) पेमेंट करण्याची कार्यक्षमता इथे असेल.",
    exclusiveOffers: "विशेष ऑफर",
    offersDescription: "विशेष ऑफर आणि सवलती इथे दाखवल्या जातील.",
    myQrCode: "माझा QR कोड",
    quickPay: "क्विक पे",
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    bengali: "বাংলা",
    marathi: "मराठी",
    confirmPayment: "पेमेंट निश्चित करा",
    youArePaying: "तुम्ही पेमेंट करत आहात:",
    to: "ला:",
    cancel: "रद्द करा",
    confirm: "निश्चित करा",
    noEmergencyContact: "कोणताही आपत्कालीन संपर्क नाही",
    pleaseSetEmergencyContact: "कृपया सेटिंग्जमध्ये आपत्कालीन संपर्क सेट करा.",
    wrongPassword: "चुकीचा पासवर्ड. कृपया पुन्हा प्रयत्न करा.",
    error: "त्रुटी",
    pleaseFillAllFields: "कृपया सर्व फील्ड भरा.",
    pleaseEnterEmailAndPassword: "कृपया ईमेल आणि पासवर्ड टाका.",
    home: "होम",
    sorryInsufficientFunds: "क्षमस्व, या व्यवहारासाठी तुमच्याकडे अपुरे निधी आहेत.",
    sorryDidntUnderstand: "क्षमस्व, मला ती कमांड समजली नाही.",
    paidTo: "{name} ला {amount} रुपये दिले",
    sendingTo: "{recipient} ला {amount} रुपये पाठवत आहे",
    rechargingFor: "{amount} रुपयांसाठी रिचार्ज करत आहे",
    navigatingTo: "{screen} वर जात आहे",
    toggledOn: "{setting} सुरू केले",
    toggledOff: "{setting} बंद केले",
  },
};


// --- UI COMPONENTS ---
const ThemedText = ({ style, ...props }) => {
  const { darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const theme = highContrast ? highContrastTheme : (darkTheme ? darkThemeColors : lightThemeColors);
  const baseFontSize = style?.fontSize || 16;
  return <Text style={[{ color: theme.text, fontSize: largeTextMode ? baseFontSize + 4 : baseFontSize }, style]} {...props} />;
};


const Card = ({ children, style }) => {
  const { darkTheme, highContrast } = useContext(AppCtx);
  const styles = createStyles(darkTheme, highContrast, false);
  return (
    <View style={[styles.card, { backgroundColor: highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : lightThemeColors.card, borderColor: highContrast ? highContrastTheme.border : darkTheme ? darkThemeColors.border : lightThemeColors.border }, style]}>
      {children}
    </View>
  );
};


const ConfirmationModal = ({ visible, onConfirm, onCancel, details }) => {
  const { speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  useEffect(() => {
    if (visible) {
      speak(`${t.confirmPayment} ${details.amount} ${t.to} ${details.recipient}.`);
    }
  }, [visible]);


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        speak(t.cancel);
        onCancel();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{t.confirmPayment}</Text>
          <Text style={styles.modalText}>{t.youArePaying}</Text>
          <Text style={styles.modalAmount}>₹{details.amount}</Text>
          <Text style={styles.modalText}>{t.to}</Text>
          <Text style={styles.modalRecipient}>{details.recipient}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                speak(t.cancel);
                onCancel();
              }}
            >
              <Text style={styles.modalButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                speak(t.confirm);
                onConfirm();
              }}
            >
              <Text style={styles.modalButtonText}>{t.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- AUTH SCREENS ---
const AuthScreen = ({ navigation }) => {
  const { language, speak, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  return (
    <SafeAreaView style={styles.authContainer}>
      <StatusBar barStyle={darkTheme ? "light-content" : "dark-content"} />
      <View style={styles.authContent}>
        <Image source={{ uri: 'https://placehold.co/150x150/00baf2/FFFFFF?text=IP' }} style={styles.authLogo} />
        <Text style={styles.authTitle}>{t.appName}</Text>
        <Text style={styles.authSubtitle}>{t.appSubtitle}</Text>
      </View>
      <View style={styles.authButtons}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            speak(t.logIn);
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.loginButtonText}>{t.logIn}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {
            speak(t.signUp);
            navigation.navigate('Signup');
          }}
        >
          <Text style={styles.signupButtonText}>{t.signUp}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const LoginScreen = ({ navigation }) => {
  const { login, setUserPassword, language, speak, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    if (email === "test@example.com" && password === "password123") {
      alert("Login successful!");
      return;
    }
    if (!email || !password) {
      speak(t.pleaseEnterEmailAndPassword);
      Alert.alert(t.error, t.pleaseEnterEmailAndPassword);
      return;
    }
    setUserPassword(password);
    login();
  };


  return (
    <SafeAreaView style={styles.authFormContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.authFormTitle}>{t.welcomeBack}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.email}
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={t.password}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            speak(t.login);
            handleLogin();
          }}
        >
          <Text style={styles.primaryButtonText}>{t.login}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            speak(t.noAccountSignUp);
            navigation.navigate('Signup');
          }}
        >
          <Text style={styles.switchAuthText}>{t.noAccountSignUp}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const SignupScreen = ({ navigation }) => {
  const { login, setUserPassword, language, speak, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignup = () => {
    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    if (!name || !email || !password) {
      speak(t.pleaseFillAllFields);
      Alert.alert(t.error, t.pleaseFillAllFields);
      return;
    }
    setUserPassword(password);
    login();
  };


  return (
    <SafeAreaView style={styles.authFormContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.authFormTitle}>{t.createAccount}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.fullName}
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder={t.email}
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={t.password}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            speak(t.signUp);
            handleSignup();
          }}
        >
          <Text style={styles.primaryButtonText}>{t.signUp}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            speak(t.alreadyHaveAccount);
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.switchAuthText}>{t.alreadyHaveAccount}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


// --- CORE APP SCREENS ---
const HomeScreen = ({ navigation }) => {
  const { speak, hapticFeedback, language, simplifiedMode, emergencyContact, largeTextMode, darkTheme, highContrast } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  const onServicePress = (service, screen) => {
    hapticFeedback();
    speak(t.navigatingTo.replace('{screen}', service));
    navigation.navigate(screen);
  };


  const services = [
    { name: t.sendMoney, icon: "send", screen: "SendMoney", color: "#00baf2" },
    { name: t.checkBalance, icon: "bank", screen: "Password", color: "#00baf2" },
    { name: t.voicePay, icon: "microphone", screen: "VoicePay", color: "#00baf2" },
  ];


  const bills = [
    { name: t.recharge, icon: "cellphone", screen: "Recharge", color: "#0d3e80" },
    { name: t.payBills, icon: "receipt", screen: "PayBills", color: "#0d3e80" },
    { name: t.offers, icon: "tag", screen: "Offers", color: "#0d3e80" },
    { name: t.history, icon: "history", screen: "History", color: "#0d3e80" },
  ];


  const simplifiedServices = [
    { name: t.sendMoney, icon: "send", screen: "SendMoney", color: "#00baf2" },
    { name: t.checkBalance, icon: "bank", screen: "Password", color: "#00baf2" },
  ];


  const handleSOS = () => {
    if (emergencyContact) {
      speak(`Calling emergency contact ${emergencyContact}`);
      Linking.openURL(`tel:${emergencyContact}`);
    } else {
      speak(t.noEmergencyContact);
      Alert.alert(t.noEmergencyContact, t.pleaseSetEmergencyContact);
    }
  };


  if (simplifiedMode) {
    return (
      <SafeAreaView style={styles.simplifiedContainer}>
        <StatusBar barStyle={darkTheme ? "light-content" : "light-content"} />
        <LinearGradient colors={['#00baf2', '#0d3e80']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => {
                speak('Opening drawer');
                navigation.openDrawer();
              }}
            >
              <Ionicons name="menu" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { marginLeft: 20 }]}>{t.appName}</Text>
            <TouchableOpacity onPress={handleSOS} style={{ marginLeft: 'auto' }}>
              <MaterialCommunityIcons name="bell-alert" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.simplifiedGrid}>
          {simplifiedServices.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.simplifiedItem}
              onPress={() => onServicePress(item.name, item.screen)}
            >
              <MaterialCommunityIcons name={item.icon} size={60} color={item.color} />
              <ThemedText style={styles.simplifiedText}>{item.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }


  return (
    <ScrollView style={styles.homeContainer}>
      <StatusBar barStyle={darkTheme ? "light-content" : "light-content"} />
      <LinearGradient colors={['#00baf2', '#0d3e80']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => {
              speak('Opening drawer');
              navigation.openDrawer();
            }}
          >
            <Image source={{ uri: 'https://placehold.co/40x40/FFFFFF/00baf2?text=IP' }} style={styles.headerLogo} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.appName}</Text>
          <TouchableOpacity onPress={handleSOS} style={{ marginLeft: 'auto' }}>
            <MaterialCommunityIcons name="bell-alert" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>{t.yourWalletYourWay}</Text>
      </LinearGradient>
      <View style={styles.homeContent}>
        <Card style={styles.servicesCard}>
          <ThemedText style={styles.cardTitle}>{t.moneyTransfer}</ThemedText>
          <View style={styles.servicesGrid}>
            {services.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.serviceItem}
                onPress={() => onServicePress(item.name, item.screen)}
              >
                <View style={[styles.serviceIconContainer, { backgroundColor: item.color }]}>
                  <MaterialCommunityIcons name={item.icon} size={28} color="#fff" />
                </View>
                <ThemedText style={[styles.serviceText, { fontSize: largeTextMode ? 16 : 12 }]}>{item.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        <Card style={styles.servicesCard}>
          <ThemedText style={styles.cardTitle}>{t.rechargeBillPayments}</ThemedText>
          <View style={styles.servicesGrid}>
            {bills.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.serviceItem}
                onPress={() => onServicePress(item.name, item.screen)}
              >
                <View style={[styles.serviceIconContainer, { backgroundColor: item.color }]}>
                  <MaterialCommunityIcons name={item.icon} size={28} color="#fff" />
                </View>
                <ThemedText style={[styles.serviceText, { fontSize: largeTextMode ? 16 : 12 }]}>{item.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};


const HistoryScreen = () => {
  const { transactions, language, speak, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  useEffect(() => {
    speak(t.transactionHistory);
  }, []);


  const renderTransaction = ({ item }) => (
    <Card style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <FontAwesome5
          name={item.type === 'sent' || item.type === 'recharge' ? 'arrow-up' : 'arrow-down'}
          size={20}
          color={item.type === 'sent' || item.type === 'recharge' ? '#ff4d4d' : '#4caf50'}
        />
      </View>
      <View style={styles.transactionDetails}>
        <ThemedText style={styles.transactionTo}>{item.to || item.from}</ThemedText>
        <ThemedText style={styles.transactionDate}>{item.date}</ThemedText>
      </View>
      <ThemedText style={[styles.transactionAmount, { color: item.type === 'sent' || item.type === 'recharge' ? '#ff4d4d' : '#4caf50' }]}>
        {item.type === 'sent' || item.type === 'recharge' ? '-' : '+'}₹{item.amount.toFixed(2)}
      </ThemedText>
    </Card>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.pageTitle}>{t.transactionHistory}</ThemedText>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};


const SettingsScreen = () => {
  const {
    darkTheme, setDarkTheme,
    logout,
    simplifiedMode, setSimplifiedMode,
    highContrast, setHighContrast,
    largeTextMode, setLargeTextMode,
    emergencyContact, setEmergencyContact,
    language, setLanguage,
    speak
  } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  const languageNames = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    mr: 'Marathi',
  };


  const handleToggle = (setting, value, setValue) => {
    setValue(!value);
    speak(t[value ? 'toggledOff' : 'toggledOn'].replace('{setting}', setting));
  };


  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    speak(`${t.language} changed to ${languageNames[lang]}`);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.pageTitle}>{t.settings}</ThemedText>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <Card style={styles.settingItem}>
          <ThemedText style={styles.settingText}>{t.simplifiedMode}</ThemedText>
          <Switch
            value={simplifiedMode}
            onValueChange={() => handleToggle(t.simplifiedMode, simplifiedMode, setSimplifiedMode)}
          />
        </Card>
        <Card style={styles.settingItem}>
          <ThemedText style={styles.settingText}>{t.darkMode}</ThemedText>
          <Switch
            value={darkTheme}
            onValueChange={() => handleToggle(t.darkMode, darkTheme, setDarkTheme)}
          />
        </Card>
        <Card style={styles.settingItem}>
          <ThemedText style={styles.settingText}>{t.highContrast}</ThemedText>
          <Switch
            value={highContrast}
            onValueChange={() => handleToggle(t.highContrast, highContrast, setHighContrast)}
          />
        </Card>
        <Card style={styles.settingItem}>
          <ThemedText style={styles.settingText}>{t.largeTextMode}</ThemedText>
          <Switch
            value={largeTextMode}
            onValueChange={() => handleToggle(t.largeTextMode, largeTextMode, setLargeTextMode)}
          />
        </Card>
        <Card style={styles.settingItem}>
          <ThemedText style={styles.settingText}>{t.language}</ThemedText>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.languageButtonText, language === 'en' && styles.languageButtonTextActive]}>{t.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, language === 'hi' && styles.languageButtonActive]}
              onPress={() => handleLanguageChange('hi')}
            >
              <Text style={[styles.languageButtonText, language === 'hi' && styles.languageButtonTextActive]}>{t.hindi}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, language === 'bn' && styles.languageButtonActive]}
              onPress={() => handleLanguageChange('bn')}
            >
              <Text style={[styles.languageButtonText, language === 'bn' && styles.languageButtonTextActive]}>{t.bengali}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, language === 'mr' && styles.languageButtonActive]}
              onPress={() => handleLanguageChange('mr')}
            >
              <Text style={[styles.languageButtonText, language === 'mr' && styles.languageButtonTextActive]}>{t.marathi}</Text>
            </TouchableOpacity>
          </View>
        </Card>
        <Card>
          <ThemedText style={styles.settingText}>{t.emergencyContact}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder={t.enterPhoneNumber}
            placeholderTextColor="#888"
            value={emergencyContact}
            onChangeText={(text) => {
              setEmergencyContact(text);
              if (text) speak(`Emergency contact set to ${text}`);
            }}
            keyboardType="phone-pad"
          />
        </Card>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            speak(t.logout);
            logout();
          }}
        >
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


const PasswordScreen = ({ navigation }) => {
  const { userPassword, language, speak, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [password, setPassword] = useState('');


  const handleVerification = () => {
    if (password === userPassword) {
      speak(t.submit);
      navigation.replace('Balance');
    } else {
      speak(t.wrongPassword);
      Alert.alert(t.error, t.wrongPassword);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <ThemedText style={styles.pageTitle}>{t.verifyIdentity}</ThemedText>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>{t.enterPasswordToContinue}</ThemedText>
        <TextInput
          style={styles.input}
          placeholder={t.password}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            speak(t.submit);
            handleVerification();
          }}
        >
          <Text style={styles.primaryButtonText}>{t.submit}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const BalanceScreen = ({ navigation }) => {
  const { speak, balance, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  useEffect(() => {
    speak(`${t.availableBalance} ${balance.toFixed(2)} rupees`);
  }, [balance]);


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.navigate("Main", { screen: "HomeDrawer" });
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText style={styles.balanceLabel}>{t.availableBalance}</ThemedText>
        <ThemedText style={styles.balanceAmount}>₹{balance.toFixed(2)}</ThemedText>
      </View>
    </SafeAreaView>
  );
};


const SendMoneyScreen = ({ navigation, route }) => {
  const { addTransaction, deductBalance, balance, speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [recipient, setRecipient] = useState(route.params?.upiId || '');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  const handleSend = () => {
    const parsedAmount = parseFloat(amount);
    if (!recipient || !amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      speak(t.pleaseEnterValidRecipientAndAmount);
      Alert.alert(t.invalidInput, t.pleaseEnterValidRecipientAndAmount);
      return;
    }
    if (parsedAmount > balance) {
      speak(t.noEnoughBalance);
      Alert.alert(t.insufficientFunds, t.noEnoughBalance);
      return;
    }
    speak(t.send);
    setModalVisible(true);
  };


  const confirmPayment = () => {
    const parsedAmount = parseFloat(amount);
    const newTransaction = {
      id: Date.now().toString(),
      type: 'sent',
      amount: parsedAmount,
      to: recipient,
      date: new Date().toISOString().split('T')[0],
    };
    addTransaction(newTransaction);
    deductBalance(parsedAmount);
    speak(`${t.paidTo.replace('{amount}', parsedAmount).replace('{name}', recipient)}`);
    Alert.alert(t.success, t.sentTo.replace('{amount}', amount).replace('{recipient}', recipient));
    setModalVisible(false);
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationModal
        visible={modalVisible}
        onConfirm={confirmPayment}
        onCancel={() => setModalVisible(false)}
        details={{ amount, recipient }}
      />
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <ThemedText style={styles.pageTitle}>{t.sendMoney}</ThemedText>
        <TextInput
          style={styles.input}
          placeholder={t.recipientsNameOrUpiId}
          placeholderTextColor="#888"
          value={recipient}
          onChangeText={setRecipient}
        />
        <TextInput
          style={styles.input}
          placeholder={t.amount}
          placeholderTextColor="#888"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSend}
        >
          <Text style={styles.primaryButtonText}>{t.send}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const VoicePayScreen = ({ navigation }) => {
  const { speak, addTransaction, deductBalance, balance, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");


  const processVoiceCommand = (command) => {
    command = command.toLowerCase();
    const payFavoriteMatch = command.match(/pay ([\d.]+) to (.+)/);
    const sendMoneyMatch = command.match(/send ([\d.]+) rupees to (.+)/);
    const rechargeMatch = command.match(/recharge for ([\d.]+) rupees/);
    const balanceMatch = command.includes("check balance");


if (payFavoriteMatch) {
  const amount = parseFloat(payFavoriteMatch[1]);
  const name = payFavoriteMatch[2].toLowerCase();
  const favorite = MOCK_FAVORITES.find(f => f.name.toLowerCase() === name);

  if (favorite) {
    if (amount > balance) {
      speak(t.sorryInsufficientFunds);
      return;
    }
    const newTransaction = {
      id: Date.now().toString(),
      type: 'sent',
      amount: amount,
      to: favorite.name,
      date: new Date().toISOString().split('T')[0],
    };
    addTransaction(newTransaction);
    deductBalance(amount);
    speak(`${t.paidTo.replace('{amount}', amount).replace('{name}', favorite.name)}`);
    Alert.alert(t.success, `${t.paidTo.replace('{amount}', amount).replace('{name}', favorite.name)}`);
    navigation.navigate("Home");
  } else {
    speak(`Sorry, I could not find ${payFavoriteMatch[2]} in your favorites. Please try saying 'send ${amount} rupees to ${payFavoriteMatch[2]}'.`);
  }
} else if (sendMoneyMatch) {
  const amount = parseFloat(sendMoneyMatch[1]);
  const recipient = sendMoneyMatch[2];
  if (amount > balance) {
    speak(t.sorryInsufficientFunds);
    return;
  }
  const newTransaction = {
    id: Date.now().toString(),
    type: 'sent',
    amount: amount,
    to: recipient,
    date: new Date().toISOString().split('T')[0],
  };
  addTransaction(newTransaction);
  deductBalance(amount);
  speak(`${t.sendingTo.replace('{amount}', amount).replace('{recipient}', recipient)}`);
  Alert.alert(t.success, `${t.sendingTo.replace('{amount}', amount).replace('{recipient}', recipient)}`);
  navigation.navigate("Home");
} else if (rechargeMatch) {
  const amount = parseFloat(rechargeMatch[1]);
  if (amount > balance) {
    speak(t.sorryInsufficientFunds);
    return;
  }
  const newTransaction = {
    id: Date.now().toString(),
    type: 'recharge',
    amount: amount,
    to: 'My Mobile',
    date: new Date().toISOString().split('T')[0],
  };
  addTransaction(newTransaction);
  deductBalance(amount);
  speak(`${t.rechargingFor.replace('{amount}', amount)}`);
  Alert.alert(t.success, `${t.rechargingFor.replace('{amount}', amount)}`);
  navigation.navigate("Home");
} else if (balanceMatch) {
  speak(t.navigatingTo.replace('{screen}', t.checkBalance));
  navigation.navigate("Password");
} else {
  speak(t.sorryDidntUnderstand);
}

  };


  const startListening = async () => {
    setRecognizedText("");
    try {
      await Voice.start(language === 'bn' ? "bn-IN" : language === 'hi' ? "hi-IN" : language === 'mr' ? "mr-IN" : "en-US");
      setIsListening(true);
      speak(t.listening);
    } catch (e) {
      console.error(e);
      speak("Sorry, there was an error with voice recognition.");
    }
  };


  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
      speak("Stopped listening");
    } catch (e) {
      console.error(e);
      speak("Sorry, there was an error stopping voice recognition.");
    }
  };


  useEffect(() => {
    speak(t.voicePay);
    Voice.onSpeechResults = (e) => {
      const text = e.value[0];
      setRecognizedText(text);
      processVoiceCommand(text);
      stopListening();
    };
    Voice.onSpeechError = (e) => {
      console.error(e);
      speak("Sorry, there was an error with voice recognition.");
      setIsListening(false);
    };
    //return () => Voice.destroy().then(Voice.removeAllListeners);
  }, [balance]);


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ThemedText style={styles.pageTitle}>{t.voicePay}</ThemedText>
        <ThemedText style={styles.voiceInstruction}>{t.voiceInstruction}</ThemedText>
        <ThemedText style={styles.voiceExample}>{t.voiceExample1}</ThemedText>
        <ThemedText style={styles.voiceExample}>{t.voiceExample2}</ThemedText>
        <ThemedText style={styles.voiceExample}>{t.voiceExample3}</ThemedText>
        <ThemedText style={styles.voiceExample}>{t.voiceExample4}</ThemedText>
        <TouchableOpacity
          onPress={isListening ? stopListening : startListening}
          style={styles.micButton}
        >
          <MaterialCommunityIcons name="microphone" size={60} color="#fff" />
        </TouchableOpacity>
        {isListening && <ThemedText style={styles.listeningText}>{t.listening}</ThemedText>}
        {recognizedText ? <ThemedText style={styles.recognizedText}>{recognizedText}</ThemedText> : null}
      </View>
    </SafeAreaView>
  );
};


const RechargeScreen = ({ navigation }) => {
  const { addTransaction, deductBalance, balance, speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  const handleRecharge = () => {
    const parsedAmount = parseFloat(amount);
    if (!mobileNumber || !amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      speak(t.pleaseEnterValidMobileAndAmount);
      Alert.alert(t.invalidInput, t.pleaseEnterValidMobileAndAmount);
      return;
    }
    if (parsedAmount > balance) {
      speak(t.noEnoughBalance);
      Alert.alert(t.insufficientFunds, t.noEnoughBalance);
      return;
    }
    speak(t.recharge);
    setModalVisible(true);
  };


  const confirmRecharge = () => {
    const parsedAmount = parseFloat(amount);
    const newTransaction = {
      id: Date.now().toString(),
      type: 'recharge',
      amount: parsedAmount,
      to: mobileNumber,
      date: new Date().toISOString().split('T')[0],
    };
    addTransaction(newTransaction);
    deductBalance(parsedAmount);
    speak(t.rechargeSuccess.replace('{amount}', amount).replace('{number}', mobileNumber));
    Alert.alert(t.success,      t.rechargeSuccess.replace('{amount}', amount).replace('{number}', mobileNumber));
    setModalVisible(false);
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationModal
        visible={modalVisible}
        onConfirm={confirmRecharge}
        onCancel={() => setModalVisible(false)}
        details={{ amount, recipient: mobileNumber }}
      />
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
        <ThemedText style={styles.pageTitle}>{t.mobileRecharge}</ThemedText>
        <TextInput
          style={styles.input}
          placeholder={t.mobileNumber}
          placeholderTextColor="#888"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder={t.amount}
          placeholderTextColor="#888"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRecharge}
        >
          <Text style={styles.primaryButtonText}>{t.recharge}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const PayBillsScreen = ({ navigation }) => {
  const { speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);
  const [searchQuery, setSearchQuery] = useState('');


  // Mock bill providers data
  const billProviders = {
    electricity: [
      { id: 'e1', name: 'Tata Power', logo: 'https://placehold.co/40x40/FF6B6B/FFFFFF?text=TP' },
      { id: 'e2', name: 'Adani Electricity', logo: 'https://placehold.co/40x40/4ECDC4/FFFFFF?text=AE' },
      { id: 'e3', name: 'BSES Rajdhani', logo: 'https://placehold.co/40x40/1A535C/FFFFFF?text=BR' },
      { id: 'e4', name: 'MSEB', logo: 'https://placehold.co/40x40/FF6B6B/FFFFFF?text=MS' },
    ],
    water: [
      { id: 'w1', name: 'Delhi Jal Board', logo: 'https://placehold.co/40x40/45B7D1/FFFFFF?text=DJB' },
      { id: 'w2', name: 'Mumbai Water Supply', logo: 'https://placehold.co/40x40/45B7D1/FFFFFF?text=MWS' },
    ],
    gas: [
      { id: 'g1', name: 'Indraprastha Gas', logo: 'https://placehold.co/40x40/FFE66D/FFFFFF?text=IG' },
      { id: 'g2', name: 'Mahanagar Gas', logo: 'https://placehold.co/40x40/FFE66D/FFFFFF?text=MG' },
      { id: 'g3', name: 'Adani Gas', logo: 'https://placehold.co/40x40/FFE66D/FFFFFF?text=AG' },
    ],
    broadband: [
      { id: 'b1', name: 'Airtel Broadband', logo: 'https://placehold.co/40x40/FF9F1C/FFFFFF?text=AB' },
      { id: 'b2', name: 'Jio Fiber', logo: 'https://placehold.co/40x40/FF9F1C/FFFFFF?text=JF' },
      { id: 'b3', name: 'BSNL Broadband', logo: 'https://placehold.co/40x40/FF9F1C/FFFFFF?text=BB' },
      { id: 'b4', name: 'ACT Fibernet', logo: 'https://placehold.co/40x40/FF9F1C/FFFFFF?text=AF' },
    ],
    dth: [
      { id: 'd1', name: 'Tata Sky', logo: 'https://placehold.co/40x40/6B5CA5/FFFFFF?text=TS' },
      { id: 'd2', name: 'Dish TV', logo: 'https://placehold.co/40x40/6B5CA5/FFFFFF?text=DT' },
      { id: 'd3', name: 'Airtel Digital TV', logo: 'https://placehold.co/40x40/6B5CA5/FFFFFF?text=AD' },
    ]
  };


  useEffect(() => {
    speak(t.payBills);
  }, []);


  const renderBillProvider = (provider) => (
    <TouchableOpacity 
      key={provider.id} 
      style={styles.billProviderItem}
      onPress={() => {
        speak(`Selected ${provider.name}`);
        navigation.navigate('SendMoney', { upiId: provider.name });
      }}
    >
      <Image source={{ uri: provider.logo }} style={styles.billProviderLogo} />
      <ThemedText style={styles.billProviderName}>{provider.name}</ThemedText>
    </TouchableOpacity>
  );


  const filteredProviders = searchQuery ? 
    Object.values(billProviders)
      .flat()
      .filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) : null;


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <ScrollView style={{ padding: 16, marginTop: 40 }}>
        <ThemedText style={styles.pageTitle}>{t.payBills}</ThemedText>


    <TextInput
      style={styles.billSearchInput}
      placeholder="Search bill providers"
      placeholderTextColor="#888"
      value={searchQuery}
      onChangeText={setSearchQuery}
    />

    {searchQuery ? (
      <View>
        <ThemedText style={styles.billTypeTitle}>Search Results</ThemedText>
        {filteredProviders.length > 0 ? 
          filteredProviders.map(provider => renderBillProvider(provider)) : 
          <ThemedText>No providers found matching "{searchQuery}"</ThemedText>
        }
      </View>
    ) : (
      <>
        <View style={styles.billTypeContainer}>
          <ThemedText style={styles.billTypeTitle}>Electricity</ThemedText>
          {billProviders.electricity.map(provider => renderBillProvider(provider))}
        </View>
        
        <View style={styles.billTypeContainer}>
          <ThemedText style={styles.billTypeTitle}>Water</ThemedText>
          {billProviders.water.map(provider => renderBillProvider(provider))}
        </View>
        
        <View style={styles.billTypeContainer}>
          <ThemedText style={styles.billTypeTitle}>Gas</ThemedText>
          {billProviders.gas.map(provider => renderBillProvider(provider))}
        </View>
        
        <View style={styles.billTypeContainer}>
          <ThemedText style={styles.billTypeTitle}>Broadband & Internet</ThemedText>
          {billProviders.broadband.map(provider => renderBillProvider(provider))}
        </View>
        
        <View style={styles.billTypeContainer}>
          <ThemedText style={styles.billTypeTitle}>DTH & Cable TV</ThemedText>
          {billProviders.dth.map(provider => renderBillProvider(provider))}
        </View>
      </>
    )}
  </ScrollView>
</SafeAreaView>

  );
};


const OffersScreen = ({ navigation }) => {
  const { speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  // Mock offers data
  const offers = [
    {
      id: 'o1',
      title: 'Get 10% Cashback on Mobile Recharges',
      description: 'Recharge your mobile and get 10% cashback up to ₹50. Valid on all operators.',
      image: 'https://placehold.co/600x120/00baf2/FFFFFF?text=10%+Cashback',
      code: 'MOBILE10',
      expiry: 'Valid till August 31, 2025'
    },
    {
      id: 'o2',
      title: 'Flat ₹100 Off on Electricity Bills',
      description: 'Pay your electricity bill and get flat ₹100 off on bills above ₹1000.',
      image: 'https://placehold.co/600x120/FF6B6B/FFFFFF?text=₹100+Off',
      code: 'POWER100',
      expiry: 'Valid till September 15, 2025'
    },
    {
      id: 'o3',
      title: '5% Cashback on DTH Recharges',
      description: 'Recharge your DTH and get 5% cashback up to ₹75. Valid on all operators.',
      image: 'https://placehold.co/600x120/4ECDC4/FFFFFF?text=5%+Cashback',
      code: 'DTH5',
      expiry: 'Valid till September 30, 2025'
    },
    {
      id: 'o4',
      title: 'Zero Fee Money Transfers',
      description: 'Send money to anyone without any transaction fee. Limited time offer!',
      image: 'https://placehold.co/600x120/FFE66D/FFFFFF?text=Zero+Fee',
      code: 'ZEROFEE',
      expiry: 'Valid till August 25, 2025'
    },
    {
      id: 'o5',
      title: 'Win Exciting Rewards',
      description: 'Make 5 transactions above ₹500 and get a chance to win exciting rewards.',
      image: 'https://placehold.co/600x120/FF9F1C/FFFFFF?text=Win+Rewards',
      code: 'REWARDS5',
      expiry: 'Valid till October 10, 2025'
    }
  ];


  useEffect(() => {
    speak(t.offers);
  }, []);


  const renderOffer = ({ item }) => (
    <Card style={styles.offerCard}>
      <Image source={{ uri: item.image }} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <ThemedText style={styles.offerTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.offerDescription}>{item.description}</ThemedText>
        <ThemedText style={styles.offerCode}>Use code: {item.code}</ThemedText>
        <ThemedText style={styles.offerExpiry}>{item.expiry}</ThemedText>
      </View>
    </Card>
  );


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          speak('Going back');
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#00baf2" />
      </TouchableOpacity>
      <View style={{ flex: 1, padding: 16, marginTop: 40 }}>
        <ThemedText style={styles.pageTitle}>{t.exclusiveOffers}</ThemedText>
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};


const QRScreen = () => {
  const { user, speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  useEffect(() => {
    speak(t.myQrCode);
  }, []);


  return (
    <SafeAreaView style={styles.qrContainer}>
      <Card style={styles.qrCard}>
        <ThemedText style={styles.pageTitle}>{t.myQrCode}</ThemedText>
        <QRCode
          value={user.upiId}
          size={200}
          color={highContrast ? highContrastTheme.text : darkTheme ? darkThemeColors.text : '#000'}
          backgroundColor={highContrast ? highContrastTheme.card : darkTheme ? darkThemeColors.card : '#fff'}
        />
        <ThemedText style={styles.qrName}>{user.name}</ThemedText>
        <ThemedText style={styles.qrUpiId}>{user.upiId}</ThemedText>
      </Card>
    </SafeAreaView>
  );
};


const QuickPayScreen = ({ navigation }) => {
  const { speak, language, darkTheme, highContrast, largeTextMode } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  useEffect(() => {
    speak(t.quickPay);
  }, []);


  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.quickPayItem}
      onPress={() => {
        speak(`${t.sendMoney} to ${item.name}`);
        navigation.navigate('SendMoney', { upiId: item.upi });
      }}
    >
      <View style={styles.transactionIcon}>
        <FontAwesome5 name="user" size={20} color="#00baf2" />
      </View>
      <View style={styles.quickPayDetails}>
        <ThemedText style={styles.quickPayName}>{item.name}</ThemedText>
        <ThemedText style={styles.quickPayUpi}>{item.upi}</ThemedText>
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.pageTitle}>{t.quickPay}</ThemedText>
      <FlatList
        data={MOCK_FAVORITES}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};


// --- CUSTOM DRAWER CONTENT ---
const CustomDrawerContent = (props) => {
  const { language, speak, darkTheme, highContrast, largeTextMode, user } = useContext(AppCtx);
  const t = translations[language];
  const styles = createStyles(darkTheme, highContrast, largeTextMode);


  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerSection}>
        <View style={styles.drawerRow}>
          <Image
            source={{ uri: 'https://placehold.co/40x40/FFFFFF/00baf2?text=IP' }}
            style={styles.headerLogo}
          />
          <ThemedText style={styles.drawerRowLabel}>{user.name}</ThemedText>
        </View>
      </View>
      <DrawerItem
        label={t.home}
        onPress={() => {
          speak(t.home);
          props.navigation.navigate('HomeDrawer');
        }}
        labelStyle={styles.drawerRowLabel}
        icon={() => <Ionicons name="home" size={24} color="#00baf2" />}
      />
      <DrawerItem
        label={t.transactionHistory}
        onPress={() => {
          speak(t.transactionHistory);
          props.navigation.navigate('History');
        }}
        labelStyle={styles.drawerRowLabel}
        icon={() => <MaterialCommunityIcons name="history" size={24} color="#00baf2" />}
      />
      <DrawerItem
        label={t.myQrCode}
        onPress={() => {
          speak(t.myQrCode);
          props.navigation.navigate('QRCode');
        }}
        labelStyle={styles.drawerRowLabel}
        icon={() => <MaterialCommunityIcons name="qrcode" size={24} color="#00baf2" />}
      />
      <DrawerItem
        label={t.quickPay}
        onPress={() => {
          speak(t.quickPay);
          props.navigation.navigate('QuickPay');
        }}
        labelStyle={styles.drawerRowLabel}
        icon={() => <MaterialCommunityIcons name="flash" size={24} color="#00baf2" />}
      />
      <DrawerItem
        label={t.settings}
        onPress={() => {
          speak(t.settings);
          props.navigation.navigate('Settings');
        }}
        labelStyle={styles.drawerRowLabel}
        icon={() => <Ionicons name="settings" size={24} color="#00baf2" />}
      />
    </DrawerContentScrollView>
  );
};


// --- NAVIGATION SETUP ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const MainTabs = () => {
  const { language, darkTheme } = useContext(AppCtx);
  const t = translations[language];


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: darkTheme ? darkThemeColors.card : lightThemeColors.card,
          borderTopColor: darkTheme ? darkThemeColors.border : lightThemeColors.border,
        },
        tabBarActiveTintColor: '#00baf2',
        tabBarInactiveTintColor: darkTheme ? darkThemeColors.text : lightThemeColors.text,
      }}
    >
      <Tab.Screen
        name="HomeDrawer"
        component={HomeDrawer}
        options={{
          tabBarLabel: t.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t.history,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRScreen}
        options={{
          tabBarLabel: t.myQrCode,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="qrcode" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="QuickPay"
        component={QuickPayScreen}
        options={{
          tabBarLabel: t.quickPay,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="flash" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t.settings,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};


const HomeDrawer = () => {
  const { darkTheme } = useContext(AppCtx);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: darkTheme ? darkThemeColors.background : lightThemeColors.background,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};


const AppNavigator = () => {
  const { isAuthenticated } = useContext(AppCtx);


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Password" component={PasswordScreen} />
          <Stack.Screen name="Balance" component={BalanceScreen} />
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
          <Stack.Screen name="VoicePay" component={VoicePayScreen} />
          <Stack.Screen name="Recharge" component={RechargeScreen} />
          <Stack.Screen name="PayBills" component={PayBillsScreen} />
          <Stack.Screen name="Offers" component={OffersScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};


// --- MAIN APP ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [transactions, setTransactions] = useState(INITIAL_MOCK_TRANSACTIONS);
  const [balance, setBalance] = useState(MOCK_BALANCE);
  const [darkTheme, setDarkTheme] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(MOCK_USER);


  const speak = (text) => {
    Speech.speak(text, { language: language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US' });
  };


  const hapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };


  const login = () => {
    setIsAuthenticated(true);
    speak(translations[language].welcomeBack);
  };


  const logout = () => {
    setIsAuthenticated(false);
    setUserPassword('');
    speak(translations[language].logout);
  };


  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };


  const deductBalance = (amount) => {
    setBalance((prev) => prev - amount);
  };


  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      userPassword,
      setUserPassword,
      transactions,
      addTransaction,
      balance,
      deductBalance,
      darkTheme,
      setDarkTheme,
      simplifiedMode,
      setSimplifiedMode,
      highContrast,
      setHighContrast,
      largeTextMode,
      setLargeTextMode,
      emergencyContact,
      setEmergencyContact,
      language,
      setLanguage,
      speak,
      hapticFeedback,
      user,
    }),
    [
      isAuthenticated,
      userPassword,
      transactions,
      balance,
      darkTheme,
      simplifiedMode,
      highContrast,
      largeTextMode,
      emergencyContact,
      language,
      user,
    ]
  );


  return (
    <AppCtx.Provider value={contextValue}>      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: darkTheme ? darkThemeColors.background : lightThemeColors.background,
          },
        }}
      >
        <StatusBar barStyle={darkTheme ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </NavigationContainer>
    </AppCtx.Provider>
  );
}

function QRScanner() {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`QR code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={{ flex: 1 }}
    />
  );
}

