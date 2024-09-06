import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

// Format Date Function
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
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
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          setGroup(groupData);

          // Calculate contribution days and payout day
          const groupCreationDay = moment(groupData.createdAt.toDate());
          let contributionDays = [];
          let payoutDay = '';

          // Logic for determining contribution and payout days
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

          // Calculate the next due date for contributions
          const today = moment();
          let nextDue = today;

          if (contributionDays.includes(today.format('dddd'))) {
            nextDue = today;
          } else {
            nextDue = moment().day(contributionDays[0]); // Set to the next contribution day
          }

          setNextDueDate(nextDue.format('DD/MM/YYYY'));

          // Fetch users
          const usersQuery = query(collection(db, 'users'), where('groupId', '==', groupId));
          const querySnapshot = await getDocs(usersQuery);
          const usersList = querySnapshot.docs.map(doc => doc.data());
          setUsers(usersList);

          // Check if current user has paid registration fee and contribution
          const currentUser = usersList.find(user => user.id === currentUserId);
          if (currentUser) {
            setHasPaidRegistrationFee(currentUser.hasPaidRegistrationFee);
            setHasPaidContribution(currentUser.hasPaidContribution);
          }
        } else {
          console.error('Group data not found');
        }
      } catch (error) {
        console.error('Error fetching group details or users:', error);
      }
    };

    fetchGroupDetails();
  }, [db, groupId, currentUserId]);

  // Handle Pay Registration Fee
  const handlePayRegistrationFee = async () => {
    try {
      if (group.isRegistrationFee && !hasPaidRegistrationFee) {
        await updateDoc(doc(db, 'users', currentUserId), {
          hasPaidRegistrationFee: true,
        });
        setHasPaidRegistrationFee(true);
      }

      if (!hasPaidContribution) {
        await updateDoc(doc(db, 'users', currentUserId), {
          hasPaidContribution: true,
        });
        setHasPaidContribution(true);
      }

      Alert.alert('Payment Successful', 'You have successfully made the payment.');
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Payment Error', 'There was an issue processing your payment.');
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

  // Handle Pay Contribution
  const handlePayContribution = () => {
    const today = moment().format('dddd');
    if (!contributionDays.includes(today)) {
      Alert.alert('Info', `You can only make contributions on ${contributionDays.join(' and ')}.`);
      return;
    }

    // Handle the contribution payment logic here
  };

  // Handle Close Announcement
  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
  };

  if (!group) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{group.name}</Text>
        <TouchableOpacity onPress={handleLeaveGroup}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {group.announcement && showAnnouncement && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showAnnouncement}
        >
          <View style={styles.announcementModal}>
            <View style={styles.announcementModalContent}>
              <Text style={styles.announcementModalTitle}>Announcement</Text>
              <Text style={styles.announcementModalText}>{group.announcement}</Text>
              <TouchableOpacity onPress={handleCloseAnnouncement} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Text style={styles.title}>Group Dashboard</Text>

      <Text style={styles.groupName}>{group.name}</Text>
      <Text style={styles.groupDescription}>{group.description}</Text>

      <View style={styles.goalSection}>
        <Text style={styles.goalText}>Duration: {formatDate(group.startDate)} - {formatDate(group.endDate)}</Text>
      </View>

      <View style={styles.payoutDetailsSection}>
        <Text style={styles.payoutDetailsTitle}>Payout Details</Text>
        <Text style={styles.payoutDetailsText}>Payout Option: {group.payoutPlan || 'N/A'}</Text>
        <Text style={styles.payoutDetailsText}>Duration: {group.contributionDuration || 'N/A'}</Text>
        <Text style={styles.payoutDetailsText}>Payout Per Person: ₦{group.payoutPerUser || 'N/A'}</Text>
      </View>

      <View style={styles.profitSection}>
        <Text style={styles.profitText}>Profit</Text>
        <Text style={styles.profitAmount}>No Contribution</Text>
      </View>

      <View style={styles.paymentSection}>
        {!hasPaidRegistrationFee && group.isRegistrationFee && (
          <TouchableOpacity onPress={handlePayRegistrationFee} style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Registration Fee</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handlePayContribution} style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay Contribution</Text>
        </TouchableOpacity>

        <Text style={styles.nextDueDateText}>Next Due Date: {nextDueDate}</Text>
      </View>

      <View style={styles.memberSection}>
        <Text style={styles.memberSectionTitle}>Group Members</Text>
        {users.map(user => (
          <Text key={user.id} style={styles.memberText}>{user.username}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  groupDescription: {
    fontSize: 16,
    marginBottom: 15,
  },
  goalSection: {
    marginBottom: 20,
  },
  goalText: {
    fontSize: 16,
  },
  payoutDetailsSection: {
    marginBottom: 20,
  },
  payoutDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  payoutDetailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  profitSection: {
    marginBottom: 20,
  },
  profitText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profitAmount: {
    fontSize: 16,
  },
  paymentSection: {
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  nextDueDateText: {
    fontSize: 16,
    color: '#555',
  },
  memberSection: {
    marginBottom: 20,
  },
  memberSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberText: {
    fontSize: 16,
    marginBottom: 5,
  },
  announcementModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  announcementModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  announcementModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  announcementModalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GroupDashboard;
