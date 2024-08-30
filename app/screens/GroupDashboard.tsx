import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



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
  const db = getFirestore();
  const auth = getAuth();

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

          const usersQuery = query(collection(db, 'users'), where('groupId', '==', groupId));
          const querySnapshot = await getDocs(usersQuery);
          const usersList = querySnapshot.docs.map(doc => doc.data());
          setUsers(usersList);

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

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
  };

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

      <View style={styles.graphSection}>
        <View style={styles.graphPlaceholder}>
          <Text>No graph available</Text>
        </View>
        <Text style={styles.graphCycle}>Cycle Completed: Twice</Text>
      </View>

      <View style={styles.contributionSection}>
        <View style={styles.contributionCard}>
          <Text style={styles.contributionText}>Total Contribution</Text>
          <Text style={styles.contributionAmount}>No Contribution</Text>
        </View>
        <View style={styles.payoutCard}>
          <Text style={styles.payoutText}>Paid Out</Text>
          <Text style={styles.payoutAmount}>No</Text>
        </View>
      </View>

      {group.isRegistrationFee && !hasPaidRegistrationFee && (
        <View style={styles.pendingPaymentsSection}>
          <Text style={styles.pendingPaymentsTitle}>Pending Payments</Text>
          <View style={styles.pendingPaymentCard}>
            <Text style={styles.pendingStatus}>Registration Fee: ₦{group.registrationFeeAmount || 'N/A'}</Text>
            <TouchableOpacity style={styles.payNowButton} onPress={handlePayRegistrationFee}>
              <Text style={styles.payNowText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!hasPaidContribution && (
        <View style={styles.pendingPaymentsSection}>
          <Text style={styles.pendingPaymentsTitle}>Pending Payments</Text>
          <View style={styles.pendingPaymentCard}>
            <Text style={styles.pendingStatus}>Contribution: ₦{group.contributionAmount || 'N/A'}</Text>
            <TouchableOpacity style={styles.payNowButton} onPress={handlePayRegistrationFee}>
              <Text style={styles.payNowText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.latestContributionsTitle}>Latest Contributions</Text>

      {users.map((user, index) => (
        <View key={index} style={styles.userContainer}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.paymentStatus}>
            {user.hasPaidRegistrationFee ? 'Paid' : 'Unpaid'} | {user.hasPaidContribution ? 'Paid' : 'Unpaid'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goalSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  payoutDetailsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  payoutDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  payoutDetailsText: {
    fontSize: 14,
    marginBottom: 4,
  },
  profitSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  profitText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profitAmount: {
    fontSize: 14,
  },
  graphSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  graphPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  graphCycle: {
    fontSize: 14,
    color: '#555',
  },
  contributionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contributionCard: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  payoutCard: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  contributionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contributionAmount: {
    fontSize: 14,
  },
  payoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  payoutAmount: {
    fontSize: 14,
  },
  pendingPaymentsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  pendingPaymentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pendingPaymentCard: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  pendingStatus: {
    fontSize: 14,
    marginBottom: 8,
  },
  payNowButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  payNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  latestContributionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentStatus: {
    fontSize: 14,
    color: '#555',
  },
  announcementModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  announcementModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  announcementModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  announcementModalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default GroupDashboard;
