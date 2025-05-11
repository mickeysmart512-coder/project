// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
// import { FontAwesome, Ionicons } from '@expo/vector-icons';
// import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import moment from 'moment';

// // Format Date Function
// const formatDate = (timestamp) => {
//   if (!timestamp) return 'N/A';
//   const date = new Date(timestamp.seconds * 1000);
//   return date.toLocaleDateString();
// };

// const GroupDashboard = ({ route, navigation }) => {
//   const { groupId } = route.params || {};
//   const [group, setGroup] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [hasPaidRegistrationFee, setHasPaidRegistrationFee] = useState(false);
//   const [hasPaidContribution, setHasPaidContribution] = useState(false);
//   const [showAnnouncement, setShowAnnouncement] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [contributionDays, setContributionDays] = useState([]);
//   const [payoutDay, setPayoutDay] = useState('');
//   const [nextDueDate, setNextDueDate] = useState('');
//   const db = getFirestore();
//   const auth = getAuth();

//   // Set current user ID
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setCurrentUserId(user.uid);
//       } else {
//         console.error('No user is signed in');
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   // Fetch group details and users
//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       if (!groupId) {
//         console.error('Group ID is not provided');
//         return;
//       }
//       try {
//         const groupDoc = await getDoc(doc(db, 'groups', groupId));
//         if (groupDoc.exists()) {
//           const groupData = groupDoc.data();
//           setGroup(groupData);

//           // Calculate contribution days and payout day
//           const groupCreationDay = moment(groupData.createdAt.toDate());
//           let contributionDays = [];
//           let payoutDay = '';

//           // Logic for determining contribution and payout days
//           switch (groupCreationDay.format('dddd')) {
//             case 'Monday':
//               contributionDays = ['Wednesday', 'Thursday'];
//               payoutDay = 'Sunday';
//               break;
//             case 'Tuesday':
//               contributionDays = ['Thursday', 'Friday'];
//               payoutDay = 'Monday';
//               break;
//             case 'Wednesday':
//               contributionDays = ['Friday', 'Saturday'];
//               payoutDay = 'Tuesday';
//               break;
//             default:
//               contributionDays = ['Wednesday', 'Thursday'];
//               payoutDay = 'Sunday';
//           }

//           setContributionDays(contributionDays);
//           setPayoutDay(payoutDay);

//           // Calculate the next due date for contributions
//           const today = moment();
//           let nextDue = today;

//           if (contributionDays.includes(today.format('dddd'))) {
//             nextDue = today;
//           } else {
//             nextDue = moment().day(contributionDays[0]); // Set to the next contribution day
//           }

//           setNextDueDate(nextDue.format('DD/MM/YYYY'));

//           // Fetch users
//           const usersQuery = query(collection(db, 'users'), where('groupId', '==', groupId));
//           const querySnapshot = await getDocs(usersQuery);
//           const usersList = querySnapshot.docs.map(doc => doc.data());
//           setUsers(usersList);

//           // Check if current user has paid registration fee and contribution
//           const currentUser = usersList.find(user => user.id === currentUserId);
//           if (currentUser) {
//             setHasPaidRegistrationFee(currentUser.hasPaidRegistrationFee);
//             setHasPaidContribution(currentUser.hasPaidContribution);
//           }
//         } else {
//           console.error('Group data not found');
//         }
//       } catch (error) {
//         console.error('Error fetching group details or users:', error);
//       }
//     };

//     fetchGroupDetails();
//   }, [db, groupId, currentUserId]);

//   // Handle Pay Registration Fee
//   const handlePayRegistrationFee = async () => {
//     try {
//       if (group.isRegistrationFee && !hasPaidRegistrationFee) {
//         await updateDoc(doc(db, 'users', currentUserId), {
//           hasPaidRegistrationFee: true,
//         });
//         setHasPaidRegistrationFee(true);
//       }

//       if (!hasPaidContribution) {
//         await updateDoc(doc(db, 'users', currentUserId), {
//           hasPaidContribution: true,
//         });
//         setHasPaidContribution(true);
//       }

//       Alert.alert('Payment Successful', 'You have successfully made the payment.');
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       Alert.alert('Payment Error', 'There was an issue processing your payment.');
//     }
//   };

//   // Handle Leave Group
//   const handleLeaveGroup = async () => {
//     if (!currentUserId) {
//       console.error('Current user ID is not defined');
//       return;
//     }

//     Alert.alert(
//       'Leave Group',
//       'Are you sure you want to leave this group?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Leave',
//           onPress: async () => {
//             try {
//               const groupRef = doc(db, 'groups', groupId);
//               const groupDoc = await getDoc(groupRef);

//               if (!groupDoc.exists()) {
//                 console.error('Group does not exist');
//                 return;
//               }

//               const groupData = groupDoc.data();
//               if (!groupData.members || !groupData.members.includes(currentUserId)) {
//                 console.error('User is not a member of the group');
//                 return;
//               }

//               await updateDoc(groupRef, {
//                 members: arrayRemove(currentUserId),
//               });

