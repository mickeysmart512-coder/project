import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Animated, Easing, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Loader from './Loader'; // Import the new Loader component

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: any;
}

const Dashboard = ({ route, navigation }: RouterProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string | null>(null); // Change initial state to null
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false); // State for pin entry modal
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const user = route.params?.user || {};
  const profilePic = user.picture || 'https://via.placeholder.com/150';

  const depositAnim = useRef(new Animated.Value(0)).current;
  const withdrawAnim = useRef(new Animated.Value(0)).current;
  const optionsMenuAnim = useRef(new Animated.Value(0)).current;

  const fetchUserData = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
          setUserBalance(userData.wallet ? userData.wallet.toFixed(2) : '0.00');
        } else {
          console.log('No such document!');
        }
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const checkPin = async () => {
      const storedPin = await AsyncStorage.getItem('loginPin');
      if (storedPin) {
        setShowPinEntry(true);
      }
    };
    checkPin();
    fetchUserData();
  }, [route.params?.updatedBalance]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await FIREBASE_AUTH.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LandingPage' }],
      });
    } catch (error) {
      console.log(error);
      alert('Failed to sign out: ' + error.message);
    }
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
    Animated.timing(depositAnim, {
      toValue: showQuickActions ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
    Animated.timing(withdrawAnim, {
      toValue: showQuickActions ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  };

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
    Animated.timing(optionsMenuAnim, {
      toValue: showOptionsMenu ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  };

  const handlePinSubmit = async () => {
    const storedPin = await AsyncStorage.getItem('loginPin');
    if (storedPin === pin) {
      setShowPinEntry(false);
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}></Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.topNotification}>
            <MaterialIcons name="notifications-none" size={24} color="#4B0082" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.walletContainer}>
            <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate('AccountScreen')}>
              <MaterialIcons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.balanceTitle}>Available Balance</Text>
            {userBalance === null ? (
              <Loader /> // Use Loader component here
            ) : (
              <Text style={styles.balanceAmount}>₦{userBalance}</Text>
            )}
            <Text style={styles.accountNumber}>**** **** **** 8635</Text>
            <Text style={styles.accountHolder}>Account Holder: {userName || 'Loading...'}</Text>
          </View>
        </View>

        <Text style={styles.actionHeader}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Withdraw', { balance: userBalance })}>
            <MaterialIcons name="credit-card" size={24} color="#10B981" />
            <Text style={styles.quickActionText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Deposit')}>
            <MaterialIcons name="attach-money" size={24} color="#EF4444" />
            <Text style={styles.quickActionText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('ToMember')}>
            <MaterialIcons name="compare-arrows" size={24} color="#6B7280" />
            <Text style={styles.quickActionText}>Transfer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.serviceHeader}>Service</Text>
        <View style={styles.servicesContainer}>
          <TouchableOpacity style={styles.serviceItem}>
            <FontAwesome5 name="money-check-alt" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>View Contribution</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <FontAwesome5 name="clipboard-list" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Budget Planner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('NotAvailable')}>
            <FontAwesome5 name="wallet" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <FontAwesome5 name="bullseye" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Savings Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('NotAvailable')}>
            <FontAwesome5 name="shield-alt" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Insurance</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.schedulePayments}>
          <Text style={styles.sectionTitle}>Schedule Payments</Text>
          <TouchableOpacity style={styles.paymentItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#10B981" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Taj Corporative</Text>
              <Text style={styles.paymentDate}>Next Payment: 12/04</Text>
            </View>
            <Text style={styles.paymentAmount}>₦10,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#10B981" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Taj Corporative</Text>
              <Text style={styles.paymentDate}>Next Payment: 12/04</Text>
            </View>
            <Text style={styles.paymentAmount}>₦10,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#10B981" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Taj Corporative</Text>
              <Text style={styles.paymentDate}>Next Payment: 12/04</Text>
            </View>
            <Text style={styles.paymentAmount}>₦10,000</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Groups')}>
          <Ionicons name="people" size={24} color="white" />
        </TouchableOpacity>
       
        <TouchableOpacity  style={styles.centerIconContainer} onPress={toggleQuickActions}>
          <Ionicons name="swap-horizontal" size={24} color="white" />
          </TouchableOpacity>
      

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('NotAvailable')}>
          <Ionicons name="wallet" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={toggleOptionsMenu}>
          <Ionicons name="grid" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showQuickActions && (
        <View style={styles.quickActionsOverlay}>
          <Animated.View style={[styles.animatedButton, { transform: [{ scale: depositAnim }] }]}>
            <TouchableOpacity style={styles.quickActiontoggle} onPress={() => navigation.navigate('Deposit')}>
              <MaterialIcons name="attach-money" size={24} color="#EF4444" />
              <Text style={styles.quickActionText}>Deposit</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.animatedButton, { transform: [{ scale: withdrawAnim }] }]}>
            <TouchableOpacity style={styles.quickActiontoggle} onPress={() => navigation.navigate('Withdraw', { balance: userBalance })}>
              <MaterialIcons name="credit-card" size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Withdraw</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {showOptionsMenu && (
        <Animated.View style={[styles.optionsMenu, { transform: [{ scale: optionsMenuAnim }] }]}>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.optionText}>Manage Profile</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Complaint')}>
            <Text style={styles.optionText}>Complaints</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('ContactUs')}>
            <Text style={styles.optionText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={handleSignOut}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    // paddingHorizontal: 16,
    paddingTop: 48,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    left: 20,
  },
  topNotification:{
left: -20,
  },
  balanceCard: {
    backgroundColor: '#4B0082',
    borderRadius: 10,
    width: 300,
    padding: 25,
    marginBottom: 20,
    left: 10,
  },
  walletContainer: {
    padding: 5,
    
  },
  setting:{
    left: 120,
    marginLeft: 100,
    top: -5,
    marginBottom: -30,
  },

  actionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    left: 10,
  },
  balanceTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 15,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  accountNumber: {
    color: '#FFFFFF',
    marginTop: 10,
  },
  accountHolder: {
    color: '#FFFFFF',
    marginTop: 5,
    fontSize: 13,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderColor: '#fff',
    paddingHorizontal: 10,

  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    marginBottom: 30,
  },
  quickActionText: {
    marginTop: 5,
    color: '#374151',
    fontSize: 12,
    
  },


  quickActiontoggle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    // flexDirection: 'row',
    padding: 15,
    alignContent: 'flex-end',
    borderRadius: 50,
    marginBottom: 25,
    right: 35,
    marginRight: 25,
  },

  quickActionTexttoggle: {
    marginTop: 5,
    color: '#374151',
    fontSize: 12,
  },



  centerIconContainer: {   
     width: 80,
     height: 80,
    borderRadius: 50,
     backgroundColor: '#3B82F6',
     alignItems: 'center',
    justifyContent: 'center',
    marginTop: -35,  
  
  },

  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    left: 3,
  },
  serviceItem: {
    alignItems: 'center',
    flex: 1,
  },
  serviceText: {
    marginTop: 5,
    color: '#4B0082',
    fontSize: 12,
    textAlign: 'center',
  },
  serviceHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    left: 20,
  },
  schedulePayments: {
    marginBottom: 20,
    marginTop: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 15,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  paymentDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  footer: {
    flexDirection: 'row',
  justifyContent: 'space-around', 
  paddingVertical: 10,
  backgroundColor: '#4B0082',
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  height: 80,

  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 24,
  },
  quickActionsOverlay: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    flexDirection: 'row',
  },
  animatedButton: {
    marginVertical: 10,
  },
  optionsMenu: {
    position: 'absolute',
    width: 200,
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  optionItem: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#4B0082',
  },
});

export default Dashboard;


