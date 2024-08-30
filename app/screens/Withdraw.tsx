import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const Withdraw = ({ route, navigation }) => {
  const [balance, setBalance] = useState(route.params?.balance || 0);
  const [selectedBank, setSelectedBank] = useState('Firstbank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [paymentPin, setPaymentPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleNext = () => {
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      setInsufficientBalance(true);
      setModalVisible(true);
      return;
    }
    if (withdrawalAmount > balance) {
      setInsufficientBalance(true);
      setModalVisible(true);
    } else {
      setInsufficientBalance(false);
      setPinModalVisible(true); // Show the pin input modal
    }
  };

  const handlePinSubmit = () => {
    if (paymentPin === '1234') { // Replace '1234' with the actual logic to validate the pin
      setPinModalVisible(false);
      navigation.navigate('ConfirmWithdrawal', {
        selectedBank,
        accountName,
        accountNumber,
        amount,
        balance,
        setBalance,
        transactionID: '12569874564',
        charge: '20.00',
        onComplete: (newBalance) => {
          setBalance(newBalance);
          route.params?.onUpdateBalance(newBalance);  // Update the balance in the Dashboard
        },
      });
    } else {
      setPinError(true);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Bank</Text>
        <TouchableOpacity
          style={[styles.bankOption, selectedBank === 'Opay' && styles.selectedBankOption]}
          onPress={() => setSelectedBank('Opay')}
        >
          <Text style={styles.bankText}>Opay</Text>
          <Ionicons name={selectedBank === 'Opay' ? 'radio-button-on' : 'radio-button-off'} size={24} color="#4B0082" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bankOption, selectedBank === 'Firstbank' && styles.selectedBankOption]}
          onPress={() => setSelectedBank('Firstbank')}
        >
          <Text style={styles.bankText}>Firstbank</Text>
          <Ionicons name={selectedBank === 'Firstbank' ? 'radio-button-on' : 'radio-button-off'} size={24} color="#4B0082" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bankOption, selectedBank === 'Palmpay' && styles.selectedBankOption]}
          onPress={() => setSelectedBank('Palmpay')}
        >
          <Text style={styles.bankText}>Palmpay</Text>
          <Ionicons name={selectedBank === 'Palmpay' ? 'radio-button-on' : 'radio-button-off'} size={24} color="#4B0082" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bankOption, selectedBank === 'Other' && styles.selectedBankOption]}
          onPress={() => setSelectedBank('Other')}
        >
          <Text style={styles.bankText}>Other</Text>
          <Ionicons name={selectedBank === 'Other' ? 'radio-button-on' : 'radio-button-off'} size={24} color="#4B0082" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Fill Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Account Name"
          value={accountName}
          onChangeText={setAccountName}
        />
        <TextInput
          style={styles.input}
          placeholder="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Description (Optional)"
          value={description}
          onChangeText={setDescription}
        />

        </View>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.withdrawButton} onPress={handleNext}>
          <Text style={styles.withdrawButtonText}>Next</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {insufficientBalance ? 'Insufficient Balance' : 'Please enter a valid amount'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={pinModalVisible}
          onRequestClose={() => setPinModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Payment Pin</Text>
              <TextInput
                style={styles.input}
                placeholder="Payment Pin"
                value={paymentPin}
                onChangeText={setPaymentPin}
                secureTextEntry
                keyboardType="numeric"
              />
              {pinError && <Text style={styles.errorText}>Invalid pin. Please try again.</Text>}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handlePinSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPinModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedBankOption: {
    borderColor: '#4B0082',
    borderWidth: 1,
  },
  bankText: {
    fontSize: 16,
    color: '#111827',
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
  },
  fingerprintIcon: {
    paddingHorizontal: 10,
  },
  withdrawButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Withdraw;







































// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Animated, Easing } from 'react-native';
// import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
// import { NavigationProp } from '@react-navigation/native';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
// import { collection, getDocs } from 'firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface RouterProps {
//   navigation: NavigationProp<any, any>;
//   route: any;
// }

// const Groups = ({ navigation }: RouterProps) => {
//   const [refreshing, setRefreshing] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [userId, setUserId] = useState('');
//   const [showQuickActions, setShowQuickActions] = useState(false);
//   const [showOptionsMenu, setShowOptionsMenu] = useState(false);

//   const depositAnim = useRef(new Animated.Value(0)).current;
//   const withdrawAnim = useRef(new Animated.Value(0)).current;
//   const optionsMenuAnim = useRef(new Animated.Value(0)).current;

//   const fetchGroups = async () => {
//     try {
//       const user = FIREBASE_AUTH.currentUser;
//       if (user) {
//         const userId = user.uid;
//         setUserId(userId);
//         const querySnapshot = await getDocs(collection(FIREBASE_DB, 'groups'));
//         const userGroups: any = [];
//         querySnapshot.forEach((doc) => {
//           const groupData = doc.data();
//           if (groupData.members.includes(userId)) {
//             userGroups.push({ id: doc.id, ...groupData });
//           }
//         });
//         setGroups(userGroups);
//       } else {
//         console.error('User is not authenticated');
//       }
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//       Alert.alert('Error', 'Could not fetch groups. Please try again.');
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchGroups().then(() => setRefreshing(false));
//   }, []);

//   const toggleQuickActions = () => {
//     setShowQuickActions(!showQuickActions);
//     if (!showQuickActions) {
//       Animated.parallel([
//         Animated.timing(depositAnim, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(withdrawAnim, {
//           toValue: 1,
//           duration: 300,
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       Animated.parallel([
//         Animated.timing(depositAnim, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.in(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(withdrawAnim, {
//           toValue: 0,
//           duration: 300,
//           easing: Easing.in(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   };

//   const toggleOptionsMenu = () => {
//     setShowOptionsMenu(!showOptionsMenu);
//     Animated.timing(optionsMenuAnim, {
//       toValue: showOptionsMenu ? 0 : 1,
//       duration: 300,
//       useNativeDriver: true,
//       easing: Easing.bounce,
//     }).start();
//   };

//   const handleSignOut = async () => {
//     try {
//       await AsyncStorage.removeItem('user');
//       await FIREBASE_AUTH.signOut();
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'LandingPage' }],
//       });
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Failed to sign out:', error.message);
//     }
//   };

//   const handleDeleteGroup = async (groupId: string) => {
//     Alert.alert('Delete Group', 'Are you sure you want to delete this group?', [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Delete',
//         onPress: async () => {
//           // Add your delete group logic here
//         },
//         style: 'destructive',
//       },
//     ]);
//   };

//   const handleLeaveGroup = async (groupId: string) => {
//     Alert.alert('Leave Group', 'Are you sure you want to leave this group?', [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Leave',
//         onPress: async () => {
//           // Add your leave group logic here
//         },
//         style: 'destructive',
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.scrollContainer}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
//       >
//         <Text style={styles.header}>Groups</Text>
//         {groups.length > 0 ? (
//           groups.map((group) => (
//             <View key={group.id} style={styles.groupCard}>
//               <View style={styles.groupInfo}>
//                 <Text style={styles.groupName}>{group.name}</Text>
//                 <Text style={styles.groupDescription}>{group.description}</Text>
//               </View>
//               <View style={styles.groupActions}>
//                 <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { groupId: group.id })}>
//                   <FontAwesome5 name="info-circle" size={24} color="#4B0082" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleLeaveGroup(group.id)}>
//                   <MaterialIcons name="exit-to-app" size={24} color="red" />
//                 </TouchableOpacity>
//                 {group.ownerId === userId && (
//                   <TouchableOpacity onPress={() => handleDeleteGroup(group.id)}>
//                     <MaterialIcons name="delete" size={24} color="red" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noGroupsText}>You are not a member of any groups yet.</Text>
//         )}
//       </ScrollView>
//       <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateGroup')}>
//         <Ionicons name="add" size={30} color="white" />
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Dashboard')}>
//           <Ionicons name="home" size={24} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Groups')}>
//           <Ionicons name="people" size={24} color="#ccc" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.centerIconContainer} onPress={toggleQuickActions}>
//           <Ionicons name="swap-horizontal" size={24} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton}>
//           <Ionicons name="wallet" size={24} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton} onPress={toggleOptionsMenu}>
//           <Ionicons name="grid" size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//       {showQuickActions && (
//         <View style={styles.quickActionsOverlay}>
//           <Animated.View style={[styles.animatedButton, { transform: [{ scale: depositAnim }] }]}>
//             <TouchableOpacity style={styles.quickActiontoggle} onPress={() => navigation.navigate('Deposit')}>
//               <MaterialIcons name="attach-money" size={24} color="#EF4444" />
//               <Text style={styles.quickActionText}>Deposit</Text>
//             </TouchableOpacity>
//           </Animated.View>
//           <Animated.View style={[styles.animatedButton, { transform: [{ scale: withdrawAnim }] }]}>
//             <TouchableOpacity style={styles.quickActiontoggle} onPress={() => navigation.navigate('Withdraw')}>
//               <MaterialIcons name="credit-card" size={24} color="#10B981" />
//               <Text style={styles.quickActionText}>Withdraw</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       )}
//       {showOptionsMenu && (
//         <Animated.View style={[styles.optionsMenu, { transform: [{ scale: optionsMenuAnim }] }]}>
//           <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Profile')}>
//             <Text style={styles.optionText}>Manage Profile</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('Complaints')}>
//             <Text style={styles.optionText}>Complaints</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('ContactUs')}>
//             <Text style={styles.optionText}>Contact Us</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.optionItem} onPress={handleSignOut}>
//             <Text style={styles.optionText}>Logout</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   scrollContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   groupCard: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//   },
//   groupInfo: {
//     marginBottom: 8,
//   },
//   groupName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   groupDescription: {
//     fontSize: 14,
//     color: '#777',
//   },
//   groupActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   noGroupsText: {
//     textAlign: 'center',
//     color: '#777',
//     marginTop: 32,
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 80,
//     right: 20,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#4B0082',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//   },
//   footer: {
//     flexDirection: 'row',
//     height: 60,
//     backgroundColor: '#4B0082',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   footerButton: {
//     alignItems: 'center',
//   },
//   centerIconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 50,
//     height: 50,
//     backgroundColor: '#6200EA',
//     borderRadius: 25,
//     marginTop: -25,
//     elevation: 4,
//   },
//   quickActionsOverlay: {
//     position: 'absolute',
//     bottom: 100,
//     right: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quickActiontoggle: {
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   quickActionText: {
//     fontSize: 12,
//     color: '#333',
//   },
//   animatedButton: {
//     alignItems: 'center',
//   },
//   optionsMenu: {
//     position: 'absolute',
//     bottom: 80,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 10,
//     elevation: 5,
//   },
//   optionItem: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default Groups;
