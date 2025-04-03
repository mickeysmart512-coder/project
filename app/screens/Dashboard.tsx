import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Animated, Easing, StyleSheet, Modal, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
import Loader from './Loader';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: any;
}

const Dashboard = ({ route, navigation }: RouterProps) => {
  // State declarations
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const user = route.params?.user || {};
  const profilePic = user.picture || 'https://via.placeholder.com/150';

  // Animation refs
  const depositAnim = useRef(new Animated.Value(0)).current;
  const withdrawAnim = useRef(new Animated.Value(0)).current;
  const optionsMenuAnim = useRef(new Animated.Value(0)).current;

// Fetch user data including all group payments
const fetchUserData = async () => {
  try {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    // Get user document
    const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
    if (!userDoc.exists()) {
      console.log('User document not found');
      return;
    }

    const userData = userDoc.data();
    setUserName(`${userData.firstname} ${userData.lastname}`);          
    setUserBalance(userData.balance ? parseFloat(userData.balance).toFixed(2) : '0.00');

    // Get all group IDs the user belongs to
    const groupIds = [];
    
    // Check for multiple groups (new structure)
    if (userData.groupIds && userData.groupIds.length > 0) {
      groupIds.push(...userData.groupIds);
    }
    // Check for single group (backward compatibility)
    else if (userData.groupId) {
      groupIds.push(userData.groupId);
    }
    // Fallback to query groups collection (oldest structure)
    else {
      const groupsQuery = query(
        collection(FIREBASE_DB, 'groups'),
        where('members', 'array-contains', userId)
      );
      const groupsSnapshot = await getDocs(groupsQuery);
      groupsSnapshot.forEach(doc => {
        groupIds.push(doc.id);
      });
    }

    // If no groups found
    if (groupIds.length === 0) {
      setUpcomingPayments([]);
      return;
    }

    // Fetch payment data for all groups
    const payments = [];
    for (const groupId of groupIds) {
      try {
        const payment = await getGroupPaymentData(groupId);
        if (payment) {
          payments.push(payment);
        }
      } catch (error) {
        console.error(`Error processing group ${groupId}:`, error);
      }
    }

    setUpcomingPayments(payments);
  } catch (error) {
    console.error('Error fetching user data:', error);
    setUpcomingPayments([]);
  } finally {
    setLoadingPayments(false);
  }
};

// Helper function to get payment data for a single group
const getGroupPaymentData = async (groupId: string) => {
  const groupDoc = await getDoc(doc(FIREBASE_DB, 'groups', groupId));
  if (!groupDoc.exists()) return null;

  const groupData = groupDoc.data();
  
  // Skip if no contribution amount set
  if (!groupData.contributionAmount || groupData.contributionAmount <= 0) {
    return null;
  }

  // Calculate next payment date (same logic as GroupDashboard)
  const groupCreationDay = moment(groupData.createdAt.toDate());
  let contributionDays = [];
  
  switch (groupCreationDay.format('dddd')) {
    case 'Monday': contributionDays = ['Wednesday', 'Thursday']; break;
    case 'Tuesday': contributionDays = ['Thursday', 'Friday']; break;
    case 'Wednesday': contributionDays = ['Friday', 'Saturday']; break;
    default: contributionDays = ['Wednesday', 'Thursday'];
  }

  const today = moment();
  const nextDue = contributionDays.includes(today.format('dddd')) 
    ? today 
    : moment().day(contributionDays[0]);

  return {
    groupId,
    groupName: groupData.name,
    nextPaymentDate: nextDue.format('DD/MM'),
    amount: groupData.contributionAmount
  };
};

// Render the Schedule Payments section (updated to use groupId as key)
const renderSchedulePayments = () => {
  if (loadingPayments) {
    return (
      <View style={styles.paymentItem}>
        <Loader />
      </View>
    );
  }

  if (upcomingPayments.length === 0) {
    return (
      <View style={styles.noPayments}>
        <Text style={styles.noPaymentsText}>No upcoming payments</Text>
      </View>
    );
  }

  return upcomingPayments.map((payment) => (
    <TouchableOpacity 
      key={payment.groupId} 
      style={styles.paymentItem}
      onPress={() => navigation.navigate('GroupDashboard', { 
        groupId: payment.groupId 
      })}
    >
      <MaterialIcons name="account-balance-wallet" size={24} color="#10B981" />
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>{payment.groupName}</Text>
        <Text style={styles.paymentDate}>
          Next Payment: {payment.nextPaymentDate}
        </Text>
      </View>
      <Text style={styles.paymentAmount}>
        ₦{payment.amount.toLocaleString()}
      </Text>
    </TouchableOpacity>
  ));
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
      console.error('Sign-out error:', error);
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
              <Loader />
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
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('NotAvailable')}>
            <MaterialIcons name="compare-arrows" size={24} color="#6B7280" />
            <Text style={styles.quickActionText}>Loan</Text>
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
            <FontAwesome5 name="shield-alt" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Security</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <FontAwesome5 name="bullseye" size={24} color="#3B82F6" />
            <Text style={styles.serviceText}>Savings Goal</Text>
          </TouchableOpacity>
        </View>

        

<View style={styles.schedulePayments}>
  <Text style={styles.sectionTitle}>Schedule Payments</Text>
  {renderSchedulePayments()}
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
      

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('TransactionHistory')}>
          <Ionicons name="sync-outline" size={24} color="white" />
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
    borderRadius: 15,
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
  noPayments: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPaymentsText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default Dashboard;


