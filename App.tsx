import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import Login from './app/screens/Login';
import LoginPin from './app/screens/LoginPin';
import SignUp from './app/screens/SignUp';
import LandingPage from './app/screens/LandingPage';
import OnboardingPage1 from './app/screens/Onboarding1';
import OnboardingPage2 from './app/screens/Onboarding2';
import OnboardingPage3 from './app/screens/Onboarding3';
import Dashboard from './app/screens/Dashboard';
import ForgotPassword from './app/screens/ForgotPassword';
import EmailVerify from './app/screens/Emailverify';
import MobileVerify from './app/screens/Mobileverify';
import MobileVerificationScreen from './app/screens/MobileVerification';
import EmailVerificationScreen from './app/screens/EmailVerification';
import Withdraw from './app/screens/Withdraw';
import Deposit from './app/screens/Deposit';
import Profile from './app/screens/Profile';
import Notifications from './app/screens/Notifications';
import EditProfile from './app/screens/EditProfile';
import Groups from './app/screens/Groups';
import CreateGroup from './app/screens/CreateGroup';
import GroupDetails from './app/screens/GroupDetails';
import ManageGroup from './app/screens/ManageGroup';
import AccountVerification from './app/screens/AccountVerification';
import CreateLoginPin from './app/screens/CreateLoginPin';
import Terms from './app/screens/Terms';
import GroupMembersList from './app/screens/GroupMembersList';
import ConfirmWithdrawal from './app/screens/ConfirmWithdrawal';
import ConfirmPayment from './app/screens/ConfirmPayment';
import WithdrawSuccess from './app/screens/WithdrawSuccess';
import PaymentSuccess from './app/screens/PaymentSuccess';
import NotAvailable from './app/screens/NotAvailable';
import AccountScreen from './app/screens/AccountScreen';
import Complaint from './app/screens/Complaint';
import CreatePaymentPin from './app/screens/CreatePaymentPin';
import GroupDashboard from './app/screens/GroupDashboard';
import TransactionHistory from './app/screens/TransactionHistory';
// import VirtualAccount from './app/screens/VirtualAccount';
import ReceiptScreen from './app/screens/ReceiptScreen';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name="Dashboard" component={Dashboard} />
      {/* Add more screens that should be accessible after login here */}
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initialRoute, setInitialRoute] = useState('LandingPage');

  useEffect(() => {
    const checkUserSession = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setInitialRoute('LoginPin'); 
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        AsyncStorage.removeItem('user');
        setUser(null);
      }
    });

    checkUserSession();

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="LoginPin" component={LoginPin} />
            <Stack.Screen name="InsideLayout" component={InsideLayout} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />


          </>
        ) : (
          <>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Onboarding1" component={OnboardingPage1} />
            <Stack.Screen name="Onboarding2" component={OnboardingPage2} />
            <Stack.Screen name="Onboarding3" component={OnboardingPage3} />
          </>
        )}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="EmailVerify" component={EmailVerify} />
        <Stack.Screen name="MobileVerify" component={MobileVerify} />
        <Stack.Screen name="MobileVerification" component={MobileVerificationScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="Deposit" component={Deposit} />
        <Stack.Screen name="CreateLoginPin" component={CreateLoginPin} />
        <Stack.Screen name="Withdraw" component={Withdraw} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="Notification" component={Notifications} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="GroupDetails" component={GroupDetails} />
        <Stack.Screen name="ManageGroup" component={ManageGroup} />
        <Stack.Screen name="GroupMembersList" component={GroupMembersList} />
        <Stack.Screen name="ConfirmWithdrawal" component={ConfirmWithdrawal} />
        <Stack.Screen name="ConfirmPayment" component={ConfirmPayment} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="WithdrawSuccess" component={WithdrawSuccess} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="NotAvailable" component={NotAvailable} />
        <Stack.Screen name="AccountVerification" component={AccountVerification} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="Complaint" component={Complaint} />
        <Stack.Screen name="CreatePaymentPin" component={CreatePaymentPin} />
        <Stack.Screen name="GroupDashboard" component={GroupDashboard} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
        {/* <Stack.Screen name="VirtualAccount" component={VirtualAccount} /> */}
        <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
