// import React from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// // Mock transaction data
// const transactions = [
//   {
//     id: '1',
//     type: 'Deposit',
//     amount: 5000,
//     date: '2024-11-28 14:30',
//     transactionId: 'TXN123456', 
//     status: 'Success',
//     accountNumber: '0012788558',
//     bankName: 'Wema Bank',
//   },
//   {
//     id: '2',
//     type: 'Withdrawal',
//     amount: 2000,
//     date: '2024-11-27 12:15',
//     transactionId: 'TXN654321',
//     status: 'Success',
//     accountNumber: '7007907678',
//     bankName: 'Sterling Bank',
//   },
// ];

// // Transaction Card Component
// const TransactionCard = ({ transaction }) => {
//   const navigation = useNavigation();

//   const handlePress = () => {
//     navigation.navigate('ReceiptScreen', { transaction });
//   };

//   return (
//     <TouchableOpacity onPress={handlePress} style={styles.card}>
//       <Text style={styles.type}>{transaction.type}</Text>
//       <Text style={styles.amount}>Amount: ${transaction.amount}</Text>
//       <Text style={styles.date}>Date: {transaction.date}</Text>
//       <Text style={styles.transactionId}>Transaction ID: {transaction.transactionId}</Text>
//       <Text style={styles.status}>Status: {transaction.status}</Text>
//     </TouchableOpacity>
//   );
// };

// // Main Transaction History Component
// const TransactionHistory = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>
//       <FlatList
//         data={transactions}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <TransactionCard transaction={item} />}
//         contentContainerStyle={styles.list}
//       />
//     </View>
//   );
// };

// export default TransactionHistory;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   list: {
//     paddingBottom: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   type: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   amount: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 4,
//   },
//   date: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   transactionId: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   status: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#4CAF50', // Green for success
//   },
// });















import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the currently signed-in user
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(FIREBASE_DB, 'transactions');
        const q = query(
          transactionsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedTransactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(fetchedTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No transactions found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.amount}>
              {item.transactionType === 'deposit' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            <Text style={styles.status}>
              Status: <Text style={styles[item.status]}>{item.status}</Text>
            </Text>
            <Text style={styles.date}>
              {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    marginTop: 5,
  },
  success: {
    color: 'green',
  },
  failed: {
    color: 'red',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default TransactionHistory;