//               const userRef = doc(db, 'users', currentUserId);
//               await updateDoc(userRef, {
//                 groupId: null,
//               });

//               if (groupData.members.length === 1) {
//                 await deleteDoc(groupRef);
//               }

//               navigation.navigate('Groups');
//             } catch (error) {
//               console.error('Error leaving group:', error);
//             }
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Handle Pay Contribution
//   const handlePayContribution = () => {
//     const today = moment().format('dddd');
//     if (!contributionDays.includes(today)) {
//       Alert.alert('Info', `You can only make contributions on ${contributionDays.join(' and ')}.`);
//       return;
//     }

//     // Handle the contribution payment logic here
//   };

//   // Handle Close Announcement
//   const handleCloseAnnouncement = () => {
//     setShowAnnouncement(false);
//   };

//   if (!group) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <FontAwesome name="angle-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{group.name}</Text>
//         <TouchableOpacity onPress={handleLeaveGroup}>
//           <Ionicons name="settings" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {group.announcement && showAnnouncement && (
//         <Modal
//           transparent={true}
//           animationType="slide"
//           visible={showAnnouncement}
//         >
//           <View style={styles.announcementModal}>
//             <View style={styles.announcementModalContent}>
//               <Text style={styles.announcementModalTitle}>Announcement</Text>
//               <Text style={styles.announcementModalText}>{group.announcement}</Text>
//               <TouchableOpacity onPress={handleCloseAnnouncement} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}

//       <Text style={styles.title}>Group Dashboard</Text>

//       <Text style={styles.groupName}>{group.name}</Text>
//       <Text style={styles.groupDescription}>{group.description}</Text>

//       <View style={styles.goalSection}>
//         <Text style={styles.goalText}>Duration: {formatDate(group.startDate)} - {formatDate(group.endDate)}</Text>
//       </View>

//       <View style={styles.payoutDetailsSection}>
//         <Text style={styles.payoutDetailsTitle}>Payout Details</Text>
//         <Text style={styles.payoutDetailsText}>Payout Option: {group.payoutPlan || 'N/A'}</Text>
//         <Text style={styles.payoutDetailsText}>Contribution Duration: {group.contributionDuration || 'N/A'}</Text>
//         <Text style={styles.payoutDetailsText}>Payout Per Person: ₦{group.payoutPerUser || 'N/A'}</Text>
//       </View>

//       <View style={styles.profitSection}>
//         <Text style={styles.profitText}>Profit</Text>
//         <Text style={styles.profitAmount}>No Contribution</Text>
//       </View>

//       <View style={styles.paymentSection}>
//         {!hasPaidRegistrationFee && group.isRegistrationFee && (
//           <TouchableOpacity onPress={handlePayRegistrationFee} style={styles.payButton}>
//             <Text style={styles.payButtonText}>Pay Registration Fee</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity onPress={handlePayContribution} style={styles.payButton}>
//           <Text style={styles.payButtonText}>Pay Contribution</Text>
//         </TouchableOpacity>

//         <Text style={styles.nextDueDateText}>Next Due Date: {nextDueDate}</Text>
//       </View>

