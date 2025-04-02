

    // #############   ####    ########   ##        ##     ###     ########   ##
    // ###  ###  ###    ##    ##          ##        ##   ##   ##   ##         ##
    // ###  ###  ###    ##    ##          ## ###### ##  #########  ######     ##
    // ###  ###  ###    ##    ##          ##        ##  ##     ##  ##         ##
    // ###  ###  ###    ##    ##          ##        ##  ##     ##  ##         ##
    // ###  ###  ###   ####    ########   ##        ##  ##     ##  ########   ########




    


//  ##########   ########   ########   ##        ##
// ##   ##   ##  ##        ##          ##        ##
//      ##       ######    ##          ## ###### ##  #######   #######     #######    ######    ######## 
//      ##       ##        ##          ##        ##  ##        ##    ##   ##     ##  ##        ##  ##  ##
//      ##       ##        ##          ##        ##  #####     #######    ##     ##  ######        ##
//      ##       ##        ##          ##        ##  ##        ##   ##    ##     ##       ##       ##
//      ##       ########   ########   ##        ##  ##        ##    ##    #######   ######        ##
     




// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import navigation hook
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// const TransactionHistory = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation(); // Use navigation hook

//   const currentUser = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchTransactions = async () => {
//       try {
//         const transactionsRef = collection(FIREBASE_DB, 'transactions');
//         const q = query(
//           transactionsRef,
//           where('userId', '==', currentUser.uid),
//           orderBy('createdAt', 'desc')
//         );

//         const querySnapshot = await getDocs(q);
//         const fetchedTransactions = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setTransactions(fetchedTransactions);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching transactions:', error.message);
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (transactions.length === 0) {
//     return (
//       <View style={styles.noDataContainer}>
//         <Text style={styles.noDataText}>No transactions found.</Text>
//       </View>
//     );
//   }

//   const handleTransactionClick = (transaction) => {
//     navigation.navigate('ReceiptScreen', { transaction });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>
//       <FlatList
//         data={transactions}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.transactionItem}
//             onPress={() => handleTransactionClick(item)}
//           >
//             <Text style={styles.description}>{item.description}</Text>
//             <Text style={styles.amount}>
//               {item.transactionType === 'deposit' ? '+' : '-'}N{item.amount.toFixed(2)}
//             </Text>
//             <Text style={styles.status}>
//               Status: <Text style={styles[item.status]}>{item.status}</Text>
//             </Text>
//             <Text style={styles.date}>
//               {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     padding: 16,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#999',
//   },
//   transactionItem: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   description: {
//     fontSize: 14,
//     color: '#333',
//   },
//   amount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   status: {
//     fontSize: 14,
//     marginTop: 5,
//   },
//   success: {
//     color: 'green',
//   },
//   failed: {
//     color: 'red',
//   },
//   date: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 5,
//   },
// });

// export default TransactionHistory;









import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
        setFilteredTransactions(fetchedTransactions);
        
        // Extract unique months from transactions
        const months = new Set();
        fetchedTransactions.forEach(transaction => {
          if (transaction.createdAt) {
            const date = new Date(transaction.createdAt.seconds * 1000);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            months.add(monthYear);
          }
        });
        
        const sortedMonths = Array.from(months).sort((a, b) => {
          return new Date(b) - new Date(a);
        });
        
        setAvailableMonths(['All Months', ...sortedMonths]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  const filterByMonth = (month) => {
    setSelectedMonth(month);
    setModalVisible(false);
    
    if (month === 'All Months') {
      setFilteredTransactions(transactions);
      return;
    }
    
    const filtered = transactions.filter(transaction => {
      if (!transaction.createdAt) return false;
      const date = new Date(transaction.createdAt.seconds * 1000);
      const transactionMonthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      return transactionMonthYear === month;
    });
    
    setFilteredTransactions(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6a5acd" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Ionicons name="receipt-outline" size={60} color="#6a5acd" />
        <Text style={styles.noDataText}>No transactions found</Text>
        <Text style={styles.noDataSubText}>Your transactions will appear here</Text>
      </View>
    );
  }

  const handleTransactionClick = (transaction) => {
    navigation.navigate('ReceiptScreen', { transaction });
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit':
        return <Ionicons name="arrow-down-circle" size={24} color="#4CAF50" />;
      case 'withdrawal':
        return <Ionicons name="arrow-up-circle" size={24} color="#F44336" />;
      default:
        return <Ionicons name="swap-horizontal" size={24} color="#6a5acd" />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      
      {/* Month Filter Dropdown */}
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{selectedMonth}</Text>
        <Ionicons name="chevron-down" size={20} color="#6a5acd" />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            {availableMonths.map((month, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.monthItem,
                  pressed && styles.monthItemPressed,
                  month === selectedMonth && styles.selectedMonthItem
                ]}
                onPress={() => filterByMonth(month)}
              >
                <Text style={styles.monthText}>{month}</Text>
                {month === selectedMonth && (
                  <Ionicons name="checkmark" size={20} color="#6a5acd" />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      
      {filteredTransactions.length === 0 ? (
        <View style={styles.noFilteredDataContainer}>
          <Ionicons name="calendar-outline" size={50} color="#6a5acd" />
          <Text style={styles.noFilteredDataText}>No transactions for {selectedMonth}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.transactionItem}
              onPress={() => handleTransactionClick(item)}
            >
              <View style={styles.transactionHeader}>
                <View style={styles.iconContainer}>
                  {getTransactionIcon(item.transactionType)}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.date}>
                    {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                  </Text>
                </View>
                <Text style={[
                  styles.amount,
                  item.transactionType === 'deposit' ? styles.amountPositive : styles.amountNegative
                ]}>
                  {item.transactionType === 'deposit' ? '+' : '-'}N{item.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[
                  styles.status,
                  item.status === 'success' ? styles.success : 
                  item.status === 'failed' ? styles.failed : styles.pending
                ]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a5acd',
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6a5acd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#4169e1',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 16,
    maxHeight: '60%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4169e1',
    marginBottom: 16,
    textAlign: 'center',
  },
  monthItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthItemPressed: {
    backgroundColor: '#f5f7ff',
  },
  selectedMonthItem: {
    backgroundColor: '#f0e6ff',
  },
  monthText: {
    fontSize: 16,
    color: '#333',
  },
  noFilteredDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noFilteredDataText: {
    fontSize: 16,
    color: '#6a5acd',
    marginTop: 10,
    fontWeight: '500',
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountPositive: {
    color: '#4CAF50',
  },
  amountNegative: {
    color: '#F44336',
  },
  statusContainer: {
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  success: {
    color: '#4CAF50',
  },
  failed: {
    color: '#F44336',
  },
  pending: {
    color: '#FFA500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  noDataText: {
    fontSize: 20,
    color: '#6a5acd',
    marginTop: 10,
    fontWeight: '600',
  },
  noDataSubText: {
    color: '#888',
    fontSize: 14,
  },
});

export default TransactionHistory;