//       <View style={styles.memberSection}>
//         <Text style={styles.memberSectionTitle}>Group Members</Text>
//         {users.map(user => (
//           <Text key={user.id} style={styles.memberText}>{user.username}</Text>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   groupName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   groupDescription: {
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   goalSection: {
//     marginBottom: 20,
//   },
//   goalText: {
//     fontSize: 16,
//   },
//   payoutDetailsSection: {
//     marginBottom: 20,
//   },
//   payoutDetailsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   payoutDetailsText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   profitSection: {
//     marginBottom: 20,
//   },
//   profitText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   profitAmount: {
//     fontSize: 16,
//   },
//   paymentSection: {
//     marginBottom: 20,
//   },
//   payButton: {
//     backgroundColor: '#28a745',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   payButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   nextDueDateText: {
//     fontSize: 16,
//     color: '#555',
//   },
//   memberSection: {
//     marginBottom: 20,
//   },
//   memberSectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   memberText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   announcementModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   announcementModalContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   announcementModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   announcementModalText: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   closeButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default GroupDashboard;










// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, StatusBar } from 'react-native';
// import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
// import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import moment from 'moment';

// // Theme Colors
// const COLORS = {
//   primary: '#4A6CF7', // Blue
//   secondary: '#9C27B0', // Purple
//   white: '#FFFFFF',
//   lightGray: '#F5F5F5',
//   darkGray: '#333333',
//   success: '#4CAF50',
//   warning: '#FF9800',
//   danger: '#F44336',
// };

// // Format Date Function
// const formatDate = (timestamp) => {
//   if (!timestamp) return 'N/A';
//   const date = new Date(timestamp.seconds * 1000);
//   return date.toLocaleDateString();
// };

// const GroupDashboard = ({ route, navigation }) => {
//   const { groupId } = route.params || {};
//   const [group, setGroup] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [hasPaidRegistrationFee, setHasPaidRegistrationFee] = useState(false);
//   const [hasPaidContribution, setHasPaidContribution] = useState(false);
//   const [showAnnouncement, setShowAnnouncement] = useState(true);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [contributionDays, setContributionDays] = useState([]);
//   const [payoutDay, setPayoutDay] = useState('');
//   const [nextDueDate, setNextDueDate] = useState('');
//   const db = getFirestore();
//   const auth = getAuth();

//   // Set current user ID
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setCurrentUserId(user.uid);
//       } else {
//         console.error('No user is signed in');
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   // Fetch group details and users
//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       if (!groupId) {
//         console.error('Group ID is not provided');
//         return;
//       }
//       try {
//         const groupDoc = await getDoc(doc(db, 'groups', groupId));
//         if (groupDoc.exists()) {
//           const groupData = groupDoc.data();
//           setGroup(groupData);

//           // Calculate contribution days and payout day
//           const groupCreationDay = moment(groupData.createdAt.toDate());
//           let contributionDays = [];
//           let payoutDay = '';

//           // Logic for determining contribution and payout days
//           switch (groupCreationDay.format('dddd')) {
//             case 'Monday':
//               contributionDays = ['Wednesday', 'Thursday'];
//               payoutDay = 'Sunday';
//               break;
//             case 'Tuesday':
//               contributionDays = ['Thursday', 'Friday'];
//               payoutDay = 'Monday';
//               break;
//             case 'Wednesday':
//               contributionDays = ['Friday', 'Saturday'];
//               payoutDay = 'Tuesday';
//               break;
//             default:
//               contributionDays = ['Wednesday', 'Thursday'];
//               payoutDay = 'Sunday';
//           }

//           setContributionDays(contributionDays);
//           setPayoutDay(payoutDay);

//           // Calculate the next due date for contributions
//           const today = moment();
//           let nextDue = today;

//           if (contributionDays.includes(today.format('dddd'))) {
//             nextDue = today;
//           } else {
//             nextDue = moment().day(contributionDays[0]); // Set to the next contribution day
//           }

//           setNextDueDate(nextDue.format('DD/MM/YYYY'));

//           // Fetch users
//           const usersQuery = query(collection(db, 'users'), where('groupId', '==', groupId));
//           const querySnapshot = await getDocs(usersQuery);
//           const usersList = querySnapshot.docs.map(doc => doc.data());
//           setUsers(usersList);

//           // Check if current user has paid registration fee and contribution
//           const currentUser = usersList.find(user => user.id === currentUserId);
//           if (currentUser) {
//             setHasPaidRegistrationFee(currentUser.hasPaidRegistrationFee);
//             setHasPaidContribution(currentUser.hasPaidContribution);
//           }
//         } else {
//           console.error('Group data not found');
//         }
//       } catch (error) {
//         console.error('Error fetching group details or users:', error);
//       }
//     };

//     fetchGroupDetails();
//   }, [db, groupId, currentUserId]);

//   // Handle Pay Registration Fee
//   const handlePayRegistrationFee = async () => {
//     try {
//       if (group.isRegistrationFee && !hasPaidRegistrationFee) {
//         await updateDoc(doc(db, 'users', currentUserId), {
//           hasPaidRegistrationFee: true,
//         });
//         setHasPaidRegistrationFee(true);
//       }

//       if (!hasPaidContribution) {
//         await updateDoc(doc(db, 'users', currentUserId), {
//           hasPaidContribution: true,
//         });
//         setHasPaidContribution(true);
//       }

//       Alert.alert('Payment Successful', 'You have successfully made the payment.');
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       Alert.alert('Payment Error', 'There was an issue processing your payment.');
//     }
//   };

//   // Handle Leave Group
//   const handleLeaveGroup = async () => {
//     if (!currentUserId) {
//       console.error('Current user ID is not defined');
//       return;
//     }

//     Alert.alert(
//       'Leave Group',
//       'Are you sure you want to leave this group?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Leave',
//           onPress: async () => {
//             try {
//               const groupRef = doc(db, 'groups', groupId);
//               const groupDoc = await getDoc(groupRef);

//               if (!groupDoc.exists()) {
//                 console.error('Group does not exist');
//                 return;
//               }

//               const groupData = groupDoc.data();
//               if (!groupData.members || !groupData.members.includes(currentUserId)) {
//                 console.error('User is not a member of the group');
//                 return;
//               }

//               await updateDoc(groupRef, {
//                 members: arrayRemove(currentUserId),
//               });

//               const userRef = doc(db, 'users', currentUserId);
//               await updateDoc(userRef, {
//                 groupId: null,
//               });

//               if (groupData.members.length === 1) {
//                 await deleteDoc(groupRef);
//               }

//               navigation.navigate('Groups');
//             } catch (error) {
//               console.error('Error leaving group:', error);
//             }
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Handle Pay Contribution
//   const handlePayContribution = () => {
//     const today = moment().format('dddd');
//     if (!contributionDays.includes(today)) {
//       Alert.alert('Info', `You can only make contributions on ${contributionDays.join(' and ')}.`);
//       return;
//     }

//     // Handle the contribution payment logic here
//   };

//   // Handle Close Announcement
//   const handleCloseAnnouncement = () => {
//     setShowAnnouncement(false);
//   };

//   if (!group) {
//     return (
//       <View style={styles.loadingContainer}>
//         <MaterialIcons name="group" size={50} color={COLORS.primary} />
//         <Text style={styles.loadingText}>Loading Group Data...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
//           <FontAwesome name="angle-left" size={28} color={COLORS.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{group.name}</Text>
//         <TouchableOpacity onPress={handleLeaveGroup} style={styles.headerButton}>
//           <MaterialIcons name="exit-to-app" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>

//       {/* Announcement Modal */}
//       {group.announcement && showAnnouncement && (
//         <Modal
//           transparent={true}
//           animationType="fade"
//           visible={showAnnouncement}
//         >
//           <View style={styles.announcementModal}>
//             <View style={styles.announcementModalContent}>
//               <View style={styles.announcementHeader}>
//                 <MaterialIcons name="announcement" size={24} color={COLORS.secondary} />
//                 <Text style={styles.announcementModalTitle}>Group Announcement</Text>
//               </View>
//               <Text style={styles.announcementModalText}>{group.announcement}</Text>
//               <TouchableOpacity 
//                 onPress={handleCloseAnnouncement} 
//                 style={styles.closeButton}
//               >
//                 <Text style={styles.closeButtonText}>Got It!</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {/* Group Info Card */}
//       <View style={styles.infoCard}>
//         <View style={styles.infoCardHeader}>
//           <MaterialCommunityIcons name="account-group" size={24} color={COLORS.white} />
//           <Text style={styles.infoCardTitle}>Group Information</Text>
//         </View>
//         <Text style={styles.groupDescription}>{group.description}</Text>
        
//         <View style={styles.infoRow}>
//           <MaterialCommunityIcons name="calendar-range" size={20} color={COLORS.primary} />
//           <Text style={styles.infoText}>
//             Duration: {formatDate(group.startDate)} - {formatDate(group.endDate)}
//           </Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <MaterialCommunityIcons name="account-multiple" size={20} color={COLORS.primary} />
//           <Text style={styles.infoText}>Members: {users.length}</Text>
//         </View>
//       </View>

//       {/* Payout Details Card */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="attach-money" size={24} color={COLORS.white} />
//           <Text style={styles.cardTitle}>Payout Details</Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <View style={styles.detailIcon}>
//             <MaterialCommunityIcons name="cash-multiple" size={18} color={COLORS.secondary} />
//           </View>
//           <Text style={styles.detailText}>Plan: {group.payoutPlan || 'N/A'}</Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <View style={styles.detailIcon}>
//             <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.secondary} />
//           </View>
//           <Text style={styles.detailText}>Duration: {group.contributionDuration || 'N/A'}</Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <View style={styles.detailIcon}>
//             <FontAwesome name="money" size={16} color={COLORS.secondary} />
//           </View>
//           <Text style={styles.detailText}>Payout Amount: ₦{group.payoutPerUser || 'N/A'}</Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <View style={styles.detailIcon}>
//             <MaterialCommunityIcons name="calendar-check" size={18} color={COLORS.secondary} />
//           </View>
//           <Text style={styles.detailText}>Payout Day: {payoutDay}</Text>
//         </View>
//       </View>

//       {/* Contribution Status Card */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <MaterialCommunityIcons name="chart-line" size={24} color={COLORS.white} />
//           <Text style={styles.cardTitle}>Contribution Status</Text>
//         </View>
        
//         <View style={styles.statusContainer}>
//           <View style={styles.statusItem}>
//             <MaterialCommunityIcons 
//               name={hasPaidRegistrationFee ? "check-circle" : "alert-circle"} 
//               size={24} 
//               color={hasPaidRegistrationFee ? COLORS.success : COLORS.warning} 
//             />
//             <Text style={styles.statusText}>
//               {hasPaidRegistrationFee ? 'Registration Paid' : 'Registration Pending'}
//             </Text>
//           </View>
          
//           <View style={styles.statusItem}>
//             <MaterialCommunityIcons 
//               name={hasPaidContribution ? "check-circle" : "alert-circle"} 
//               size={24} 
//               color={hasPaidContribution ? COLORS.success : COLORS.warning} 
//             />
//             <Text style={styles.statusText}>
//               {hasPaidContribution ? 'Contribution Paid' : 'Contribution Pending'}
//             </Text>
//           </View>
//         </View>
        
//         <Text style={styles.dueDateText}>
//           <MaterialCommunityIcons name="calendar-alert" size={16} color={COLORS.secondary} />
//           Next Due Date: {nextDueDate}
//         </Text>
//       </View>

//       {/* Action Buttons */}
//       <View style={styles.buttonContainer}>
//         {!hasPaidRegistrationFee && group.isRegistrationFee && (
//           <TouchableOpacity 
//             onPress={handlePayRegistrationFee} 
//             style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
//           >
//             <FontAwesome name="money" size={20} color={COLORS.white} />
//             <Text style={styles.actionButtonText}>Pay Registration Fee</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity 
//           onPress={handlePayContribution} 
//           style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
//         >
//           <MaterialIcons name="payment" size={20} color={COLORS.white} />
//           <Text style={styles.actionButtonText}>Pay Contribution</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Members Section */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="people" size={24} color={COLORS.white} />
//           <Text style={styles.cardTitle}>Group Members ({users.length})</Text>
//         </View>
        
//         {users.map((user, index) => (
//           <View key={user.id} style={styles.memberItem}>
//             <View style={styles.memberAvatar}>
//               <MaterialCommunityIcons name="account-circle" size={32} color={COLORS.primary} />
//             </View>
//             <Text style={styles.memberName}>{user.username}</Text>
//             {user.id === currentUserId && (
//               <View style={styles.currentUserBadge}>
//                 <Text style={styles.currentUserBadgeText}>You</Text>
//               </View>
//             )}
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: COLORS.lightGray,
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 18,
//     color: COLORS.darkGray,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   headerButton: {
//     padding: 5,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.white,
//     textAlign: 'center',
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   infoCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     padding: 20,
//     margin: 15,
//     marginBottom: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   infoCardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.secondary,
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 15,
//     marginLeft: -10,
//     marginRight: -10,
//     marginTop: -10,
//   },
//   infoCardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.white,
//     marginLeft: 10,
//   },
//   groupDescription: {
//     fontSize: 16,
//     color: COLORS.darkGray,
//     marginBottom: 15,
//     lineHeight: 22,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   infoText: {
//     fontSize: 15,
//     color: COLORS.darkGray,
//     marginLeft: 10,
//   },
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     padding: 15,
//     marginHorizontal: 15,
//     marginVertical: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.primary,
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 15,
//     marginLeft: -5,
//     marginRight: -5,
//     marginTop: -5,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.white,
//     marginLeft: 10,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailIcon: {
//     width: 30,
//     alignItems: 'center',
//   },
//   detailText: {
//     fontSize: 15,
//     color: COLORS.darkGray,
//     flex: 1,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   statusItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: COLORS.lightGray,
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   statusText: {
//     fontSize: 14,
//     marginLeft: 10,
//     color: COLORS.darkGray,
//   },
//   dueDateText: {
//     fontSize: 14,
//     color: COLORS.darkGray,
//     textAlign: 'center',
//     marginTop: 5,
//     fontStyle: 'italic',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 15,
//     marginVertical: 10,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     flex: 1,
//     marginHorizontal: 5,
//     elevation: 2,
//   },
//   actionButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.white,
//     marginLeft: 10,
//   },
//   memberItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   memberAvatar: {
//     marginRight: 15,
//   },
//   memberName: {
//     fontSize: 16,
//     color: COLORS.darkGray,
//     flex: 1,
//   },
//   currentUserBadge: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//   },
//   currentUserBadgeText: {
//     fontSize: 12,
//     color: COLORS.white,
//   },
//   announcementModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   announcementModalContent: {
//     backgroundColor: COLORS.white,
//     padding: 25,
//     borderRadius: 15,
//     width: '85%',
//     alignItems: 'center',
//   },
//   announcementHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   announcementModalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.secondary,
//     marginLeft: 10,
//   },
//   announcementModalText: {
//     fontSize: 16,
//     color: COLORS.darkGray,
//     marginBottom: 25,
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   closeButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     width: '100%',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
// });

// export default GroupDashboard;



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, StatusBar, TextInput } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, deleteDoc, writeBatch} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

// Theme Colors
const COLORS = {
  primary: '#4A6CF7', // Blue
  secondary: '#9C27B0', // Purple
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
};

// Format Date Function
// Update the formatDate function at the top of your file:
const formatDate = (date) => {
  if (!date) return 'N/A';
  
  // If it's a Firestore timestamp
  if (date.seconds) {
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
  
  // If it's already a formatted string (from CreateGroup)
  if (typeof date === 'string') {
    return date; // Return as-is since it's already formatted
  }
  
  return 'N/A';
};

const GroupDashboard = ({ route, navigation }) => {
  const { groupId } = route.params || {};
  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [hasPaidRegistrationFee, setHasPaidRegistrationFee] = useState(false);
  const [hasPaidContribution, setHasPaidContribution] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [contributionDays, setContributionDays] = useState([]);
  const [payoutDay, setPayoutDay] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [paymentPin, setPaymentPin] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('');

  const db = getFirestore();
  const auth = getAuth();

// Set current user ID
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUserId(user.uid);
    } else {
      console.error('No user is signed in');
    }
  });

  return () => unsubscribe();
}, [auth]);

// Fetch group details and users
useEffect(() => {
  const fetchGroupDetails = async () => {
    if (!groupId) {
      console.error('Group ID is not provided');
      return;
    }
    
    try {
      // 1. Fetch group data
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (!groupDoc.exists()) {
        console.error('Group data not found');
        return;
      }

      const groupData = groupDoc.data();
      setGroup({
        ...groupData,
        size: groupData.size || 0,
        startDate: groupData.startDate || '',
        endDate: groupData.endDate || '',
        registrationFeeAmount: groupData.registrationFeeAmount || 0,
        contributionAmount: groupData.contributionAmount || 0
      });

      // 2. Calculate contribution schedule
      const groupCreationDay = moment(groupData.createdAt.toDate());
      let contributionDays = [];
      let payoutDay = '';

      switch (groupCreationDay.format('dddd')) {
        case 'Monday':
          contributionDays = ['Wednesday', 'Thursday'];
          payoutDay = 'Sunday';
          break;
        case 'Tuesday':
          contributionDays = ['Thursday', 'Friday'];
          payoutDay = 'Monday';
          break;
        case 'Wednesday':
          contributionDays = ['Friday', 'Saturday'];
          payoutDay = 'Tuesday';
          break;
        default:
          contributionDays = ['Wednesday', 'Thursday'];
          payoutDay = 'Sunday';
      }

      setContributionDays(contributionDays);
      setPayoutDay(payoutDay);

      // Calculate next due date
      const today = moment();
      let nextDue = contributionDays.includes(today.format('dddd')) 
        ? today 
        : moment().day(contributionDays[0]);
      setNextDueDate(nextDue.format('DD/MM/YYYY'));

      // 3. Fetch users in the group
      const usersQuery = query(collection(db, 'users'), where('groupId', '==', groupId));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);

      // 4. Check payment status (both in transactions and user document)
      if (currentUserId) {
        // Check transactions first (most reliable)
        const txQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', currentUserId),
          where('groupId', '==', groupId),
          where('status', '==', 'success')
        );
        const txSnapshot = await getDocs(txQuery);
        
        let paidRegistration = false;
        let paidContribution = false;
        
        txSnapshot.forEach(doc => {
          const tx = doc.data();
          if (tx.transactionType === 'registration_fee') paidRegistration = true;
          if (tx.transactionType === 'contribution') paidContribution = true;
        });

        // Fallback to user document if no transactions found
        const currentUser = usersList.find(user => user.id === currentUserId);
        if (currentUser) {
          paidRegistration = paidRegistration || currentUser.hasPaidRegistrationFee || false;
          paidContribution = paidContribution || currentUser.hasPaidContribution || false;
          
          // Update user document if needed (for backward compatibility)
          if (currentUser.hasPaidRegistrationFee !== paidRegistration || 
              currentUser.hasPaidContribution !== paidContribution) {
            await updateDoc(doc(db, 'users', currentUserId), {
              hasPaidRegistrationFee: paidRegistration,
              hasPaidContribution: paidContribution
            });
          }
        }

        setHasPaidRegistrationFee(paidRegistration);
        setHasPaidContribution(paidContribution);
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  fetchGroupDetails();
}, [db, groupId, currentUserId]);

const initiatePayment = (type) => {
  setPaymentType(type);
  if (type === 'registration') {
    // Use the registration fee amount from the group data
    setPaymentAmount(group.registrationFeeAmount || 0);
    if (!group.registrationFeeAmount || group.registrationFeeAmount <= 0) {
      Alert.alert(
        'No Registration Fee', 
        'This group has no registration fee set.',
        [{ text: 'OK' }]
      );
      return;
    }
  } else {
    // Use the contribution amount from the group data
    setPaymentAmount(group.contributionAmount || 0);
  }
  setShowPaymentModal(true);
};

// Verify payment PIN
const verifyPaymentPin = async () => {
  try {
    // Validate PIN length first
    if (paymentPin.length !== 4) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits');
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', currentUserId));
    
    if (!userDoc.exists()) {
      Alert.alert('Error', 'User data not found');
      return;
    }

    const userData = userDoc.data();
    const storedPin = userData.paymentPin;

    // Check if user has a PIN set
    if (!storedPin) {
      Alert.alert(
        'No PIN Set', 
        'You need to set a payment PIN first.',
        [
          { 
            text: 'Set PIN', 
            onPress: () => {
              setShowPinModal(false);
              navigation.navigate('CreatePaymentPin');
            }
          },
          { text: 'Cancel' }
        ]
      );
      return;
    }

    // Verify the PIN
    if (paymentPin === storedPin) {
      await processPayment();
    } else {
      Alert.alert(
        'Incorrect PIN', 
        'The PIN you entered is incorrect. Please try again.',
        [{ text: 'OK', onPress: () => setPaymentPin('') }]
      );
    }
  } catch (error) {
    console.error('Error verifying PIN:', error);
    Alert.alert(
      'Error', 
      'Failed to verify PIN. Please try again.',
      [{ text: 'OK', onPress: () => setPaymentPin('') }]
    );
  }
};

// Process payment after PIN verification
const processPayment = async () => {
  try {
    setShowPinModal(false);
    
    // Create transaction record
    const transactionData = {
      userId: currentUserId,
      groupId: groupId,
      groupName: group.name,
      amount: paymentAmount,
      transactionType: paymentType === 'registration' ? 'registration_fee' : 'contribution',
      description: paymentType === 'registration' 
        ? `Registration fee for ${group.name}` 
        : `Contribution payment for ${group.name}`,
      status: 'success',
      createdAt: new Date(),
      paymentMethod: 'app_payment',
      reference: `GRP-${Date.now()}`,
    };

    // Use batch write to ensure both updates succeed or fail together
    const batch = writeBatch(db);
    
    // Update user payment status
    const userRef = doc(db, 'users', currentUserId);
    if (paymentType === 'registration') {
      batch.update(userRef, { hasPaidRegistrationFee: true });
    } else {
      batch.update(userRef, { hasPaidContribution: true });
    }
    
    // Add transaction record
    const transactionsRef = collection(db, 'transactions');
    const newTransactionRef = doc(transactionsRef);
    batch.set(newTransactionRef, transactionData);
    
    await batch.commit();

    // Update local state
    if (paymentType === 'registration') {
      setHasPaidRegistrationFee(true);
    } else {
      setHasPaidContribution(true);
    }
    
    // Show success message
    Alert.alert(
      'Payment Successful', 
      `Your ${paymentType === 'registration' ? 'registration fee' : 'contribution'} of ₦${paymentAmount.toFixed(2)} was processed successfully!`,
      [{ text: 'OK', onPress: () => setPaymentPin('') }]
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    Alert.alert(
      'Payment Failed', 
      'There was an error processing your payment. Please try again.',
      [{ text: 'OK' }]
    );
  } finally {
    setPaymentPin('');
  }
};

// Handle Leave Group
const handleLeaveGroup = async () => {
  if (!currentUserId) {
    console.error('Current user ID is not defined');
    return;
  }

  Alert.alert(
    'Leave Group',
    'Are you sure you want to leave this group?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Leave',
        onPress: async () => {
          try {
            const groupRef = doc(db, 'groups', groupId);
            const groupDoc = await getDoc(groupRef);

            if (!groupDoc.exists()) {
              console.error('Group does not exist');
              return;
            }

            const groupData = groupDoc.data();
            if (!groupData.members || !groupData.members.includes(currentUserId)) {
              console.error('User is not a member of the group');
              return;
            }

            await updateDoc(groupRef, {
              members: arrayRemove(currentUserId),
            });

            const userRef = doc(db, 'users', currentUserId);
            await updateDoc(userRef, {
              groupId: null,
            });

            if (groupData.members.length === 1) {
              await deleteDoc(groupRef);
            }

            navigation.navigate('Groups');
          } catch (error) {
            console.error('Error leaving group:', error);
          }
        },
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
};

// Handle Close Announcement
const handleCloseAnnouncement = () => {
  setShowAnnouncement(false);
};

if (!group) {
  return (
    <View style={styles.loadingContainer}>
      <MaterialIcons name="group" size={50} color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading Group Data...</Text>
    </View>
  );
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <FontAwesome name="angle-left" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{group.name}</Text>
        <TouchableOpacity onPress={handleLeaveGroup} style={styles.headerButton}>
          <MaterialIcons name="exit-to-app" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Announcement Modal */}
      {group.announcement && showAnnouncement && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showAnnouncement}
        >
          <View style={styles.announcementModal}>
            <View style={styles.announcementModalContent}>
              <View style={styles.announcementHeader}>
                <MaterialIcons name="announcement" size={24} color={COLORS.secondary} />
                <Text style={styles.announcementModalTitle}>Group Announcement</Text>
              </View>
              <Text style={styles.announcementModalText}>{group.announcement}</Text>
              <TouchableOpacity 
                onPress={handleCloseAnnouncement} 
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Got It!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Group Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <MaterialCommunityIcons name="account-group" size={24} color={COLORS.white} />
          <Text style={styles.infoCardTitle}>Group Information</Text>
        </View>
        <Text style={styles.groupDescription}>{group.description}</Text>
        
        <View style={styles.infoRow}>
    <MaterialCommunityIcons name="calendar-range" size={20} color={COLORS.primary} />
    <Text style={styles.infoText}>
      Duration: {formatDate(group.startDate)} - {formatDate(group.endDate)}
    </Text>
  </View>
  
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name="account-multiple" size={20} color={COLORS.primary} />
    <Text style={styles.infoText}>
      Members: {group.size || 'N/A'}
    </Text>
  </View>
      </View>

      {/* Payout Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="attach-money" size={24} color={COLORS.white} />
          <Text style={styles.cardTitle}>Payout Details</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialCommunityIcons name="cash-multiple" size={18} color={COLORS.secondary} />
          </View>
          <Text style={styles.detailText}>Plan: {group.payoutPlan || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.secondary} />
          </View>
          <Text style={styles.detailText}>Duration: {group.contributionDuration || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome name="money" size={16} color={COLORS.secondary} />
          </View>
          <Text style={styles.detailText}>Payout Amount: ₦{group.payoutPerUser || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialCommunityIcons name="calendar-check" size={18} color={COLORS.secondary} />
          </View>
          <Text style={styles.detailText}>Payout Day: {payoutDay}</Text>
        </View>
      </View>

      {/* Contribution Status Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="chart-line" size={24} color={COLORS.white} />
          <Text style={styles.cardTitle}>Contribution Status</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <MaterialCommunityIcons 
              name={hasPaidRegistrationFee ? "check-circle" : "alert-circle"} 
              size={24} 
              color={hasPaidRegistrationFee ? COLORS.success : COLORS.warning} 
            />
            <Text style={styles.statusText}>
              {hasPaidRegistrationFee ? 'Registration fee Paid' : 'Registration fee Pending'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <MaterialCommunityIcons 
              name={hasPaidContribution ? "check-circle" : "alert-circle"} 
              size={24} 
              color={hasPaidContribution ? COLORS.success : COLORS.warning} 
            />
            <Text style={styles.statusText}>
              {hasPaidContribution ? 'Contribution fee Paid' : 'Contribution fee Pending'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.dueDateText}>
          <MaterialCommunityIcons name="calendar-alert" size={16} color={COLORS.secondary} />
          Next Due Date: {nextDueDate}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!hasPaidRegistrationFee && group.isRegistrationFee && (
          <TouchableOpacity 
            onPress={() => initiatePayment('registration')} 
            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
          >
            <FontAwesome name="money" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Pay Registration Fee</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={() => initiatePayment('contribution')} 
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
        >
          <MaterialIcons name="payment" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Pay Contribution</Text>
        </TouchableOpacity>
      </View>

      {/* Members Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="people" size={24} color={COLORS.white} />
          <Text style={styles.cardTitle}>Group Members ({users.length})</Text>
        </View>
        
        {users.map((user, index) => (
          <View key={user.id} style={styles.memberItem}>
            <View style={styles.memberAvatar}>
              <MaterialCommunityIcons name="account-circle" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.memberName}>{user.username}</Text>
            {user.id === currentUserId && (
              <View style={styles.currentUserBadge}>
                <Text style={styles.currentUserBadgeText}>You</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Payment Confirmation Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={showPaymentModal}
  onRequestClose={() => setShowPaymentModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Confirm Payment</Text>
      
      <View style={styles.paymentDetailRow}>
        <Text style={styles.paymentDetailLabel}>Payment Type:</Text>
        <Text style={styles.paymentDetailValue}>
          {paymentType === 'registration' ? 'Registration Fee' : 'Contribution'}
        </Text>
      </View>
      
      <View style={styles.paymentDetailRow}>
        <Text style={styles.paymentDetailLabel}>Amount:</Text>
        <Text style={styles.paymentDetailValue}>
          ₦{(paymentAmount || 0).toFixed(2)}
        </Text>
      </View>
      
      {paymentType === 'registration' && (
        <Text style={styles.paymentNote}>
          This is a one-time registration fee for joining the group
        </Text>
      )}
      
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity 
          style={[styles.modalButton, { backgroundColor: COLORS.danger }]}
          onPress={() => setShowPaymentModal(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.modalButton, { backgroundColor: COLORS.success }]}
          onPress={() => {
            if (paymentAmount > 0) {
              setShowPaymentModal(false);
              setShowPinModal(true);
            } else {
              Alert.alert(
                'Invalid Amount', 
                'Payment amount must be greater than 0',
                [{ text: 'OK' }]
              );
            }
          }}
        >
          <Text style={styles.modalButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      {/* PIN Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPinModal}
        onRequestClose={() => {
          setShowPinModal(false);
          setPaymentPin('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Payment PIN</Text>
            <Text style={styles.modalSubtitle}>Please enter your 4-digit PIN to confirm payment</Text>
            
            <TextInput
              style={styles.pinInput}
              keyboardType="numeric"
              secureTextEntry={true}
              maxLength={4}
              value={paymentPin}
              onChangeText={(text) => setPaymentPin(text.replace(/[^0-9]/g, ''))} // Ensure only numbers
              placeholder="••••"
              placeholderTextColor="#999"
              autoFocus={true}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: COLORS.danger }]}
                onPress={() => {
                  setShowPinModal(false);
                  setPaymentPin('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  { 
                    backgroundColor: paymentPin.length === 4 ? COLORS.success : '#cccccc',
                    opacity: paymentPin.length === 4 ? 1 : 0.7
                  }
                ]}
                onPress={verifyPaymentPin}
                disabled={paymentPin.length !== 4}
              >
                <Text style={styles.modalButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.lightGray,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.darkGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    marginLeft: -10,
    marginRight: -10,
    marginTop: -10,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  groupDescription: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.darkGray,
    marginLeft: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    marginLeft: -5,
    marginRight: -5,
    marginTop: -5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    width: 30,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 15,
    color: COLORS.darkGray,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    flex: 1,
    marginHorizontal: 5,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 10,
    color: COLORS.darkGray,
  },
  dueDateText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  memberAvatar: {
    marginRight: 15,
  },
  memberName: {
    fontSize: 16,
    color: COLORS.darkGray,
    flex: 1,
  },
  currentUserBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentUserBadgeText: {
    fontSize: 12,
    color: COLORS.white,
  },
  announcementModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  announcementModalContent: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  announcementModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginLeft: 10,
  },
  announcementModalText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 25,
    lineHeight: 24,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  paymentDetailLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  paymentDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
    marginVertical: 15,
  },
});

export default GroupDashboard;